---
title: "Building an In-App DevTools Panel"
published: 2026-08-15
description: "The frontend UI is local, but the state that drives it is remote. Here's the friction that creates, and the panel I built to get cheap, repeatable control over it."
image: ""
tags: [Developer Experience, Web Development, Testing]
category: Development
draft: true
---

There was no tool. That's where this starts.

The [first post in this series](/posts/ai-writes-code-you-do-everything-else/) was about my AI writing the code and leaving me the whole ticket-to-merge cycle by hand. This is the same idea in a different domain: the frontend.

Frontend has a structural asymmetry that makes it worse. **The UI is local, but the state that drives it is remote.** Every interesting screen is a function of data I don't control: what the API returns, which flag is on, whether a request is loading or failed. I own the pixels. I don't own the thing that decides which pixels to draw.

Without a tool, I pay a tax on that asymmetry dozens of times a day. Here's what the tax actually looked like.

## To see step 7, I had to complete steps 1 through 6

Onboarding flows, checkout flows, anything multi-step. To review a CSS change on the last screen, I completed every screen before it, each one a real form submission against real backend state.

Change one line on step 7, click through six steps to see it, change it again. Do that twenty times in an afternoon and you understand why nobody wants to touch the last screen of a flow.

Worse were the screens I couldn't reach at all. A view that only renders for a rejected application needs an account in exactly that state. Getting one means asking another team or hand-crafting data, and either way the account rots when someone's cleanup job wipes it.

## Finding which route renders a view is archaeology

"Where does this component actually render?" has no cheap answer in a large app.

I grep for the component name, find the route definition, trace the path through nested layouts and a router basename, and assemble a URL by hand. Then I discover the route needs `location.state` to render, which a hand-typed URL cannot carry. Dead end.

Routes found this way live in one person's head or their personal notes file. New teammates don't get that file.

## Simulating a feature flag meant editing code

This is the friction that did the most quiet damage. To see the UI behind a flag, I'd write the line everyone has written and nobody admits to:

```ts
const isEnabled = useFeatureFlag("new-checkout-flow");
// const isEnabled = true; // TODO: remove before commit
```

Three things go wrong, all of them real. It gets committed by accident. It gets reverted and re-added tomorrow by the same person. And it tests a lie: a hardcoded `true` bypasses the actual flag-evaluation path, so the code that reads the flag in production is never the code I exercised.

Multi-variant experiments multiply it. A flag with three variants needs three separate edits to review, with no way to compare them side by side.

## Error and loading states were effectively untestable

"What does this look like if the API returns a 502?" To answer it, I broke something on purpose: stopped a local service, or edited a mock to throw, then remembered to undo it.

Loading states were worse. A local API responds in 200ms, so the skeleton I carefully built flashes past faster than I can see it. Screenshot it? The state is gone before the inspector opens.

The result is the same in almost every frontend I've worked on: **error and loading paths are the least-reviewed UI in the app.** Not because anyone decided they didn't matter, but because looking at them was disproportionately expensive.

## Every mock change cost a dev-server restart

Fixtures lived in files. Changing which response an endpoint returned meant editing a file, waiting for the bundler to rebuild, and waiting for the page to reload.

Comparing four variants of a screen was four rebuild cycles. Each one destroyed whatever client-side state I'd built up getting there: my scroll position, my form input, my open modal.

## Visual review doesn't scale, so it silently stops

Reviewing every screen after a design-system bump is linear in screen count. Under a deadline, linear work gets sampled, and regressions live in the part I didn't sample. Newly added routes never make it onto anyone's mental checklist, so coverage decays as the app grows.

Nobody decides to stop reviewing. It just quietly stops happening.

## The pattern underneath all of it

Every item above is the same problem wearing a different hat: **I needed cheap, repeatable control over the state the UI renders.**

Not a debugger. Not a test framework. A switchboard at the network edge. The UI is local and correct; the state is remote and out of reach, so the fix is to sit at the boundary between them and control what crosses it. That framing is the whole design, and it's what kept the scope narrow.

## So I built a panel

The result is a floating panel inside the app, built on [MSW](https://mswjs.io/) (Mock Service Worker). MSW already intercepts network requests in the browser, so the panel became a UI for deciding what those intercepted requests return.

Three ideas do most of the work.

**Runtime handler rewriting.** MSW's `worker.use()` re-registers a request handler on the fly. When I pick a different response for an endpoint, the panel rewrites that handler in place:

```ts
worker.use(http.get(endpoint, resolver));
```

No rebuild, no reload, and the page keeps its state. Comparing four variants of a screen is four dropdown selections instead of four rebuild cycles, and my open modal survives all four.

**Flags overridden at the network layer.** The Flags tab doesn't touch component code. It intercepts the flag-evaluation endpoint and returns my chosen value, so the app's real flag hook, real client, and real caching all run unmodified. I change the answer the flag service gives, not the question the code asks. That's the difference between this and `// const isEnabled = true`: I'm testing the path that ships.

**Two states that come free on every operation.** The panel injects two virtual keys into every endpoint's dropdown, with no per-endpoint authoring:

- `GENERIC_ERROR` returns a 502 (or a GraphQL `errors` envelope), so any error path is one selection away.
- `LOADING` responds with MSW's `delay("infinite")`, which holds the loading state open indefinitely. The 200ms skeleton flash becomes a state I can hold still, measure, and screenshot.

The hardest-to-reach states in the app (a rejected application, a 502, an infinite spinner) collapse into a dropdown entry. Reaching a screen deep in a flow becomes typing three characters in a route list and pressing Enter.

## What I'm optimizing

Same as the first post: not seconds saved, attention reclaimed. At three seconds, I check the error state because I'm curious. At ninety seconds and a code edit, I assume it's fine and move on. The panel's real output isn't saved minutes, it's checks that now happen at all.

And some of these aren't faster versions of something I did before. An indefinitely-held loading state, a guarded route, a route needing `location.state`: the "before" column for those isn't a duration. It's just *no*.

## What's next

Two threads run out of this one.

The first is portability. I built the panel against one app's router and one app's cache, which was correct until a second app wanted it, with a different router and a different cache stack. [One package, two incompatible apps](/posts/one-package-two-incompatible-apps/) is about the abstraction that made it install unchanged in both.

The second is why the scenario vocabulary got so broad without the panel growing. Errors, delays, polling sequences, responses computed from the request: none of them needed special support. [Expose the primitive, don't enumerate the cases](/posts/expose-the-primitive-dont-enumerate-cases/) is about the one design decision that made that true.

If your UI is local and its state is remote, which state is the one you can never quite reach? That's the one worth wiring a switch to first.
