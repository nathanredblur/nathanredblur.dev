# Cover Image Prompts

Nathan generates blog cover images with an image app on **[Opal](https://opal.google/)** that already holds the blog's visual style. So a cover image prompt must **only describe the article** and the key elements the image should contain — **never the visual style** (no palette, no aesthetic, no "Frutiger Aero/Solarpunk", no lighting/mood direction). The app applies the style.

## What the prompt should contain

- **Subject:** what the article is about, in one or two plain sentences — the concept, not a literal screenshot or UI.
- **Key elements (optional):** a short list of concrete things worth showing (objects, actors, relationships). Include only what genuinely matters to the topic.

## What the prompt must NOT contain

- No style, aesthetic, palette, colors, lighting, mood, or texture direction.
- No aspect ratio or camera/composition direction.
- No article title, subtitle, or any text to render in the image.
- No reference to specific posts or to the blog's identity.

## Output format

Produce a single fenced `text` block the author can paste directly into the Opal app. Keep it short:

```text
Article: <one or two plain sentences describing the topic>.
Key elements: <comma-separated concrete things to include, if any>.
```
