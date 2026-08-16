---
title: "Expose the Primitive, Don't Enumerate the Cases"
published: 2026-08-15
description: "My DevTools panel has no 'simulate error' checkbox and no latency slider. It renders the keys of a plain object and awaits whatever it finds. That one decision is why its scenario vocabulary kept growing while the panel never changed."
image: ""
tags: [Developer Experience, Web Development, Architecture]
category: Development
draft: true
---

Early on, while building the [in-app DevTools panel](/posts/in-app-devtools-panel/) for a frontend app, I hit a fork in the road.

I could give the panel the obvious controls a developer asks for: a "simulate error" checkbox, a latency slider, maybe a dropdown of error codes. Or I could expose the one thing sitting underneath all of those controls and let it produce every one of them.

I picked the second, and it turned out to be the single decision that gave the panel its range.

## The panel doesn't know what a scenario is

The Fixtures tab renders a dropdown for each API operation. The options in that dropdown are just `Object.keys(responses)`. That is the entire mechanism.

Here is what one operation's responses look like:

```ts
const responses = {
  default: { status: "PENDING" },
  slow: async () => {
    await delay(2000);
    return completeResponse;
  },
  polling: createSequenceResolver([pending, processing, complete]),
  search: async (variables) => filterFixtures(variables.query),
};
```

The panel renders those four keys as four dropdown entries, and it has no idea that `default` is a plain object, `slow` waits two seconds, `polling` is a three-step state machine, and `search` reads the request variables: it renders the keys and awaits whatever it finds behind the one you pick.

Adding a new scenario to an endpoint is adding a key to that object. No registration step, no panel code to touch, no new type to declare. The panel never learns about the scenario because it never needed to.

## One dropdown, almost any network condition

A fixture value can be a static object or an async function, and MSW gives you full control over the response. So a single dropdown entry can encode conditions I would never have built a dedicated control for:

- **Happy-path variants**: empty list, one item, many items, missing optional fields.
- **HTTP error status**: a 502, so I can look at the error boundary and the retry copy.
- **GraphQL errors**: a 200 with an `errors` envelope. GraphQL fails with a 200 and an errors array, often alongside partial data, and code that only checks the status code silently mishandles it. One dropdown entry produces the correct failure shape.
- **Infinite loading**: MSW's `delay('infinite')` freezes the skeleton open so I can actually inspect it, instead of watching it flash past in 200ms.
- **Realistic latency**: `await delay(2000)` surfaces race conditions, double-submit, and optimistic-UI timing.
- **Responses that change after N calls**, for polling flows.
- **Variable-dependent responses**, for search and pagination.
- **Empty bodies**, for the endpoints that legitimately return a 204.
- **Conditional interception**: mock some requests, let the rest hit the real backend.

None of these needed panel support. They are all just what you can put behind a key.

The one I keep pointing people to is that `polling` entry. A resolver runs before the response, so a counter can advance a state machine on each call. `createSequenceResolver` hands back the next item per call and clamps to the last, which means a real polling component, with its real interval and its real cancellation, walks `PENDING` to `PROCESSING` to `COMPLETE` against a static fixture file. You are testing your polling logic, not a mock of it.

And here is the part I want to underline: none of that timing behavior is a feature I wrote. The runtime awaits the resolver before responding, and everything else is a consequence of that one `await`. A resolver can sleep, count, or branch on the request, and the panel is none the wiser. Latency, sequencing, and search backends aren't three capabilities I added. They are three things you can already do inside a function that returns a response, which is all a fixture value ever has to be.

## The primitive versus the enumeration

Here is the line I care about: a tool that enumerated its own scenario types would have capped what I could reach.

A "simulate error" checkbox handles one kind of error. Then someone needs a 429 instead of a 502, so you add a field. Then a GraphQL errors envelope, so you add another. Then a slow error, and now the checkbox has a companion latency slider, and the two don't compose. Every new scenario becomes a panel change and a small negotiation about whether it's worth adding.

Exposing the resolver skips all of that. The ceiling isn't what I thought to build. The ceiling is MSW's, and MSW's ceiling is "any function of the request." I didn't have to anticipate the scenarios. I had to expose the thing that produces them, and get out of the way.

## The bridge fell out of the same instinct

The panel also publishes its capabilities as a plain object on `window`:

```ts
window.__DEVTOOLS_BRIDGE__ = {
  navigateToRoute: (label: string) => Promise<void>,
  applyFixture: (operation: string, fixtureKey: string) => Promise<void>,
  setFeatureFlag: (flagKey: string, value: boolean) => void,
};
```

`navigateToRoute` runs the exact sequence a human click runs (apply fixtures, invalidate caches, navigate), so there is no separate "test mode" that can drift out of sync with the real panel.

I built this for one small reason. I had Playwright specs that needed to put the app on a specific screen, and I did not want to duplicate the panel's navigation logic inside test code. So I exposed it.

What I got back was larger than what I asked for. The panel became a programmatic API for the entire application's state. Any script can drop the app on any screen, with any API response, with any flag, in one call, without importing a line of app code. The screenshot tool was the first consumer. It was not the last.

Interfaces built for one honest reason tend to pay twice. I never set out to build an automation API. I set out to avoid copy-pasting a navigation function, and I exposed a real interface instead of test glue. The interface did the rest.

## Same principle, a completely different tool

This is the same move I made in `workon`, my Claude Code plugin for the [ticket-to-merge-request loop](/posts/ticket-to-mr-under-one-roof/).

There, the orchestrator doesn't reimplement the Git host or the CI system. It calls small bash scripts that each do one API job and print JSON, then it builds on that contract. The contract is small, and the capability underneath is whatever the API can already do. Same shape here: the panel builds on a tiny contract (a key maps to a resolver) and the capability underneath is whatever MSW can already do.

Both tools resist the same temptation, which is to climb up one level and enumerate the cases. A "simulate error" checkbox is the frontend version of reimplementing the API client inside your tool. Both feel like features when you add them. Both are actually ceilings you're bolting onto something that didn't have one.

So the rule I keep coming back to: expose a small contract, and don't reimplement the world above it. Let the primitive's ceiling be your ceiling. Then spend the time you saved on the things a primitive can't hand you for free, which for the panel was all the ergonomic care I wrote about in the [panel post](/posts/in-app-devtools-panel/).

What's the control you're tempted to add next? Check whether you're exposing a primitive or quietly capping one.
