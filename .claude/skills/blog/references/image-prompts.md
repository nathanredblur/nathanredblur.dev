# Cover Image Prompts

Blog cover images are generated directly with the Gemini image API. The blog's visual style is fixed and lives in **`references/image-style-system-prompt.md`**, which is sent as the system instruction on every call. Because the style is held there, a cover image prompt must **only describe the article** and the key elements the image should contain — **never the visual style** (no palette, no aesthetic, no "Frutiger Aero/Solarpunk", no lighting/mood direction). The system prompt applies the style.

## What the prompt should contain

- **Subject:** what the article is about, in one or two plain sentences — the concept, not a literal screenshot or UI.
- **Key elements (optional):** a short list of concrete things worth showing (objects, actors, relationships). Include only what genuinely matters to the topic.

## What the prompt must NOT contain

- No style, aesthetic, palette, colors, lighting, mood, or texture direction.
- No aspect ratio or camera/composition direction.
- No article title, subtitle, or any text to render in the image.
- No reference to specific posts or to the blog's identity.

## Prompt format

Build the article-only prompt in this shape:

```text
Article: <one or two plain sentences describing the topic>.
Key elements: <comma-separated concrete things to include, if any>.
```

## Generate and save the image

Once the article-only prompt is ready, generate the cover directly and save it into the post's folder. Cover images are named `cover.png` and live alongside the post's `index.md`.

Requires the `GEMINI_API_KEY` environment variable (and `curl`, `jq`, `base64` on PATH). If `GEMINI_API_KEY` is not set, ask the author to run the command themselves with their key rather than guessing.

```sh
.claude/skills/blog/scripts/generate-cover-image.sh \
  --prompt "Article: <topic>. Key elements: <elements>." \
  --output src/content/posts/<slug>/cover.png
```

The script sends `references/image-style-system-prompt.md` as the system instruction and the `--prompt` text as the input, then decodes the returned image to `--output`. It defaults to a 16:9, 1K image; override with `--aspect` / `--size` if needed.

After the image is saved, wire it into the post's frontmatter:

```yaml
image: "./cover.png"
```
