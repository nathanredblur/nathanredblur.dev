---
title: "What workon Does, and How It Helps My Day"
published: 2026-08-16
description: "A look at workon, my Claude Code plugin that carries a ticket to a merge request, what it runs, what it refuses to do, and how it changes my day."
image: "./cover.png"
tags: [AI, Developer Tooling, Developer Experience]
category: Development
draft: true
---

I built a Claude Code plugin called `workon`. It takes a ticket and carries it all the way to an open merge request, and I use it every working day.

This is not a spec. It is what the tool actually does, what I told it never to do, and the ways it makes my day quieter. If you want the deeper reasons a tool like this exists at all, I wrote about that in [AI writes the code, you do everything else](/posts/ai-writes-code-you-do-everything-else/).

## What it runs, in order

`workon` moves through phases, and the order matches how I actually work a ticket.

It reads the ticket first. Not the summary I paste into a chat, the whole thing: description, comments, attachments, linked docs, related issues. Then it asks clarifying questions, grouped by scope, technical detail, and edge cases, before it writes a plan. Then it plans, and waits for me to approve the approach. Only after that does it create a branch, implement, run the quality checks the repo actually uses, open the merge request, and watch the pipeline.

I run it in one of two ways. **Autonomous** mode flows through the phases without stopping, pausing only for the clarifying questions and once more after the merge request exists. **Step-by-step** mode stops after each phase, tells me what it did, and waits for me to say continue.

Which one I pick depends on the ticket, not on my general mood about the tool. A small fix in code I know well runs autonomous. A change in a module I have not touched in months runs step-by-step, so I can watch each phase land before the next one starts.

## The plan gate is about the approach, not the code

There is one rule I care about most: no implementation without an approved plan.

This is easy to misread, so let me be exact. It is not there because I distrust the code the AI writes. The generated code is usually fine. The gate exists because I want to approve the *approach* before anything gets built.

A wrong approach is cheap to fix while it is still a paragraph in a plan. The same wrong approach is expensive to unwind once it is spread across seven files and three commits. So the plan phase is a checkpoint on direction, not a quality check on syntax. I read the plan, I catch the wrong assumption, and I catch it at minute three instead of minute ninety.

## What it deliberately does not do

The plugin's reach is narrow, and that is on purpose.

It never merges. Approval and merge stay with me, and there is no code path anywhere in it that merges a merge request. It never touches the default branch. Every flow starts by creating or checking out a ticket branch, so `master` or `main` is never in the line of fire. And it does not manage projects: no sprint boards, no estimates, no status reports. It reads a ticket and it writes code toward it. That is the whole job.

Keeping the scope this tight is what lets me trust it in autonomous mode. I know the set of things it can do, and merging my own work while I am not looking is not in that set.

## How it actually helps

The value is not that a machine writes code. Every AI assistant does that. The value is in the work that used to wrap around the code, the work that was mine to redo by hand every single time.

**The ticket arrives whole.** Before the plugin, I would paste the description into a chat and lose the comment where someone had already answered the API question, plus the attached mockup showing the empty state. One call now returns all of it. The class of bug where I build against the description and miss the answer in comment three stops being available to me.

**Commands are detected per repo.** One project uses `pnpm lint`, another wants `yarn test:unit`, a third only has the raw binary in `package.json`. The plugin reads the lockfile and the scripts to figure out what this repo actually runs, then remembers it for the rest of the ticket. I stopped keeping a mental map of which project uses which runner, and I stopped running the wrong one and getting a subtly different result than CI.

**Work survives the session.** A ticket that takes two days takes two or three sessions. The plan I approved, the edge cases I decided on, the branch, the merge request, the review comments already addressed: all of it is written to a file on disk before the first phase begins. Day two is a read, not a re-derivation. I am not answering the same questions I answered yesterday, and the decisions I made the first time do not get quietly remade a different way the second time.

If you want to know how something like this gets built, the general approach is in [how to build AI skills](/posts/how-to-build-ai-skills/).

## Staying out of the way

One thing I kept tuning: I want it to fire only when I ask for it.

The failure mode I was guarding against is a plugin grabbing an ordinary command. If I type "make a commit" on a fresh shell with no ticket and no workflow in progress, I do not want a ticket-shaped workflow to wake up and take over three lines of git. So the plugin activates only when there is a real signal that I want it: I said "workon," or there is a ticket key in play, or I am clearly mid-flow on my own branch. Absent that, it stays quiet and lets plain git do its thing.

It is annoying when a tool answers a question you did not ask it. Nobody is uninstalling anything over it, but a workflow tool you run dozens of times a day cannot afford to surprise you, so I spent the effort to make it invisible until called.

## Where it sits now

`workon` is one developer's workflow, encoded once. It reads a ticket, asks the right questions, plans, branches, builds, checks, and opens a merge request, in two pacing modes, and it refuses to merge or manage. What it removes from my day is not the interesting coding. It is the hour of mechanical setup and cleanup that surrounded the coding and produced nothing on its own.

That is the trade I wanted. I still make the decisions that matter. I just stopped doing the parts that never needed a decision in the first place.
