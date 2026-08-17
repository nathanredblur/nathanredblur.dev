---
title: "Your AI Writes the Code. You Do Everything Else."
published: 2026-08-16
description: "My AI assistant is genuinely good at one thing: writing the code in front of it. Everything wrapped around that is still mine, and that turned out to be most of the job."
image: "./cover.png"
tags: [Developer Experience, AI, Developer Tooling]
category: Development
draft: true
---

My AI assistant is genuinely good at one thing: writing the code in front of it. Give it a clear problem and enough context, and the diff comes back clean. That part, the part everyone talks about, is basically solved for me.

Everything around it is still mine.

I noticed this the way you notice a slow leak. Not all at once, but as the same small motions repeating, ticket after ticket. The assistant wrote the code. I did the rest. And the rest, it turns out, is most of the job.

## A normal morning

Take a normal morning. I open a ticket, and the first thing I do is reassemble it in my head, because the real content is never in one place. The description says one thing. A comment from three days ago already answered the question I was about to ask. The design doc that actually matters is linked two clicks away, and the mockup that shows the empty state is an attachment I almost scrolled past.

So I read all of it, pull the pieces together, and hand the assistant a version of the ticket that's more complete than the ticket itself. Then, the next day, I do a smaller version of the same thing just to remember what I decided yesterday: which edge case I chose, why I ruled out the other approach, what the plan even was.

Then I go to write code, and I hit the next thing that lives only in my head: the commands. This project uses pnpm and one test runner. The one I was in last week uses yarn and a different one. The lint command, the typecheck command, the way you run a single test file, the config that sits slightly off from the default. None of that is written anywhere the assistant can see. It's in my memory, and every time I switch between projects I reload it by hand.

The assistant will happily run whatever I tell it to run. Telling it the right thing, for this repo, is my job. Get it wrong and nothing errors loudly. It just does something subtly different from what the pipeline will do, and I find out later.

None of these is a hard problem. That's what took me a while to see. Each one is small, obvious, and instantly forgettable. They are cheap on their own and expensive as a habit.

## The loop that wears on me

The part that wears on me most is the wait-fix-wait loop.

I push. I wait for the pipeline. It fails. The honest cost here isn't drama, it's time. I have to work out *why* it failed. Sometimes that's genuinely worth it, a real bug I'm glad something caught. More often it's a lint rule, a flaky test, or a coverage gate sitting a hair under the threshold. Either way I read the failure, I understand it, and if the fix isn't obvious I copy the error back to the assistant and ask. It writes a fix. I push again. I wait for the whole pipeline again.

That waiting is the tax. Not one big block of it, a few minutes here and a few there, spread across a loop I run several times before a change is done. Multiply it by the number of times a real change goes red before it merges, and a good chunk of the afternoon is watching a progress bar and pasting errors into a chat.

The same shape shows up everywhere once you start looking. Naming the branch to the team convention. Splitting a pile of changes into commits someone could actually review. Writing a merge request description a reviewer can follow without a call. Reading the review comments back and sorting which ones a bot left from which ones a human did. Each is a small manual step. Each needs a specific piece of knowledge (the convention, the command, the context) that the assistant doesn't have and that I re-supply by hand.

## The pattern underneath

That's when it collapsed into one sentence for me.

The knowledge needed to do each step correctly lives outside the assistant. And re-supplying it by hand costs more than the step itself.

The ticket's real content, scattered across places. This repo's real commands, sitting in my memory. The pipeline's real failure, buried in a log. Yesterday's real decisions, already gone by this morning. The assistant could do any one of these steps if I explained it. Explaining it, every time, in a slightly different way, was the work. Somewhere along the line I had become the memory the tool didn't have, and I was paying for it in small increments all day.

Once I saw it stated that plainly, the fix stopped being "wait for a better AI" and turned into something more boring and more useful: give the knowledge a home. Stop explaining. Start encoding.

## So I built a place to put it

So I built one. It's a workflow I put together on top of Claude Code that owns the stretch from ticket to merge request: reading the ticket, creating the branch, running the right commands, grouping the commits, collecting the feedback, reading the pipeline. Not because any of those steps is hard, but because the knowledge that makes each one correct finally had somewhere to live that wasn't my head.

The interesting part was never the automation. It's the reframe. It isn't a tool that does the steps for me. It's a durable home for the knowledge that makes each step correct, and the automation falls out of having somewhere to put it.

I'll get into what it actually does next: [what workon does](/posts/what-workon-does/).

If your AI writes the code and leaves you holding everything else, which step do you re-explain the most? That's the one worth encoding first.
