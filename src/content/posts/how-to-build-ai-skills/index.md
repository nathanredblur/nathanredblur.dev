---
title: "How to Build Good AI Skills"
published: 2026-08-12
description: "What I learned building skills for an AI coding harness: where the boundary between a skill and a script goes, why the description has a budget, and how to make one fire only when you ask."
image: "./cover.png"
tags: [AI, Developer Tooling, Developer Experience]
category: Development
draft: false
---

I've spent the last few months turning my repetitive dev work into skills for an AI coding harness. Some I use every day. A few I built, watched misfire, and deleted. The difference was never how clever the prose was. It was whether I understood what a skill is for.

A skill is a markdown file with frontmatter. The harness reads the frontmatter to decide when to load the rest. That's the whole format. Everything hard about building one is judgment: what to put in it, what to leave out, and what should never have been a skill in the first place.

Here's what I've learned about making skills that earn their place.

## A skill carries judgment. A script carries none.

My first mistake was writing a skill for every verb. One to run the linter. One to run tests. One to read a config file and figure out the right commands. It felt tidy. It was wrong.

Reading a lockfile to pick a package manager has no judgment in it. There's one correct answer and a machine can compute it. That's a script, not a skill. Running the linter and running the tests aren't two decisions either. They're two commands inside one decision: is this code acceptable to ship? So they belong in one skill.

The rule I settled on: **a skill boundary follows a decision, not a command.** If two things are always decided together, they're one skill. If a thing has no judgment in it, it's a script.

The split matters because scripts and skills fail differently. A script either works or throws, and you can test it with no AI in the loop. A skill is interpreted by a model, so it fails quietly, producing plausible output that's subtly wrong. Push everything deterministic down into scripts and you shrink the surface where silent failure can happen.

The seam between them stays simple. My scripts print their results as text the skill reads back, do one thing, and never prompt. The skill above decides what to do with that output. That one convention lets me rewrite a script without touching the skill that calls it.

## One router, many single-purpose skills

Once you have a handful of skills for one workflow, something has to route between them. The pattern that worked for me is one orchestrator skill that owns the flow, and single-purpose skills underneath, each owning exactly one phase.

The orchestrator reads intent, picks the phase, and hands off. It doesn't know how to read a ticket or open a merge request. It knows the order those things happen in and when to stop and ask. Each phase skill knows its own job and nothing else.

This keeps every individual skill small enough to hold in your head. When something breaks, you fix the one skill that owns that phase instead of untangling a monolith that does everything.

## Push the noisy work to a subagent

Some work is necessary and loud. Reading a failed CI log means scrolling past forty jobs and a wall of color codes to find the one real failure. If that lands in your main conversation, it drowns everything you actually need to see.

Hand that investigation to a subagent with its own context window. It reads the raw logs, does the digging, and returns a short structured report. The noise stays in the disposable context. Your main conversation gets the answer.

I do this for anything that generates a lot of output I don't need to keep: log analysis, test runs, wide searches. The main thread stays readable across a long task, which is the difference between a session you can resume tomorrow and one you abandon.

## Context is the budget

This is the part I underrated for the longest time.

The frontmatter description is read on every single tool-selection decision, in every session, whether or not your skill ever fires. It pays rent forever. The body loads only when the skill triggers. References load only when the body tells them to.

So the description gets a tight budget. I aim for around 800 characters. Not because a longer one won't parse, but because every skill's description competes for the model's attention on every decision, and a bloated one taxes decisions that have nothing to do with it. Say what the skill does and when to use it, name the sibling skill to prefer instead when they overlap, and stop.

The same instinct applies to human round-trips. The most expensive thing an interactive agent can do is ask the user a question, because now you're waiting on a human to notice, read, and decide. I once had a skill ask "will this task change dependencies?" before it had done any planning. The information to answer that didn't exist yet. A question asked before the answer is knowable isn't a question. It's pure latency wearing a question's clothes. I deleted it and picked a sane default instead.

