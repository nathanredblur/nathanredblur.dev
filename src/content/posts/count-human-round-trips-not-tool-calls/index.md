---
title: "Count Human Round-Trips, Not Tool Calls"
published: 2026-08-15
description: "I expected the hard part of building an AI workflow to be an API integration. It wasn't. The real cost was round-trips, and the most expensive one is the question you ask a human."
image: ""
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

I expected the hard part of building an AI development workflow to be an API integration. I was wrong, and the way I was wrong is the most useful thing I learned all year.

Every API turned out to be boring. Reading a ticket, opening a merge request, pulling a pipeline's status: each one is a script, a `jq` filter, and a test. Boring problems get solved and stay solved. I kept waiting for the integration that would fight back. It never showed up.

The thing that actually fought back was latency. Not network latency. Round-trips.

This is the third post in a series that started with the observation that [my AI writes the code and leaves me everything else](/posts/ai-writes-code-you-do-everything-else/). This is the lesson from that project that surprised me most.

## A tool call is cheap. A question is not.

In an interactive agent, the model's wall-clock time is dominated by round-trips, and the round-trips are not all equal.

A tool call costs inference time. The model decides to run a script, the script runs, the result comes back. Seconds, and none of them are yours.

A question costs something else entirely. When the agent asks you "will this task modify dependencies?", the clock starts on human time: however long you take to notice the prompt, read it, understand what it's actually asking, and decide. That might be ten seconds if you're staring at the terminal. It might be ten minutes if you stepped away to get coffee. Either way it dwarfs the tool call it was trying to save.

Once I saw that, I started counting the wrong thing on purpose. Not "how many API calls does this flow make," but "how many times does it stop and wait for me."

## "It felt slow" is the complaint you can't dismiss

The lesson landed when I shipped opt-in worktree mode, the feature that lets me run more than one ticket at a time in isolated checkouts using `git worktree`.

It worked. It also felt slow. And "feels slow" is the worst kind of bug report, because it's easy to wave away and expensive to ignore. So I stopped trusting the feeling and counted the turns before I saw any visible progress on screen.

The count was ugly.

## What the count actually found

Four separate things were happening between "I asked for a worktree" and "something happened":

- **The mode-detection script ran twice.** Once in the orchestrator, once again in the worktree flow. Each call was individually correct, which is exactly why nobody had noticed the duplication.
- **Three independent lookups ran in sequence.** Mode detection, then a check for an existing worktree, then a ticket-summary fetch. Written as three steps because that is how you write steps. None of them depended on the others.
- **Detection ran even when worktree mode was off.** The common path called the script to *learn* it shouldn't have called the script.
- **A question was asked before any answer existed.** "Will this task modify dependencies?" got asked up front, before there was a plan, before the model had read anything, before there was any information with which to answer it.

That last one is the whole post. The first three cost tool calls. The fourth cost a human round-trip, and it charged that cost at the worst possible moment: a decision demanded before the context needed to make it existed.

## The fixes were structural, not micro

My first instinct was the wrong one: profile the scripts, find the slow one, speed it up. That fails here because none of the scripts were slow. The structure was slow. You cannot micro-optimize your way out of a shape problem.

So the fixes changed the shape.

**Collapse the sequence into a fan-out.** The three sequential lookups became one call that runs them concurrently, with the remote fetch backgrounded behind a timeout so a slow tracker can't block local work that has nothing to do with it. Three serial round-trips became one.

**Short-circuit the whole path when the feature is off.** The orchestrator now checks whether worktree mode is even active before it touches any worktree machinery. On the common path, that is zero worktree calls instead of a wasted one.

**Delete the badly-timed question outright.** This is the fix I'm proudest of, because it removed work instead of reordering it. Symlinking dependencies into the new checkout became the silent default: free, correct for the large majority of branches, and promotable later with an explicit command when a branch genuinely changes dependencies. The question didn't move earlier or later. It stopped being asked. A sensible default plus an escape hatch beats a prompt every single time.

## The invariant

Here is the rule I pulled out of it, and the one I'd hand to anyone building an interactive agent:

> Count the turns before first user-visible progress. A question you ask the user costs more than the tool calls you were trying to save, and any question asked before the information exists to answer it is pure latency.

That second clause is the sharp one. A question asked before its answer can exist isn't a question at all. It's latency wearing a question's clothes.

:::note[Where the numbers come from]
The goal was cutting worktree mode from roughly nine turns to roughly five. Read those as a design target, counted from a transcript, not a measured benchmark. I counted tool calls in a recorded run and set a target; I did not run a before-and-after stopwatch. If I present them as anything firmer than that, I'm lying to you.
:::

## Why this is the lesson that stuck

I went in braced for the hard integration. I got boring APIs and one genuinely hard problem hiding in plain sight: the cost of interrupting a human.

Every optimization instinct I brought from normal code was aimed at the cheap thing. Parallelize the calls, cache the results, shave the milliseconds. All useful, all beside the point. The expensive operation in an interactive agent is the one that hands control back to a person and waits.

So now, when a flow feels slow, I don't open a profiler first. I count the round-trips, and I look hardest at the ones that stop and ask me something. Deleting one well-placed prompt beat parallelizing three scripts, and I don't think that ratio is unusual.

If you're building something an agent drives on your behalf, what's the question it asks you before it has any business asking? That's the one worth deleting first.
