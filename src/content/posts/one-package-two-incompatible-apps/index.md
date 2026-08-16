---
title: "One Package, Two Incompatible Apps"
published: 2026-08-15
description: "A DevTools panel that worked in one app broke the moment a second app wanted it. Turning it into a package meant one rule: stop importing the router and the cache client, and let the app hand them in."
image: ""
tags: [Developer Experience, Web Development, Architecture]
category: Development
draft: true
---

In the [last post](/posts/in-app-devtools-panel/) I described a DevTools panel I built inside one frontend: a floating switchboard that swaps mocked responses, flips feature flags, and jumps to any route without a rebuild. It worked. I reached for it twenty times a day.

Then a second application wanted it. And that request revealed something I had not noticed: the panel wasn't a tool. It was one app's internals wearing a UI.

## Three things the panel couldn't do on its own

The panel needs three capabilities that are inherently app-specific:

1. **Navigate to a route.** That needs the app's router.
2. **Invalidate caches** after swapping a mock, so components refetch. That needs the app's data-cache client.
3. **Intercept requests.** That needs the app's MSW worker instance.

The original implementation imported all three directly. It reached into the app it was born in, called `navigate` from that app's router, called `invalidateQueries` on that app's cache client, and imported that app's worker. For one app, that's not a bug. It's the shortest path to a working tool.

For two apps, it's a wall.

## The incompatibility was real, not cosmetic

I assumed the second app would need a version bump somewhere. It was worse than that. Here is what the two apps actually ran:

| Concern | Application A | Application B |
|---|---|---|
| Router | `react-router-dom` v6 | `react-router` v7 |
| Data cache | TanStack Query **+** Apollo Client | Apollo Client **only** |
| Request mocking | MSW 2.x | MSW 2.x |
| Styling | StyleX | StyleX |

Two of the three critical dependencies differ, and not by version. By existence.

`react-router-dom` v6 to `react-router` v7 is a different package name with a changed API surface. You cannot satisfy both with a single peer range, because they aren't the same package with two versions. They're two packages.

The cache is worse. Application B has no TanStack Query at all. So a line calling `queryClient.invalidateQueries()` in the panel isn't a version mismatch in Application B. It's a reference to a module that isn't installed. The import fails before any logic runs.

MSW and StyleX matched across both apps, so those stayed as genuine peer dependencies. The app already has them; the package can assume them. Everything else had to be inverted.

## The golden rule

Here's the rule the whole extraction rests on:

> The package's `src/` must not import the router or the cache clients. Not a different version. Not at all.

