---
title: "Encode Your Invariants as Checks, Not Prose"
published: 2026-08-15
description: "An architectural rule that lives only in a design doc is already decaying. Here's why I turn load-bearing constraints into commands that fail, and the one place I didn't."
image: ""
tags: [Developer Experience, AI, Architecture]
category: Development
draft: true
---

Every design doc I've written has a section that describes a rule the whole thing depends on. "The package must never import the router." "Descriptions stay short so the agent triggers correctly." Load-bearing sentences.

And every one of those sentences starts decaying the moment I hit save.

Not because anyone disagrees with it. Because prose doesn't run. A README can say "never import X" in bold, and nothing stops the next person, or the next me, from importing X. The rule is real, but it lives in a place that can't enforce it.

I built two very different tools over the last year: an AI workflow that owns the ticket-to-merge-request cycle, and a frontend DevTools package meant to run inside two separate apps. They taught me the same lesson from opposite ends. If a design has a constraint you actually care about, encode it as a command that fails when the rule is broken.

## The frontend package: one import away from breaking a stranger

The DevTools package I wrote had a strange shape. It shipped into two host applications, and I've written about [why those two apps were incompatible](/posts/one-package-two-incompatible-apps/). One used one router and data layer, the other used a different stack entirely. The package couldn't depend on either.

So the whole architecture rested on a single invariant: the package's `src/` must never import the router or the cache clients. Not React Router, not Apollo Client, not TanStack Query. If it did, one app would work fine and the other would break on install, weeks later, with the cause buried under everything that changed since.

That's the part that makes this dangerous. The failure mode is mundane. Someone needs the current URL, imports `useLocation` from `react-router-dom`, ships it. Nothing breaks in the app they're testing. The rule was violated and every local signal said everything was fine.

A sentence in a README does nothing against that. So the rule became a script, about 87 lines, no dependencies, run in CI:

```js
const FORBIDDEN = [
  "@apollo/client",
  "@tanstack/react-query",
  "react-router",
  "react-router-dom",
];
```

The script scans the package source and fails the build if any of those appear. The reason it's 87 lines and not 5 is that a naive grep misses cases: it has to catch static imports, `require()`, and dynamic `import()`, including subpaths like `react-router-dom/server`, and it has to report the file, line, and offending source so the failure is actionable instead of cryptic.

The architecture stopped being a paragraph I hoped people would read. It became a build failure. That's the whole trick: 87 lines converted an architectural principle from a social agreement into a mechanical one.

## The AI workflow: acceptance criteria you can run in five seconds

The other tool was `workon`, my Claude Code plugin for the ticket-to-merge-request loop. I've written about [how it's built out of markdown skills and small scripts](/posts/ticket-to-mr-under-one-roof/). It has no compiler and no imports to police. The invariants are softer and, it turns out, easier to let rot.

The one I cared about most: skill descriptions have to stay short. A description over budget makes the agent trigger at the wrong times, and the whole system gets worse in ways that are hard to trace back. So I wrote the constraint as commands a reviewer could run without ever executing the plugin:

```sh
grep -rE "USE THIS SKILL EAGERLY|EVEN MID-CONVERSATION"   # must return nothing
grep -r "\.workon/\.profile\.md" plugins/workon/          # deleted tier stays deleted
```

The first line bans a specific over-eager emphasis phrase I'd decided the descriptions should never contain. The second is the one I want you to notice: it asserts that a feature tier I deleted **stays** deleted, by checking that a path returns zero matches.

That's a class of rule I'd never have thought to write as a test. "Make sure this thing I removed doesn't quietly come back" isn't a behavior you assert with a unit test. It's an invariant, and a one-line grep expresses it perfectly. A rule written as a command that returns zero lines can be checked in five seconds by someone who never read the design doc.

## The part where I didn't take my own advice

Here's the uncomfortable half.

The `workon` checks I just showed you were real. I ran them during refactors and they held. The character-budget checks held. The banned-phrase check held. The deleted-tier check held.

But they were never wired into CI. There was no job that ran them on every change. There was also a set of bash tests, 42 assertions across eight files, that spun up temporary git repositories and checked the scripts. Those passed too. Also not in CI.

So what happened is exactly what you'd predict. The checks I encoded as commands and actually ran during a change caught violations and kept the design intact. The checks that only ran when I remembered to run them slowly stopped running, because nothing forced them to. They didn't fail loudly. They rotted quietly, which is worse, because a check nobody runs looks identical to a check that's passing.

I'm not telling you I did this perfectly. I'm telling you the pattern was clear even from my own inconsistency: the invariants I turned into running checks held, and the ones I left in prose or in scripts-nobody-runs drifted. The forbidden-imports script for the frontend package held because it ran in CI on every commit. The `workon` greps were just as good as commands and just as useless as guardrails, because the last mile was missing.

## The rule I'd actually give you

There are two steps, and skipping the second is the mistake I made.

**One: for every invariant you care about, write the command that fails when it's broken.** Not a sentence in a doc. A command with an exit code. "The package must not import the router" becomes a script that greps the source and exits non-zero. "This tier is gone" becomes `grep` returning zero lines. If you can't write the command, you probably don't understand the invariant precisely enough yet, and that's useful to learn early.

**Two: actually run it in CI.** A check that only runs when you remember is a check that eventually doesn't run. The whole value is that it fires without anyone deciding to fire it. This is the step I treated as "a separate concern, later," and later is where good intentions go to decay.

A prose rule protects you exactly as much as everyone's memory and goodwill on a bad day. A checked rule protects you on the day someone imports `useLocation` at 6pm to fix one thing, tests it in the one app where it works, and ships.

If you go looking at your own design docs, you'll find these sentences. The bolded "never," the "always," the "must." Each one is an invariant wearing prose. Pick the one that would hurt most if it broke silently, and this week, turn it into a command that fails. Then put it somewhere that runs it for you.

This is one thread in a [series about treating friction as a real engineering problem](/posts/ai-writes-code-you-do-everything-else/). Turns out "the rule that decayed" is just friction you haven't noticed yet.
