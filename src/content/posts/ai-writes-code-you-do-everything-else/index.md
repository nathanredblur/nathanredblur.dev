---
title: "Your AI Writes the Code. You Do Everything Else."
published: 2026-08-15
description: "My AI assistant is great at exactly one part of the job: writing code. Here's all the manual work it left me with on every ticket, and what I did about it."
image: "./cover.png"
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

My AI coding assistant is great at exactly one part of my job: writing code.

Everything wrapped around that part is still mine. Reading the ticket. Naming the branch to the team convention. Splitting the work into reviewable commits. Opening the merge request with a description a human can actually review. Reading the review comments back. Watching the pipeline. Shipping the branch to a test server so someone can look at it.

I do all of that by hand, every ticket, in the same order, with the same dozen context switches. In March 2026 I finally counted them, and the number annoyed me enough to fix it.

## The assistant could do any step. That was the problem.

Here's the trap: the assistant *can* do any one of those steps, if I explain it.

So explaining it became the work. Every new ticket meant re-teaching the same conventions to a fresh context window. Each re-teaching came out slightly different from the last, so the output did too. I was the memory the tool didn't have.

Here's the manual work that pushed me over the edge. None of these is a hard problem. That's the point. They're cheap on their own and expensive as a habit.

## The ticket lives in six places, the assistant sees one

A ticket isn't a paragraph. It's a description, a comment thread, a handful of attachments, links to design docs, and related issues. When I pasted "the ticket" into a chat, I pasted the description, and lost the comment where someone already answered the API question, plus the mockup showing the empty state.

The obvious fix is to paste more. That fails for a boring reason: I don't know which of the six places holds the load-bearing detail until after I've built the wrong thing.

## Review feedback is scattered across four places

Feedback on a merge request doesn't land in one inbox. Human reviewers leave comments anchored to the diff. Review bots leave their own. The pipeline reports failures. Security and quality scanners pile on more. Collecting all of it means checking four surfaces, and the tools quietly disagree about what counts as a resolved thread, so a real comment is easy to miss under the bot noise.

## A red pipeline is twenty minutes of log archaeology

The pipeline fails. Now find which of forty jobs failed *first*, not the loudest one, the first one. Open the trace. Scroll past the ANSI color codes that make it unreadable in a terminal. Decide whether this is a real regression, a flake, or a coverage gate sitting at 77.5% against an 80% threshold.

The tempting move is to retry first and read later. It works often enough to become a habit, and wastes fifteen minutes when it doesn't.

## Shipping to a test box is babysitting, then a login dance

The change needs to run somewhere real. Sometimes that's so a reviewer or a designer can look at it. Just as often it's so I can prove to myself the fix works outside my machine and attach the evidence to the merge request. Either way, I sit on the CI page and refresh it until the build goes green. Then the actual chore starts: dig up the deploy command, remember the service name, SSH into the box, point it at my branch build, confirm it came up.

None of that needs me. It needs something that watches the pipeline, notices the moment it passes, and runs the deploy itself, so I'm not checking a browser tab every ten minutes or re-reading yesterday's notes to remember the incantation.

## Day two starts by forgetting day one

A ticket that takes two days takes two or three sessions. Everything the assistant learned in session one (the plan I approved, the edge cases I decided, the branch it made, the comments it already addressed) is gone.

Session two re-derives all of it, badly, and asks me questions I already answered. I tried keeping a scratch file by hand. I stopped, because maintaining it is work that competes with the work.

## One ticket at a time, or you lose the session

A ticket goes to review and I want to start the next one. My options were both bad: stash and switch branches, which throws away the live session holding all the context for the paused ticket, or set up a second checkout by hand and lose the conventions that make the first one work.

So I waited. Waiting is what CI is for, except now I'm blocked on my own tooling instead of the build.

## The pattern underneath all of it

Every one of these is the same problem wearing a different hat: **the knowledge needed to do a step correctly lives outside the assistant's context, and re-supplying it by hand costs more than the step itself.**

The ticket's real content. The review's real comments. The pipeline's real failure. The deploy's real commands. Yesterday's real decisions. Once I saw it stated that plainly, the fix was obvious: stop explaining, start encoding.

## So I built a place to put the knowledge

The result is a workflow I call `workon`, a plugin for Claude Code that owns the whole ticket-to-merge-request cycle. One orchestrator that routes intent, a set of single-purpose skills that each own one phase, a pile of small bash scripts that do the actual API work, and a few subagents that read the noisy things (like CI logs) in their own context so my main conversation stays readable.

It's not open source. It encodes one team's conventions and one environment's constraints. But the interesting part was never the code. It's the reframe:

> It isn't an automation of the steps. It's a durable home for the knowledge that makes each step correct, and the automation falls out of having somewhere to put it.

The rule I care about most: **it never writes code without a plan I approved.** The assistant is fast, confident, and occasionally confidently wrong, so the one gate I won't remove is that a plan gets my sign-off before anything gets implemented.

## What this actually saves

I don't have a "saves 40%" number for you. Nobody was timing this. Writing software isn't making shoes. Nobody stands over you with a stopwatch counting how long it takes to read a red pipeline.

:::warning[These are estimates, not measurements]
The figures below come from doing this work by hand for months, not from instrumentation. Time your own loop before you trust any of them.
:::

My rough accounting for one moderately difficult ticket (a few files, two days, goes red twice before merging) lands around **an hour of purely mechanical work**: reading the ticket, collecting review feedback, two pipeline investigations, shipping to a test box, reconstructing context on day two. Work that takes no judgment, produces nothing, and gets redone identically on the next ticket.

But minutes are the wrong unit. The real measure is one you already feel: how many times a day does it frustrate you that this isn't easier, that the friction is sitting between you and the thing you actually wanted to build?

That's what I was optimizing. Not seconds saved. Attention reclaimed.

## What's next

This is the first post in a series about that idea: friction is a real engineering problem, even when each instance is small.

The next ones go deeper. How `workon` is actually built, with skills, scripts, and subagents. The lesson that surprised me most: in an interactive agent, the most expensive thing you can do is ask the human a question. And its frontend twin, an in-app DevTools panel I built for the same reason in a completely different domain.

If your AI writes the code and leaves you holding everything else, what's the step you re-explain most? That's the one worth encoding first.
