---
title: "The Details That Make a Dev Tool Pleasant"
published: 2026-08-15
description: "A tool you reach for twenty times a day is judged on friction, not features. Here are the small, unglamorous details that decide whether anyone keeps using it."
image: ""
tags: [Developer Experience, Web Development, UX]
category: Development
draft: true
---

I built [an in-app DevTools panel](/posts/in-app-devtools-panel/) to control the network layer of a frontend while I develop it: pick a screen, pick which response each endpoint returns, flip a feature flag, land there instantly. That post was about what it controls. This one is about everything that never shows up on a feature list and still decides whether anyone keeps using it.

Some tools I open once a week. This one I open twenty times a day. At that frequency it stops being judged on features and starts being judged on friction. Nobody writes "remembers my last tab" on a comparison chart. But get a dozen of those small things wrong and the tool earns a polite "we tried that once." Get them right and people reach for it by reflex. Same code underneath, completely different fate.

Here are the details I spent real time on, and why each one mattered more than it looks.

## It remembers where you were

Three pieces of state survive a reload, all in localStorage: which fixtures you selected, which flags you overrode, and the last tab you had open.

The first two are obvious. You configured six endpoints to reproduce a bug, so a reload cannot throw that away. Flags often get set once and left alone for a whole afternoon.

The third is the one people actually notice. You were working in the Flags tab, you reload, and the panel opens on Flags. Reopening on a default tab is a tiny insult repeated fifty times a day: you have to re-orient, find the tab, click it, and only then resume. It costs eleven lines to fix.

```ts
const readStoredTab = (): TabType | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ACTIVE_TAB_STORAGE_KEY);
    return stored && (ALL_TABS as string[]).includes(stored)
      ? (stored as TabType)
      : null;
  } catch {
    return null;
  }
};
```

Two defensive touches earn their keep. The stored value gets validated against the known tab list, so a stale key from an older version cannot drop the panel into a tab that no longer exists. And the whole thing is wrapped in try/catch, because localStorage throws in private browsing, and a preference read crashing the host app would be an absurd way to lose a user.

## What you're touching floats to the top

Every tab uses the same layout: a pinned section above a scrollable list. Fixtures pins the operations you have actively overridden. Flags pins the flags you have changed. Routes pins the screen you are currently on.

The reasoning is identical in each case. After a few minutes of work, the three things you are manipulating are buried among forty you are not. Scrolling to find them is the real cost of using the tool. Pinning turns "where did I put that" into a glance.

Routes is the one you feel most. Landing on a screen and wanting a different scenario for that same screen is the single most common thing I do, so the current route sits at the top with its badges and its declared fixtures visible, and the alternatives are right there.

## The cursor starts where you already are

This is my favorite detail in the whole thing, because it is invisible when it is right and maddening when it is wrong.

Open the Routes tab and press the down arrow. The naive version starts the cursor at the first item in the list, so your first keypress jumps to some route you were not thinking about. But you are already on a route, it is already highlighted, and your mental model is "move to the next one from here." So the cursor is anchored to the current route, about twelve lines of code to find it in the list and start there instead of at item one.

It gets one more touch. While you are typing a search, the cursor jumps to the first match, because that is what Enter should fire on. Two correct behaviors for two different intents.

## Fuzzy search I wrote by hand

Route lists reach dozens of entries. Exact substring matching means remembering how a route was labeled. Fuzzy matching means typing what you remember, so `revrej` finds "Application Review, Rejected."

I wrote the scorer by hand, about 62 lines, no dependency. It is deliberately opinionated: consecutive characters score higher than scattered ones, and matches near the start of the label score higher than matches buried deep inside it. The effect is that the thing you meant is usually first, which is the only ranking property that matters when Enter fires on the top result.

A library would have done this too. For something this central to how the tool feels, 62 lines I fully understand beat a transitive package I would have to audit.

## There, but never in the way

The floating button that opens the panel sits at 30% opacity and animates to full on hover. It lives in the bottom-right corner, where toasts, chat widgets, and floating CTAs all fight for space. At 30% it is legible enough to find and faint enough to ignore.

A handful of other restraint choices, each one small:

- The keyboard shortcut works even while you are typing in one of the app's own inputs, because the handler checks modifiers before anything else. You never have to click out of a form to summon the panel.
- Escape closes it. Every overlay in every app does this, and breaking it is a small betrayal.
- The panel closes itself after you navigate. You opened it to pick a screen, so keeping a 360px panel parked over that screen would be actively unhelpful.
- A tab with nothing to show does not exist. No flags configured, no Flags tab, rather than a dead control sitting there doing nothing.

## Accessible by default, which made it more usable

I did not treat accessibility as a separate pass, and the payoff was not only for screen readers. The tab bar uses real tablist roles. Flag toggles are `role="switch"`, not styled checkboxes. Every icon-only control has an aria-label. Every interactive element is a real `<button>` or `<select>`.

That last one is why the keyboard story works at all. Focus order, Enter and Space activation, all of it comes free from the platform because I never reimplemented a control the browser already ships. Doing the accessible thing was also the path of least code.

## And adding to it is cheap

The authoring side counts too, because a tool nobody can extend calcifies. Adding a new scenario to an endpoint is adding a key to a plain object. Exposure is opt-in, so the panel does not fill up with internal endpoints nobody switches by hand. And the two most valuable states, a generic error and an infinite loading state, get injected into every operation for free, with no per-endpoint work.

## The pattern underneath

Read together, every one of these is one of three moves:

1. **Remember the context.** Fixtures, flags, the active tab, each tab's search.
2. **Surface what's active.** Pinned sections, the current-route anchor, inline badges.
3. **Never contradict a platform convention.** Escape closes, arrows move the caret inside a text field, real buttons behave like buttons.

None of it is clever. All of it is cheap: the tab restore is eleven lines, the cursor anchor is twelve, the typing guard is five. That ratio is the entire argument. A few dozen lines of care are what separate a tool people reach for from one they work around.

Here is the part worth planning for. Nobody will ever file a ticket asking for any of this. No one requests "anchor the keyboard cursor to my current route." They just quietly stop opening the tool that gets it wrong. The [AI workflow plugin I built for a completely different job](/posts/ai-writes-code-you-do-everything-else/) had the same concern in a different shape, and this whole series started from that idea: friction is a real engineering problem even when each instance is small. So budget for these details explicitly, up front, because the feedback that would tell you to build them never arrives.
