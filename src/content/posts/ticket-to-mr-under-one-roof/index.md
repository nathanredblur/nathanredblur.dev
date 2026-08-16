---
title: "Ticket to MR Under One Roof"
published: 2026-08-15
description: "How workon is actually built: one orchestrator that routes intent, single-purpose skills, small bash scripts, and a JSON contract that keeps the model deciding instead of reimplementing shell."
image: "./cover.png"
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

In the [last post](/posts/ai-writes-code-you-do-everything-else/) I described `workon`, a Claude Code plugin that owns the whole ticket-to-merge-request cycle, and why I built it: the knowledge needed to do each step correctly lived outside the assistant, and re-supplying it by hand cost more than the step itself.

This post is about how it's actually built. Four layers, one seam, and a couple of rules I had to enforce mechanically because prose decays.

## Four layers, each with one job

The architecture is boring on purpose, and it goes from the outside in.

At the top is **one orchestrator skill** that routes intent and gates phases. Under it, a set of **single-purpose skills** that each own exactly one phase: read the ticket, make the branch, run quality checks, commit, review, open the MR. Under those, a pile of **small bash scripts** that do the actual API work against GitLab, git, and the issue tracker. And off to the side, a few **subagents** that absorb noisy investigations (reading CI logs, mostly) in their own context, so my main conversation stays readable.

Here's the whole thing on one screen. I'm including it because the shape of the diagram *is* the design: intent flows down, data flows through scripts, and the noisy stuff gets quarantined.

```
                        user intent
                             |
                             v
              +------------------------------+
              |   workon  (orchestrator)     |   routes, gates, tracks
              +------------------------------+
                 |            |           |
     +-----------+            |           +------------+
     v                        v                        v
+----------+          +---------------+        +---------------+
| single-  |          |   subagents   |        |  state +      |
| purpose  |          | (own context) |        |  profile      |
| skills   |          +---------------+        +---------------+
+----------+                  |
     |                        |
     v                        v
+--------------------------------------------------------------+
|            bash scripts   --   JSON on stdout                |
|   progress on stderr    exit 0 ok / 1 error / 2 decide       |
+--------------------------------------------------------------+
                             |
                             v
            glab   git   curl   jq   yarn/npm/pnpm/bun
```

Scripts own every interaction with an external system, and each one does a single thing. Skills own the procedure and the judgment for a phase: what to do with the JSON, what to ask, when to stop. The orchestrator owns routing and the confirmation checkpoints. State and profile own everything that has to outlive the conversation.

## The seam is a JSON contract

Everything hangs on one convention, and it's the piece I'd steal for any tool like this.

**Every script prints JSON on stdout, human-readable progress on stderr, and returns an exit code of 0 for success, 1 for error, or 2 for "a human must decide."** The skill above it parses stdout with `jq` and makes the call.

That third exit code is the interesting one. It's how a script says "I found something a person has to choose between" without ever blocking on a prompt.

```
exit 0  →  success, here's the JSON
exit 1  →  error, something broke
exit 2  →  decision required, a human must choose
```

Scripts never prompt. The skill confirms with me *before* it invokes anything slow or destructive. That single rule is what makes the bash testable: a script whose entire interface is "arguments in, JSON out, exit code" can be run against a throwaway git repo with no model in the loop. It also means a skill can be rewritten without touching a script, and a script can be rewritten without touching a skill.

And it keeps the division of labor honest. The model spends its turns *deciding* rather than reimplementing shell it will get subtly wrong. When I catch a skill inlining shell that could have been a script, that's the smell that tells me the seam has leaked.

## Skills pay rent by the character

A skill is a markdown file with YAML frontmatter. That's the whole format. What turns it into an engineering interface rather than a documentation convention is *when* each part gets loaded.

- **The frontmatter `description`** is read on every tool-selection decision, in every session, whether the skill fires or not.
- **The body** loads only when the skill fires.
- **The `references/` files** load only when the body says to read them.

