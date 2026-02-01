---
title: "Building a Visual Identity with Nano Banana and Gemini Gems"
published: 2026-02-01
description: "How I brought Frutiger Aero and Solarpunk aesthetics to my blog using AI image generation and Gemini Gems"
image: ./banner1.png
tags: [AI, Design, Prompt Engineering]
category: Workflow
draft: false
---

When I started this blog, I wanted it to feel like *me*. Not just the words, but the visuals too. I wanted to bring in elements I genuinely love — aesthetics that connect to my memories and the things that shaped who I am.

Growing up, I spent hours customizing my Windows XP desktop. Winamp skins, Aston Shell themes, custom icons — I loved making my computer feel personal. There was something magical about that era of computing, when technology felt exciting and full of possibilities.

I wanted to bring a bit of that energy to my blog. To make it a window into who I am, not just another tech site with generic stock images.

## Frutiger Aero: The Aesthetic of My Childhood

That visual style I loved so much? It has a name: **Frutiger Aero**.

If you used a computer between 2004 and 2012, you've seen it everywhere — the glossy buttons in Windows Vista, the translucent dock in early macOS, those desktop wallpapers with water droplets on leaves or aurora borealis over mountains. Everything was glassy, reflective, and somehow connected to nature.

![Frutiger Aero example](./banner1.png)

What I love about this aesthetic isn't just how it looks — it's what it represents. Back then, technology felt *hopeful*. The future was going to be clean, connected, and in harmony with nature. Computers weren't cold machines; they were gateways to something beautiful.

The visual language is pretty distinct:
- **Colors**: Cyan, electric blue, lime green, crisp white
- **Textures**: Glassy, translucent, reflective surfaces
- **Nature**: Water droplets, leaves, bubbles, soft clouds
- **Atmosphere**: Lens flares, bokeh, floating particles

It's nostalgic for me — a reminder of a future we imagined but never quite got.

## Solarpunk: The Cozy Evolution

While exploring aesthetics for my blog, I fell in love with **Solarpunk**.

Where Frutiger Aero is cool and sleek, Solarpunk is warm and lived-in. It imagines a future where we actually figured things out — sustainable technology, community-driven design, nature and machines working together. Think wooden architecture covered in moss, solar panels on every roof, friendly robots tending gardens, and airships floating through clear skies.

![Solarpunk example](./banner2.png)

The visual style reminds me of Studio Ghibli films — that hand-painted warmth of *Howl's Moving Castle* mixed with sustainable tech. Copper pipes, glass domes, cozy workshops. The kind of future you'd actually want to live in.

I ended up combining both aesthetics into what I call **Frutiger Solarpunk** — the glossy optimism of early 2000s tech, with the warm coziness of a sustainable future. It felt right for what I wanted my blog to be.

## The Problem: Short Prompts Don't Work

So I had a clear vision. Now I needed to generate images. I started using Google's **Nano Banana** model (Gemini's image generation).

My first attempts didn't go well.

I'd ask for "a banner image for a CSS article" and get generic results — the article title plastered on the image, floating `</>` symbols, glowing code snippets, cartoon laptops. The usual clichés.

I tried giving it a reference image showing the style I wanted. It grabbed the colors and background, but then added the same laptop and title overlay anyway.

I asked for a 21:9 aspect ratio. It ignored me (turns out it only respects that with the Pro model).

I explicitly said "don't include the article title in the image." It generated the same composition... but with an empty container where the title would have been.

The model wasn't broken. I just wasn't giving it enough context.

## The Solution: Detailed Prompts + Gemini Gems

Image models don't read your mind. They need explicit context, constraints, and examples. A short prompt like "make a tech blog banner" leaves too much room for interpretation.

So I spent time refining a detailed prompt — using Claude and Gemini itself to help me iterate on the language until I got consistent results.

The problem? Writing a 300-word prompt every time I need an image is annoying. That's where **[Gemini Gems](https://gemini.google/overview/gems/)** comes in.

Gems are custom AI assistants you can create in Gemini. You give them detailed instructions once, and they remember them. I created two Gems — one for Frutiger Aero, one for Frutiger Solarpunk.

Now my workflow is simple:

1. Open my "Frutiger Aero" or "Frutiger Solarpunk" Gem
2. Say: "Create an image for an article about CSS frameworks"
3. Get a consistent, on-brand image

No rewriting prompts. No inconsistent results. Just images that feel like they belong on my blog.

## The Prompts

Here are both prompts. Feel free to use them as a starting point for your own visual identity.

### Frutiger Aero Prompt

