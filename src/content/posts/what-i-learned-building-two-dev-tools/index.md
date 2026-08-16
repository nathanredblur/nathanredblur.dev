---
title: "What I Learned Building Two Dev Tools in a Year"
published: 2026-08-15
description: "One tool takes a ticket to a merge request. The other is a DevTools panel that became a package. Different domains, same lessons. Here's what stuck."
image: ""
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

Over the past year I built two tools that, on paper, have nothing to do with each other.

One is [`workon`](/posts/ticket-to-mr-under-one-roof/), a Claude Code plugin that takes a ticket all the way to a merge request: reads the issue, plans, writes tests, opens the MR, reads the review, watches the pipeline. The other is [an in-app DevTools panel](/posts/in-app-devtools-panel/) for the frontend, a keyboard-driven overlay that switches mock responses, jumps to any screen, and flips feature flags, which later became [an installable package](/posts/one-package-two-incompatible-apps/).

Different stacks. Different users. One lives in a terminal, the other in a browser. And yet, when I look at the decisions that turned out to matter in each, they're the same decisions. So this is the reflective one. Not how either tool works, but what building both taught me about building tools at all.

## Friction is a real engineering problem, even when each instance is small

Neither tool solved anything hard. [`workon`](/posts/ai-writes-code-you-do-everything-else/) removed the tax of re-explaining my team's conventions to a fresh context window on every ticket. The panel removed the tax of editing a mock file and reloading the page every time I wanted to see an error state.

No single instance of either was worth a ticket. But you pay them dozens of times a day, and the total is enormous. The value of both tools was never cleverness. It was the removal of a cost nobody was writing down, because each individual payment felt too small to mention.

## Keep the scope narrow, and say out loud what it does not do

Both tools have a hard line around what they refuse to touch.

`workon` never writes code without a plan I approved. That's the one gate I won't remove, because the assistant is fast, confident, and occasionally confidently wrong. The panel deliberately does no styling of your app, no state management, no production behavior. It reads what's already there and gives you a keyboard to drive it.

Writing down what a tool does *not* do is not a disclaimer. It's the load-bearing part of the design. That narrowness is why the panel survived being pulled out into a shared package without dragging half an app with it, and why `workon` stayed something I trust with my branches instead of something I have to babysit.

## Expose the primitive, don't enumerate the cases

The panel has no "simulate error" checkbox and no latency slider. It renders the keys of a plain object and awaits whatever it finds behind them. That single decision is why its vocabulary of scenarios (errors, delays, sequences, responses that depend on a variable) kept growing while the panel itself stopped changing. I go deeper into that in [expose the primitive, don't enumerate the cases](/posts/expose-the-primitive-dont-enumerate-cases/).

`workon` did the same thing in a completely different shape. Its scripts speak [a JSON contract over stdout, not a fixed menu of commands](/posts/ticket-to-mr-under-one-roof/). Every script prints JSON, reports progress on stderr, and exits with a code that means success, error, or decision-required. The orchestrator reads that contract. It doesn't need to know what any particular script does.

In both, the ceiling ended up being the underlying system's ceiling, not whatever I happened to anticipate the day I wrote it. That's the whole payoff. If I had enumerated the cases, I would have capped both tools at my imagination on a Tuesday.

## Encode load-bearing constraints as checks, not prose

Here's a pattern I now believe in completely: a rule that lives only in a document is already decaying, and I explored why in [encode your invariants as checks, not prose](/posts/encode-invariants-as-checks/).

For the panel, an 87-line script turned "the portable core must not import the app's router" from a polite agreement into a build failure. For `workon`, an invariant like "this skill must never trigger on an ordinary git command" became a `grep` I can run in five seconds against the skill files.

The contrast held up over the year: the rules I turned into commands stayed true, and the rules I left in prose drifted. Every constraint I actually cared about eventually earned a check, because the ones without a check quietly stopped being real.

## In an interactive agent, count human round-trips, not tool calls

This is the lesson from `workon` that surprised me most, and it has a full post of its own: [count human round-trips, not tool calls](/posts/count-human-round-trips-not-tool-calls/).

I spent an afternoon parallelizing three scripts to shave latency. Then I noticed the tool was asking me a question before it had the information to answer it, which meant I sat there blocked while it waited on me, and I answered, and it went and fetched the thing that would have made the question unnecessary.

Deleting that one badly-timed prompt saved more real time than parallelizing anything. In an interactive agent, the most expensive operation available is a question to the human. Optimize that first.

## Abstract on the second consumer, not the first

The panel was built for one app, wired directly to its router and its cache client. That was correct. I did not try to guess the seam in advance.

Only when a second app showed up, with a *different* router, did the real boundary become visible: the router and the cache differed, so they became callbacks, while the things that matched across both apps stayed as shared peers. I wrote about that split in [one package, two incompatible apps](/posts/one-package-two-incompatible-apps/).

If I had guessed the adapter boundary on day one, I would have inverted everything and produced a config object nobody could fill in. The second consumer is the one that tells you where the seam actually goes. The first just tells you it works.

## The unglamorous details decide adoption

Nobody adopts a tool for its architecture, and nobody abandons one for its architecture either. They abandon it because of something small and stupid that broke their trust.

For `workon`, it was a branch prefix that silently produced a fictional ticket key on every commit, the kind of thing that quietly poisons your git history until you notice weeks later. On macOS, `mktemp -t` takes a prefix, not a template, and that one-character mental model difference was enough. I collected more of these in [the details that make a dev tool pleasant](/posts/details-that-make-a-devtool-pleasant/).

For the panel, it was a hydration mismatch that had to be gated, a text field that shouldn't lose its arrow keys to the panel's shortcuts, and a tab that reopens exactly where you left it. And the flip side of the same coin: a tool that [fires when it shouldn't](/posts/over-triggering-plugin-uninstalled/) feels like it's hijacking your terminal, and that erodes trust faster than any missing feature.

Nobody files a ticket asking for a tab to reopen where they left it. They just quietly stop using the tool that forgets. These details never survive a ruthless scope cut on their own merits, so I learned to budget for them on purpose.

## The through-line

Both tools started from the same instinct. The friction sitting between me and the work I actually care about is worth engineering away, even when each instance is too small to justify a ticket.

And both taught me the same thing about working with an AI assistant. The assistant is good at exactly one part of the job: writing the code in front of it, right now, with the context it currently holds. Everything durable, the conventions, the constraints, the knowledge that makes each step correct, has to live somewhere the assistant can reach on the next ticket and the one after that.

An AI-native workflow, it turns out, is mostly that: giving the assistant a durable home for the knowledge it would otherwise make me re-explain every single time. The automation is real, but it falls out of having somewhere to put the knowledge. That was the reframe at the start of [this series](/posts/ai-writes-code-you-do-everything-else/), and after a year and two very different tools, it's the one thing I'm most confident about.

If your assistant writes the code and leaves you holding the rest, the tool worth building isn't the one that does the most. It's the one that stops making you the memory.
