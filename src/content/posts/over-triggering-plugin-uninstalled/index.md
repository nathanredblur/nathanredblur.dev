---
title: "Over-Triggering Is the Bug That Gets Your Plugin Uninstalled"
published: 2026-08-15
description: "A skill-based plugin doesn't get uninstalled because it breaks. It gets uninstalled because it fires when nobody asked. Here's the activation gate that keeps mine quiet, and the fictional ticket key it once invented on every commit."
image: ""
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

The way a skill-based plugin dies is not the way you expect.

I spent the first weeks of building [`workon`](/posts/ai-writes-code-you-do-everything-else/), my Claude Code plugin for the whole ticket-to-merge-request cycle, worried it would break. Wrong API call, mangled JSON, a script that exits at the wrong moment. Those bugs are loud. You see them, you fix them, you move on.

The bug that actually gets a plugin uninstalled is quiet. It's the plugin firing when nobody asked it to.

## Over-triggering erodes trust faster than under-triggering

A skill has two failure modes, and the obvious one is the harmless one.

**Under-triggering** is when you ask for something and nothing happens. It's annoying. It's also completely obvious: you notice immediately, you rephrase, you move on. Nobody uninstalls a plugin because they had to ask twice.

**Over-triggering** is when you ask for something ordinary and the plugin grabs it. This is the dangerous one, and it's dangerous precisely because it's hard to notice from the inside. From the plugin's perspective, it *worked*. It activated, it ran its procedure, it produced output. The failure is invisible from where the plugin stands.

The person on the other end sees something different: they asked for a small thing and got a large, opinionated machine they didn't invite. That feels like the tool hijacking the terminal. And a tool that hijacks your terminal is a tool you turn off.

## The three lines of git that get hijacked

Here's the concrete case I designed against.

You open a fresh shell. No ticket in play, no merge request, no workflow running. You type "make a commit," because you just want three lines of git to happen: stage, message, done.

If `workon-commit` activates here, it doesn't give you three lines of git. It loads a workflow-scoped procedure: ticket-prefix conventions on the message, expectations about a state file that doesn't exist, assumptions about a branch that was never created inside the workflow. What you wanted was `git commit`. What you got was a process.

Nothing errored. The commit probably even happened. But the plugin answered a question you didn't ask, and that's the erosion.

## The activation gate: when in doubt, miss

The fix is a gate the sub-skills have to clear before they're allowed to fire. A `workon` sub-skill may activate only when at least one context signal is present:

- A `/workon` command was invoked this session.
- The user actually said "workon."
- A ticket key or a merge-request URL appears in recent messages.
- The conversation is clearly mid-flow on the user's own branch.

Absent all four, the correct behavior is to **miss**. Not to guess, not to help, not to reach. To sit still and let plain git, or a more specific plugin, handle it.

That word matters. Most of what you write into a plugin is about making it fire. The activation gate is the opposite discipline: writing down the conditions under which the right move is to do nothing. A plugin that can't stay silent is a plugin that competes with every other tool for every ordinary request, and loses everyone's trust in the process.

## Negative test cases are the ones that prove accuracy

Here's the part most trigger sets get wrong.

When you write test prompts for a skill, the natural instinct is to write the positive cases: "open a worktree for ABC-1" should activate the branch skill, "review this MR" should activate the review skill. You collect a dozen of those, they all pass, you feel good.

Those prove nothing. A plugin that fires on everything passes every positive case too. Greedy and accurate look identical when you only test the things that are supposed to trigger.

The test that proves accuracy is the negative one. `git worktree list and tell me what's there` must trigger **nothing**, because raw git is the right answer and there is no workflow context anywhere in that request. If that prompt activates a single skill, the gate is broken, and no amount of green positive cases will tell you.

So the negative cases are the load-bearing ones. A trigger set with only positive cases doesn't prove your plugin is accurate. It proves it's eager, which is the thing you were trying to rule out.

## My favorite bug: the ticket key that never existed

The best example of silent over-behavior in the whole project isn't a triggering bug at all. It's what happens *after* a skill fires correctly, on a foundation you never thought to inspect.

The harness creates worktree branches with a `worktree-` prefix. Reasonable enough on its own. Meanwhile, the repository had a `prepare-commit-msg` git hook that derives the ticket prefix from the branch name, so commits come out tagged with the ticket they belong to. Also reasonable on its own.

Put them together and a branch named `worktree-ABC-30804` produces commits prefixed **`WORKTREE-ABC`**. A plausible-looking ticket key. Entirely fictional. On every single commit. Silently.

No error, no warning, nothing in the output that looked wrong. Just a fake ticket reference quietly stamped into git history, commit after commit, until someone eventually squints at the log and asks what `WORKTREE-ABC` is.

The fix is small once you see it: the fresh-worktree preamble strips the harness prefix and renames the branch immediately on landing, before any commit can observe the old name. The lesson is bigger. Nothing about "add worktree support" suggests you should go read the repository's git hooks. That's exactly why that class of bug survives design review. Two features that are each correct in isolation combine into a wrong output that neither one is responsible for.

I wrote more about why I stopped trusting prose to catch things like this, and started encoding rules as checks a machine runs, in [a later post in this series](/posts/encode-invariants-as-checks/).

## Two more things it refuses to do

Once you start treating "firing when you shouldn't" as a first-class bug, other guardrails fall out of the same instinct.

**It never merges.** Approval and merge stay human, and there is no code path anywhere in the plugin that merges a merge request. Not a policy I trust the model to follow. An absence: the capability simply isn't there to be triggered.

**It won't tell you the pipeline is green when it isn't.** Job status is a snapshot, and a first-fetch "green" is not a verdict. Snapshot and end-to-end jobs that were still queued at the moment you checked routinely fail minutes later. So nothing claims "all green" until every blocking job has reached a terminal state, or it says explicitly which jobs are still running. One falsely-green report costs more trust than ten honest "still waiting" ones.

## The pattern

All of this comes back to one idea. For a plugin built on skills, correctness isn't only about doing the right thing when asked. It's equally about doing *nothing* when not asked.

The failure that gets you uninstalled is rarely a crash. It's the quiet, confident, unrequested help that answers a question the user never posed. If you're building one of these, write the gate before you write the triggers, and test the silence harder than you test the noise.

If you missed how the whole workflow is actually constructed, that's the [previous post](/posts/ticket-to-mr-under-one-roof/). What's the one command in your own setup that a plugin keeps stealing when you didn't want it to?