Keeping context low, in the description and in the number of questions, is most of what makes a skill feel fast.

## Capitalize the two rules that can't bend

Models weight emphasis. Put a rule in ALL CAPS and it gets treated as more load-bearing than the prose around it. That's a real lever, and like any lever it stops working when you pull it constantly. A skill where every third line is shouting has no emphasis at all, because nothing stands out.

So I reserve caps for the one or two rules that are genuinely non-negotiable. In my ticket workflow that's things like NO IMPLEMENTATION WITHOUT AN APPROVED PLAN. Everything else is normal text with its reasoning attached.

That's the real point: even the capitalized rules carry their why. The official skill-creator guidance is blunt about this. If you catch yourself writing ALWAYS or NEVER in caps, treat it as a yellow flag and ask whether an explanation would do the job better. A model that understands why a rule exists follows it into cases you didn't anticipate. A model that only has the letter of the rule finds the gap.

## Make the load-bearing rules checkable

Prose decays. A rule that lives only in a paragraph gets ignored the first time it's inconvenient, by a human editor and by the model. The rules I actually trust are the ones I turned into a command that fails when they're broken.

This costs almost nothing. If a rule says no skill should hardcode `npm run`, the check is a grep across the skills directory that must return zero lines. If a rule says a description stays under budget, the check counts characters. A pattern you deleted and want to keep deleted is a grep that must stay empty.

The value is that anyone can verify the rule in five seconds without reading your design notes. A lint rule, a grep that returns nothing, a character count: pick whatever fits, but express the invariant as something a machine confirms, not something a reader is trusted to remember.

## Fire only when asked

The failure mode that erodes trust fastest isn't a skill that breaks. It's a skill that fires when nobody asked for it.

Picture a fresh shell. You type "make a commit." If a workflow skill grabs that, it loads a whole procedure with ticket conventions and state expectations over what should have been three lines of git. It hijacked an ordinary request. From the skill's side it looks like it worked, which is exactly why this bug is hard to notice from the inside.

So gate activation. Name the conditions under which firing is legitimate: the skill was invoked by name, a relevant identifier is in the conversation, or the user is clearly mid-flow in that workflow. Absent any signal, the right behavior is to miss and let the plain tools handle it.

Then test the gate with negative cases. A trigger set full of prompts that should fire only proves your skill is eager. The prompts that must fire nothing are the ones that prove it's accurate. "List my git worktrees" should reach raw git, not your workflow. Write that case down and check it.

## A plan you can follow

If you're building your first real skill, here's the order I'd go in:

1. **Write down the decision.** What judgment call is this skill making? If you can't name one, you're describing a script. Build the script instead.
2. **Push the deterministic parts into scripts.** One job each, a simple text contract, no prompting. Now they're testable without a model.
3. **Draft the body around the decision**, not the commands. Explain the why for anything non-obvious.
4. **Write the description last, to a budget.** Around 800 characters: what it does, when to fire, which sibling to prefer on overlap.
5. **Capitalize the one or two rules that can't bend**, and attach their reasoning. Leave the rest as prose.
6. **Turn every load-bearing rule into a check** that fails when broken.
7. **Gate activation and test the negatives.** Confirm the ordinary request still reaches the ordinary tool.
8. **Split when a skill is doing two jobs.** Expect to get the boundaries wrong the first time. Noticing within a day is the achievable part.

I put all of this together in one workflow that takes a ticket to a merge request. If you want to see the principles in a real plugin rather than in the abstract, I wrote about [what that workflow actually does](/posts/what-workon-does/). And if you're wondering why I bother encoding this instead of prompting from scratch each time, that's the argument in [the AI writes the code, you do everything else](/posts/ai-writes-code-you-do-everything-else/).

A good skill isn't a clever one. It's one that fires when you want it, stays quiet when you don't, and puts its judgment where you can read it.