Three tiers, three very different costs. Get the tiering wrong and you pay continuously for something used rarely.

That cost is why descriptions have a **hard budget of 800 characters**. They're consulted on every inference, so they pay rent forever. Getting under budget meant deleting things that felt useful: ALL-CAPS emphasis like "USE THIS SKILL EAGERLY" (the embeddings do not care), and long lists of trigger synonyms, which got exiled to a per-skill `references/triggers.md`. Everything that overflows the hot path goes to a reference file. It's still there. It just isn't taxing every decision.

The corollary is a real scaling limit. Every user-invocable skill you add taxes the triggering decision for every *other* skill. A dozen is comfortable. Forty would make the trigger surface mostly noise, competing with itself, and no amount of good writing fixes that.

## Three rules the model can't argue around

The assistant is fast, confident, and occasionally confidently wrong. So the orchestrator enforces three invariants, stated in the one place I allow ALL-CAPS:

```
NO PHASE EXECUTION WITHOUT USER-CONFIRMED CHECKLIST
NO IMPLEMENTATION WITHOUT APPROVED PLAN
NO COMPLETION CLAIMS WITHOUT QUALITY VERIFICATION
```

I'm showing you the raw block because the wording is load-bearing: no phase runs without a checklist I confirmed, nothing gets implemented without a plan I approved, and nothing gets called done without verification.

Then comes the line that actually does the work: **"Violating the letter of these rules is violating the spirit."** That sentence is there because a model reading only the letter will find the gap. It'll start phase three without phase two's approval, or claim delivery without running the quality skill, and technically satisfy every word. Naming the spirit closes the gaps the letter didn't anticipate.

The consent model built on top is simple. Before any work, I get one interaction with two questions: which steps to skip, and whether to run autonomously or step-by-step. Even in autonomous mode, two stops are non-negotiable: clarifying questions before the plan, and a pause after the MR is created. Those are the two points where continuing on a wrong assumption is expensive.

The plan-approval gate is the one I'd never remove. It's the moment when a wrong approach is still cheap to fix, before it's ninety percent implemented.

## The lesson that reshaped everything

The single most useful thing I learned wasn't about APIs. It was about where to draw a skill boundary, and I learned it by getting it wrong.

`workon` went from **16 skills at first commit, to 10 the same day, to 12 two months later.** The first sixteen were one-skill-per-verb: a skill for lint, a separate one for unit tests, another for e2e, one for self-review, one for peer review, a standalone skill for detecting tools.

Six of them disappeared in a single afternoon because the boundaries were wrong. Lint and unit tests are not different *decisions*. They're different commands inside one decision: "is this code acceptable?" So they collapsed into one quality skill. Self-review and peer-review share their entire rule engine and differ only in input, so they became one review skill with two modes. And tool detection was never a skill at all. There's no judgment in reading a lockfile. It was a script wearing a skill's clothes.

The two that grew back later earned it by being genuinely separate judgment calls. Writing a test that would fail if you deleted the logic it checks is a different kind of thinking from running an existing suite.

The transferable rule, and the one I'd hand anyone building something like this:

> **A skill boundary should follow a decision, not a command.** If two things are always decided together, they're one skill. If a thing has no judgment in it, it's a script.

You cannot design the right boundaries in the abstract. Getting the granularity wrong on the first attempt seems unavoidable. Noticing within a day, while the thing you're building on top is still small, is the achievable part. It's much cheaper to fix at day one than at month three.

## The reframe, again

None of these layers is clever in isolation. A router, some markdown, a heap of bash, a JSON contract. What makes it work is the same reframe from the first post: I stopped trying to automate the steps and started building a home for the knowledge that makes each step correct. The layers are just where different kinds of knowledge live, and the contract is how they talk without stepping on each other.

If you're building your own version, the order that saved me the most pain: get the seam right first (scripts that never prompt, one exit-code contract), then let the skill boundaries emerge from where the work actually hurts. What's the phase in your loop you'd trust a script with, and which one still needs your sign-off?
