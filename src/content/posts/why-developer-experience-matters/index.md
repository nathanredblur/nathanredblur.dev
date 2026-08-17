---
title: "Why Developer Experience Deserves More Attention"
published: 2026-08-15
description: "Developer experience is a real lever most teams underinvest in. The friction is small each time and invisible on any roadmap, which is exactly why it never gets fixed."
image: "./cover.png"
tags: [Developer Experience, Web Development]
category: Development
draft: false
---

Here is a cost that never shows up anywhere. You want to see a screen in a certain state, so you log in as a test user, click through five pages to reach it, adjust some data to trigger the case you care about, and finally look at the thing you meant to look at. It takes ninety seconds. You do it maybe twenty times a day. Nobody has ever filed a ticket about it, because ninety seconds is not worth a ticket.

That is the whole problem with developer experience. Each instance is too small to matter, and the sum is never measured, so it sits below the line where anyone decides to act.

## Small friction, paid many times, adds up in silence

I want to be precise about the cost, because the honest version is more convincing than the dramatic one.

A single slow step is not a crisis. A four second wait for a dev server to reload is not going to ruin your day. The issue is repetition. You pay that four seconds every time you change a mock, and you change mocks constantly while chasing a bug. By the afternoon you have spent real minutes waiting, and worse, each wait is long enough to pull your attention somewhere else and short enough that you never fully commit to the context switch.

That second part is the expensive one, and it does not fit in a spreadsheet. Losing your train of thought has a recovery cost that dwarfs the four seconds. You come back and re-read the code you already understood a minute ago. None of this appears on a roadmap, because no single occurrence is worth planning around.

## Tools people quietly fight

The clearest signal that developer experience needs attention is a workaround nobody talks about.

Someone keeps a scratch file of the six commands a repo needs, because the repo hides them somewhere different from every other repo. Someone edits code and restarts the app to simulate a feature flag, every single time, because there is no faster way. Someone avoids testing the error state at all, because reaching it means faking a failure by hand, so it quietly stops getting tested.

These are not complaints anyone escalates. They are the small accommodations people make to keep moving. And that is exactly why the cost stays invisible: there is no ticket that says "this made me lose my momentum," so from a distance the tool looks fine. Meanwhile trust in it erodes, and people route around it instead of through it.

## It is usually nobody's job

Most developer experience problems share a cause. They are nobody's explicit responsibility.

Features have owners. Bugs have owners. The three second gap between wanting a screen and seeing it has no owner, so it never improves on its own. It only gets worse, because a growing codebase adds routes, adds flags, adds states, and every addition makes the manual path a little longer. Decay is the default. Left alone, the experience of working in a project gets steadily heavier as the project succeeds.

## What it looks like to actually fix it

I have spent real time on this in two tools, and the specifics show what "deliberate" means in practice.

The first is an in-app DevTools panel I built for reaching those hard-to-reach states. The ninety second walk I opened with becomes one keystroke: pick the route, pick the scenario, you are there. A smaller detail matters more than it should. The panel reopens on the tab you left it on. If you were working in Flags, reload the page, and it opens on Flags. Landing on a default tab is a tiny insult repeated fifty times a day, because each time you have to re-orient and find your place before you can resume. Restoring it took about eleven lines. I wrote about how the whole thing came together in [the in-app DevTools panel post](/posts/in-app-devtools-panel/).

The second is an AI workflow tool where the win is memory. Work survives across sessions, so when I come back the next morning I do not re-explain yesterday's decisions, the commands this repo needs, or where I left off. The context is written down and reloaded instead of reconstructed from my own head. That single property removes more daily friction than any clever feature I added. The details are in [what workon does](/posts/what-workon-does/).

Neither of these is impressive on a slide. A remembered tab and a persisted work log are not the kind of thing you demo. They are the kind of thing you only appreciate by not noticing them, which is precisely why they get skipped.

You do not need to build tooling to see the same effect. A test suite that reruns the moment you save a file, in well under a second, changes how you write tests. You lean on the loop. A suite that takes thirty seconds to start turns testing into a decision you make occasionally instead of a reflex, and the code gets worse for it. Same tests, same code, different experience, different outcome.

## Treat it as work, not as a hope

The reason developer experience underperforms is not that teams disagree it is valuable. It is that valuing something and resourcing it are different, and nobody resources what has no owner.

So the fix is boring and organizational. Give it an owner. Let someone treat the friction developers pay every day as real work with a place on the roadmap, not as a background hope that things will get better when there is time. There is never time, because none of it is ever urgent.

I think this matters more now, not less, because of how much of the work is shifting. When [the AI writes most of the code and you do everything else](/posts/ai-writes-code-you-do-everything-else/), the everything else is largely developer experience: how fast you can reach a state, how quickly you can verify a change, how much context you have to rebuild each time you sit down. The friction that used to be a tax on writing code is now a tax on the part of the job that stayed human.

None of this requires believing developer experience is the most important thing a team does. It is not. It is just underinvested relative to how often it is paid, and the payments are small enough to hide. That gap is the opportunity. What would you fix first if the ninety second walk finally had an owner?