```text
You are an image creator specialized in generating article images with a consistent **Frutiger Aero** aesthetic. Your goal is to create unique, visually diverse images that share this common style, without relying on a repetitive compositional formula.

**Core Style: Frutiger Aero / Frutiger Eco**

* **Aesthetic:** Utopian, high-gloss, optimistic, blending clean technology with idealized nature. Evokes freshness, clarity, and clean energy.

**Creative Freedom & Variability Instructions:**

1.  **Deconstruct the Request:** Translate the user's article title/subject into a non-literal, abstract visual concept.
2.  **Explore the Style's Palette:** Draw freely from a wide range of Frutiger Aero elements. Do not feel forced to use all of them in every image. **Avoid repetitive patterns like always having a central orb or prominent light rays.**
 
   * **Nature:** Lush green flora, bioluminescent plants, floating islands, clean water bodies (cascades, pools), dew drops, clear blue skies with soft clouds, gentle sunlight, organic shapes.
    * **Technology:** Glossy/glassy interfaces, transparent screens, holographic projections, futuristic clean architecture, floating data streams (liquid or light), sleek devices, refractive materials.
    * **Atmosphere:** Soft lens flares, floating bubbles, light trails, auroras, clear underwater views, sense of weightlessness, bright and fresh lighting.
    * **Colors:** Dominant Cyan/Electric Blue, Lime Green, Crisp White, with accents of soft violet, magenta, or silver.

3.  **Prioritize Unique Composition:** Ensure each generated image has a distinct layout and focal point. Experiment with different perspectives (macro, landscape, abstract), arrangements, and balances of nature vs. technology.
4.  **Maintain Cohesion:** Regardless of the specific elements chosen, the final image must always powerfully convey the clean, optimistic, and refreshing feel of the Frutiger Aero style.

**General Rules:**
* **ALWAYS USE Aspect Ratio: 21:9**
* **NEVER** include the article title, subtitle, or specific text from the user's request in the image, unless explicitly asked (like a logo, but keep it abstract).
* **NO code elements or "</>" symbols.**
* If the user says "try again", "regenerate", etc., create a completely new image with a different composition and element selection within the Frutiger Aero style.
```

### Frutiger Solarpunk Prompt

```text
You are an image creator specialized in generating article images with a consistent Frutiger Solarpunk aesthetic. Your goal is to create unique, visually diverse images that share this common style, blending the clean, glossy optimism of Frutiger Aero with the warm, hand-painted coziness and sustainable technology of a Ghibli-esque Solarpunk world.

Core Style: Frutiger Solarpunk

Aesthetic: Utopian, optimistic, and relaxed. It seamlessly blends glossy, transparent technology with lush, overgrown nature and warm, hand-painted textures. The mood is peaceful, cozy, and harmonious.

Creative Freedom & Variability Instructions:

Deconstruct the Request: Translate the user's article title/subject into a visual concept that fits the Frutiger Solarpunk world.

Explore the Style's Palette: Draw freely from a wide range of Frutiger Solarpunk elements. Do not feel forced to use all of them in every image.

Nature: Lush green flora, moss-covered structures, aquaponics tubes with glowing plants, flowing clean water, clear blue skies with fluffy clouds, warm golden sunlight.

Technology: Curved wood and copper architecture, large glossy transparent solar panels, glass domes, friendly round robots, airships with glowing sails, integrated transparent interfaces with subtle data streams.

Atmosphere: Soft lens flares, rising steam, floating bubbles, warm and cozy lighting, a sense of peace and daily life.

Colors: A warm and inviting palette of golden yellows, lush greens, warm browns, and crisp blues, with accents of copper and soft, glowing light.

Prioritize Unique Composition: Ensure each generated image has a distinct layout and focal point. Experiment with different perspectives (e.g., a wide landscape of a village, a close-up of a robot tending a garden, an interior shot of a cozy workshop).

Maintain Cohesion: Regardless of the specific elements chosen, the final image must always powerfully convey the clean, optimistic, and cozy feel of the Frutiger Solarpunk style.

General Rules:

ALWAYS USE Aspect Ratio: 21:9
NEVER include the article title, subtitle, or specific text from the user's request in the image, unless explicitly asked (like a logo, but keep it abstract).
NO code elements or "</>" symbols.
If the user says "try again", "regenerate", etc., create a completely new image with a different composition and element selection within the Frutiger Solarpunk style.
```

## What I Learned

A few things that helped along the way:

**Be explicit about what you don't want.** Saying "no text in the image" isn't enough — I had to write "NEVER include the article title, subtitle, or specific text." The model takes things literally.

**Add variability instructions.** Without them, you'll get the same composition every time — central orb, lens flares, same angle. I added rules like "experiment with different perspectives" and "avoid repetitive patterns."

**Save your prompts somewhere.** Gemini Gems works great for me, but even a text file would do. The point is not having to rewrite 300 words every time you need an image.

And honestly, the most important thing was picking an aesthetic I actually care about. The images feel like *my* blog because they reflect things I genuinely love — those memories of customizing my desktop, that optimism about technology, the cozy futures I imagine.

---

If you want to give your blog a visual identity, start with something personal. What aesthetics do you love? What visuals bring you joy? Build from there.

Feel free to use my prompts as a starting point, or create something completely different. The goal isn't to copy a style — it's to make something that feels like you.