That sounds absolute because it is. The moment the package imports `react-router` or `@tanstack/react-query`, it has picked a side, and the other app can't install it. So the package imports neither, ever, and a CI check enforces it (that's [post #9](/posts/encode-invariants-as-checks/), the guardrail that keeps this honest).

This is dependency inversion at the package boundary. Instead of the panel reaching into the app, the app hands the panel plain callbacks describing how things work here. The panel doesn't know what a router is. It knows there's a function it can call when it wants to navigate.

## The config object

Everything host-specific arrives through one object:

```ts
interface DevToolsConfig {
  // data the panel renders
  fixtures:      FixtureRegistryEntry[];
  routes:        DevRouteGroup[];
  getMswWorker:  () => Promise<MswWorkerLike | null>;
  featureFlags?: FeatureFlagRegistryEntry[];

  // host adapters, all optional
  onNavigate?:   (path: string, options?: { state?: unknown }) => void;
  onAfterApply?: () => void | Promise<void>;
  onRefetch?:    () => void | Promise<void>;
}
```

Even MSW, a real peer dependency, comes in through a minimal structural type (`MswWorkerLike`: two methods, `use` and `resetHandlers`) rather than MSW's own `SetupWorker`. Any worker exposing those two methods satisfies it. The package stays loose on purpose.

Now the same package, wired into two apps that share almost nothing.

**Application A**, React Router v6, Apollo plus TanStack Query:

```ts
initDevTools({
  fixtures, routes, featureFlags,
  getMswWorker: loadMswBrowserWorker,
  onNavigate: (path, options) => navigate(path, { state: options?.state }),
  onAfterApply: async () => {
    await apolloClient.resetStore();
    await queryClient.invalidateQueries();
  },
  onRefetch: () => queryClient.invalidateQueries(),
});
```

Application A has two cache clients, so `onAfterApply` clears both. The package never learns there are two.

**Application B**, React Router v7, Apollo only:

```ts
initDevTools({
  fixtures, routes,
  getMswWorker: loadMswBrowserWorker,
  onNavigate: (path, options) => navigate(path, { state: options?.state }),
  onAfterApply: async () => {
    await apolloClient.resetStore(); // no TanStack Query in this app
  },
  // no onRefetch, so the panel's "Refetch" button never renders
});
```

Application B omits `onRefetch` entirely. It has no second cache to refetch, so it doesn't wire the callback, and the button that would call it disappears. Same package, different capabilities, zero forks.

## Three decisions that held it up

The config object is the easy part to describe. Three decisions underneath it are what made it actually work.

**Callbacks, not hooks.** I could have shipped a hook-based adapter, something like `useDevToolsRouter()`. I didn't, for a reason that only became obvious later: the panel isn't the only consumer. There's an automation bridge that drives the same navigation logic from outside React entirely, from a Playwright script. A hook can't run there. A plain function runs everywhere. So the adapters are functions, and both the human panel and the machine bridge call the identical code path.

**Optional, with meaningful degradation.** Every adapter is optional, and each one degrades in a way that's still useful. Omit `onNavigate` and the panel falls back to a full document load: slower, loses client state, but it navigates. Omit `onRefetch` and the "Refetch" button simply isn't rendered. That second one is the pattern I care about most. The panel doesn't show a button that silently does nothing. It shows the button only when the host provided the thing the button needs. **Capability, not configuration.** The UI reflects what the app can actually do, not a checklist of features the app was supposed to fill in.

**Not everything becomes an adapter.** The panel highlights the route you're currently on. That could have been a fourth callback: `getCurrentRoute()`. It isn't. Both apps use real browser routing, so the panel just reads `window.location` and listens for `popstate`. The platform already answers the question correctly for both apps. Adding an adapter there would have been one more thing every consumer has to wire, for zero benefit. Invert what actually differs between the apps. Leave what doesn't.

That last decision is easy to get wrong in the other direction. Once you've discovered the adapter pattern, every internal detail starts looking like a config knob. Resist it. A config object nobody can fill in is worse than a hardcoded value.

## Two lessons I'd take to the next tool

**Abstract on the second consumer, not the first.** When I built the panel for one app, wiring it directly to that app's router and cache was correct. If I had tried to guess the adapter boundary up front, before a second app existed, I would have guessed wrong. I didn't know the real axis of variation was "different router package" and "cache client that may not be installed" until a second app showed me. The first consumer teaches you what the tool does. The second consumer teaches you where the seam goes. You can't see the seam with one.

**Draw the boundary as a directory before a package.** The portability wasn't won by publishing to npm. It was won earlier, and more cheaply, by moving the portable half of the code into a `core/` folder inside one repository. The rule became "nothing in `core/` may import the router or the cache client," and that rule is enforceable by a code review looking at a folder. The npm package, the peer dependencies, the version ranges: all of that came later, and it was mechanical. The hard conceptual work was already done the moment the boundary existed as a directory a reviewer could point at.

If you have a tool you want to make reusable, don't start by extracting a package. Start by drawing a line inside your existing repo and refusing to let imports cross it. If that line holds for a few weeks under real changes, the package is a formality. If it doesn't hold, you just learned that cheaply, without publishing anything.

The panel started as one app's internals. It's now a package running unchanged across two apps that agree on almost nothing. The distance between those two states was one rule: stop importing the things that differ, and let the app hand them in.
