---
title: "Building an In-App DevTools Panel"
published: 2026-08-16
description: "The frontend is local, but the state that drives it is remote. Here's the friction that creates, and the panel I built to get cheap control over it."
image: ""
tags: [Developer Experience, Web Development, Testing]
category: Development
draft: true
---

There was no tool. That's where this starts.

Frontend has a structural asymmetry that quietly makes it harder than it looks. **The UI is local, but the state that drives it is remote.** Every interesting screen is a function of data I don't control: what the API returns, which flag is on, whether a request is loading or failed. I own the pixels. I don't own the thing that decides which pixels to draw.

Without a tool, I pay a tax on that asymmetry dozens of times a day. Here's what the tax actually looked like.

## To see step 7, I had to complete steps 1 through 6

Onboarding flows, checkout flows, anything multi-step. To review a CSS change on the last screen, I completed every screen before it, each one a real form submission against real backend state.

Change one line on step 7, click through six steps to see it, change it again. Do that twenty times in an afternoon and you understand why nobody wants to touch the last screen of a flow.

Worse were the screens I couldn't reach at all. A view that only renders for a rejected application needs an account in exactly that state. Getting one means asking another team or hand-crafting data, and either way the account rots when a cleanup job wipes it a week later.

## Simulating a feature flag meant editing code

This is the friction that did the most quiet damage. To see the UI behind a flag, I'd write the line everyone has written and nobody admits to:

```ts
const isEnabled = useFeatureFlag("new-checkout-flow");
// const isEnabled = true; // TODO: remove before commit
```

Three things go wrong, all of them real. It gets committed by accident. It gets reverted and re-added tomorrow by the same person. And it tests a lie: a hardcoded `true` bypasses the actual flag-evaluation path, so the code that reads the flag in production is never the code I exercised.

An experiment with three variants makes it worse. Reviewing all three means three separate edits, with no way to compare them side by side.

## Error and loading states were effectively untestable

"What does this look like if the API returns a 502?" To answer it, I broke something on purpose: stopped a local service, or edited a mock to throw, then had to remember to undo it.

Loading states were worse. A local API responds in about 200ms, so the skeleton I carefully built flashes past faster than I can see it. Try to screenshot it and the state is gone before the inspector opens.

The result is the same in almost every frontend I've worked on: error and loading paths are the least-reviewed UI in the app. Not because anyone decided they didn't matter, but because looking at them was disproportionately expensive.

## The pattern underneath all of it

Every item above is the same problem wearing a different hat: **I needed cheap, repeatable control over the state the UI renders.**

Not a debugger. Not a test framework. A switchboard at the network edge. The UI is local and correct; the state is remote and out of reach, so the fix is to sit at the boundary between them and control what crosses it. That framing is the whole design, and it's what kept the scope narrow.

## So I built a panel

The result is a floating panel inside the app, built on [MSW](https://mswjs.io/) (Mock Service Worker). MSW already intercepts network requests in the browser, so the panel became a UI for deciding what those intercepted requests return.

The mechanism behind "no rebuild" is one MSW call. `worker.use()` re-registers a request handler on the fly, so when I pick a different response for an endpoint, the panel rewrites that handler in place:

```ts
worker.use(http.get(endpoint, resolver));
```

No rebuild, no reload, and the page keeps its state. Comparing four variants of a screen is four dropdown selections instead of four rebuild cycles, and my open modal survives all four.

The Flags tab uses the same trick, but the payoff is different. It intercepts the flag-evaluation endpoint and returns my chosen value, so the app's real flag hook, real client, and real caching all run unmodified. I change the answer the flag service gives, not the question the code asks. That's the difference between this and `// const isEnabled = true`: I'm testing the path that ships.

## Two states that come free on every operation

The panel injects two virtual keys into every endpoint's dropdown, with no per-endpoint authoring:

- `GENERIC_ERROR` returns a 502 (or a GraphQL `errors` envelope), so any error path is one selection away.
- `LOADING` responds with MSW's `delay("infinite")`, which holds the loading state open indefinitely. The 200ms skeleton flash becomes a state I can hold still, measure, and screenshot.

The hardest-to-reach states in the app, a rejected application, a 502, an infinite spinner, collapse into a dropdown entry.

## Expose the primitive, don't enumerate the cases

Here's the design decision I'm most happy with, because it's the reason the panel stayed small while what it could do kept growing.

The panel doesn't have a "simulate error" checkbox or a latency slider. It renders the keys of a plain object as a dropdown and awaits whatever it finds behind the selected key. A value can be static data or an async function, and MSW gives full control over the response, so one dropdown entry can be a delay, a polling sequence, or a response computed from the request:

```ts
export const responses = {
  default: { status: "PENDING" },
  slow: async () => { await delay(2000); return complete; },
  polling: createSequenceResolver([pending, processing, complete]),
  search: async (variables) => filterFixtures(variables.query),
};
```

The panel neither knows nor cares whether a key holds a plain object, a two-second delay, or a three-step state machine. It renders `Object.keys(responses)` and awaits the result.

That's why the vocabulary of scenarios kept expanding without the panel changing. Realistic latency, a `PENDING → PROCESSING → COMPLETE` sequence that a real polling component walks through with its real interval, a fake search backend that filters on the query variable: none of them needed special support. Adding a scenario is adding a key to an object. The ceiling isn't whatever I anticipated when I built the panel; it's whatever MSW can express, which is any function of the request.

Had I enumerated the cases instead, every new kind of scenario would have meant a new control, a new type, a new place to change. Exposing the resolver meant I stopped having to predict what people would need.

## From one app to a package

I built the panel inside one microfrontend, against that app's router and its cache. It worked well enough that a second app wanted it, so it became its own installable, updatable package: the two apps wire in their own router and cache through a small config, and the panel installs unchanged in both.

The portability is worth its own post someday. It isn't this one. The point here is that the switchboard-at-the-edge framing is what made the extraction possible at all, because the panel never knew anything about either app past the request/response boundary.

## What I'm actually optimizing

Not seconds saved. Attention reclaimed.

At three seconds, I check the error state because I'm curious. At ninety seconds and a code edit, I assume it's fine and move on. The panel's real output isn't saved minutes, it's checks that now happen at all. That's the whole reason I keep [investing in developer experience](/posts/why-developer-experience-matters/): the cost of doing the right thing is what decides whether anyone does it.

And some of these aren't faster versions of something I did before. An indefinitely-held loading state, a guarded route, a screen that only renders for a rejected application: the "before" column for those isn't a duration. It's just *no*.

If your UI is local and its state is remote, which state is the one you can never quite reach? That's the one worth wiring a switch to first.
