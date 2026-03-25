---
name: blog
description: "Create, brainstorm, and improve blog posts. Use this skill whenever the user mentions writing a blog post, generating blog ideas, improving an existing post, or anything related to blog content creation. Also trigger when the user mentions posts, articles, writing content for the site, or asks to work with files in src/content/posts/. This skill handles three modes: creating new posts from scratch, brainstorming topic ideas, and reviewing/improving existing posts."
---

# Blog Post Skill

This skill helps create, brainstorm, and improve blog posts for the author's Astro-based personal tech blog.

## Before You Start

Read these reference files to understand who the author is and how they write. These files are maintained separately so they can evolve over time — always read the latest version:

1. **`references/author-profile.md`** — Author's background, expertise, interests, and technical context
2. **`references/writing-preferences.md`** — Voice, tone, banned language, formatting rules, and style patterns
3. **`references/content-tags.md`** — Tags and categories in use, which posts use them — use this to suggest tags for new posts and identify connection opportunities between articles

These reference files are living documents. If during the writing process you discover something worth remembering (a new preference the author expresses, a pattern that works well, feedback on a draft), suggest updating the relevant reference file.

---

## Mode Detection

Determine the mode from the user's request:

| User says something like... | Mode |
|---|---|
| "write a post about...", "create a blog post", "new post" | **Create** |
| "give me ideas", "what should I write about", "brainstorm topics" | **Ideas** |
| "improve this post", "review my post", "make this better" | **Improve** |

If ambiguous, ask which mode they want. If they provide a topic directly, default to **Create**.

For any mode, also read `references/content-tags.md` to understand existing content and suggest meaningful connections between posts.

---

## Mode: Create

Write a new blog post from idea to published file.

### Step 1: Research (if the topic warrants it)

For technical posts, tool reviews, or comparison posts — search for current information before writing. Check documentation, changelogs, and community discussions to ensure accuracy. Skip this for opinion pieces or personal experience posts where the author's knowledge is the primary source.

### Step 2: Clarify

If the topic is vague or missing key details, ask these questions (skip any that are already answered):

- What specific problem does this solve, or what curiosity does it spark?
- Who is the reader? (beginner / intermediate / advanced)
- What should they do after reading?
- Any specific examples, code, screenshots, or data to include?
- Is there a personal angle or experience to highlight?
- Target length? (quick ~3min / standard ~5min / deep dive ~10min)

Don't ask all questions if the user gave a detailed prompt. Extract what you can and ask only what's missing.

### Step 3: Outline

Create a structured outline with:

- **3 title options** with reasoning (max 60 chars for SEO, clear value proposition)
- **Target keywords** (primary + 3-5 secondary)
- **Section breakdown** with key points per section
- **Visual suggestions** (screenshots, code examples, diagrams)
- **Estimated reading time and word count**

Present the outline and wait for approval before writing.

### Step 4: Write

Follow this structure:

```
---
title: [Chosen Title]
published: [TODAY'S DATE as YYYY-MM-DD]
description: "[Compelling 1-2 sentence description]"
image: ""
tags: [Tag1, Tag2, Tag3]
category: [Category]
draft: true
---

[Opening hook — 2-4 sentences establishing the problem or curiosity.
Start with a personal anecdote, a bold statement, or a specific scenario.
The reader should know within 3 seconds what they'll gain.]

## [Section 1 H2 — descriptive, tells a story when scanned]

[Content following: concept -> example -> practical application]

[Include admonitions where helpful:]
:::tip[Title]
[Helpful context]
:::

## [Section 2 H2]

[Continue pattern. Each section: 150-300 words with actionable takeaway]

[Code examples with syntax highlighting:]
```language
// Always include language tag and context
```

[GitHub cards for mentioned tools:]
::github{repo="owner/repo"}

## [Continue sections as needed...]

## [Closing section — no "Conclusion" header needed]

[2-3 key takeaways, briefly stated]
[Specific call-to-action]
[Optional: closing question that invites engagement]

## Resources

- [Resource 1](link)
- [Resource 2](link)
```

### Step 5: Save the File

**Posts without local images:**
- `src/content/posts/[slug].md`

**Posts with local images:**
- `src/content/posts/[slug]/index.md`
- Images in the same folder

**Slug rules:** lowercase, dashes, short and descriptive. From "Master Media Downloads" -> `master-media-downloads`

### Step 6: Checklist

After creating the file, present what was done and a pre-publish checklist:

- File location
- Review title, description, tags, category
- Verify code examples are correct
- Check all links
- Add cover image if desired
- Read for flow
- Set `draft: false` when ready
- Preview with `pnpm dev`

---

## Mode: Ideas

Brainstorm blog post topics aligned with the author's expertise and interests.

### Step 1: Understand Direction

If the request is vague, ask:
- What area interests you right now?
- What have you figured out recently that took a while to understand?
- What problems do you keep solving for yourself or others?
- What do you wish existed when you were learning something?

### Step 2: Generate Ideas

Use these frameworks to generate 8-10 ideas across categories:

**Problem-Solution**: What did you recently solve? -> "How to [solve problem] without [common pain]"
**Comparison**: What tools have you tried? -> "[A] vs [B]: When to Use Each"
**Myth-Busting**: What do people get wrong? -> "Why [Common Belief] is Wrong"
**Journey**: Where did you start/end? -> "How I Went From [Start] to [End]"
**Toolkit**: What tools do you use? -> "My [X] Toolkit: [N] Tools I Can't Live Without"
**Deep Dive**: What seems simple but isn't? -> "[Topic]: Everything You Need to Know"

For each idea, include:
- **Title** (compelling, specific)
- **Angle** (what makes this unique — the author's personal take)
- **Target audience** (beginner/intermediate/advanced)
- **Effort estimate** (low/medium/high)
- **Why it works** (what value it provides)

Also check `references/content-tags.md` to identify gaps in existing coverage and suggest ideas that complement or extend previous posts.

### Step 3: Recommend Top 3

Rank the top 3 by impact vs effort. For each:
- Why this one first
- What makes it compelling
- What the author can bring that others can't

### Step 4: Develop Selected Idea

When the user picks one, offer to:
- Create a detailed outline
- Generate title variations
- Start writing directly (switch to Create mode)

---

## Mode: Improve

Review and enhance an existing blog post.

### Step 1: Identify the Post

If no file specified, ask for the path or title. Then **read the entire post** before analyzing.

### Step 2: Analyze

Evaluate across these dimensions (score 1-5 each):

- **Title & Hook**: Is it compelling? Does it promise clear value?
- **Structure**: Logical flow? Each H2 stands alone as a mini-title?
- **Engagement**: Does it hook? Is there "you" language? Relatable examples?
- **Scannability**: Short paragraphs? Headers tell a story? Bold on key terms?
- **Voice**: Does it sound like the author? First person? Personal experience?
- **Technical accuracy**: Are code examples correct? Links working?
- **SEO**: Keywords naturally placed? Meta description compelling?

Present:
- **Strengths** — what's working well
- **Top 3 priority improvements** — most impactful changes
- **Quick wins** — easy fixes with immediate impact

Ask which improvements to implement.

### Step 3: Implement

Make the requested changes. Show before/after for significant rewrites. For each change, explain the reasoning.

### Step 4: Review

Summarize what changed with before/after scores. Suggest any remaining improvements for the future.

---

## Blog Technical Reference

### Frontmatter Schema

```yaml
---
title: string           # Required — max 60 chars for SEO
published: YYYY-MM-DD   # Required
updated: YYYY-MM-DD     # Optional — last update date
description: string     # Optional — short description for index page
image: string           # Optional — cover image path (URL, /public, or ./relative)
tags: [Tag1, Tag2]      # Optional
category: string        # Optional — single category
draft: boolean          # Optional — true = hidden from public
lang: string            # Optional — only if different from site default (en)
---
```

### Extended Markdown Features

Available in this blog:

```markdown
::github{repo="owner/repo-name"}          # GitHub repo card

:::note                                     # Admonitions: note, tip, important, warning, caution
Content here
:::

:::tip[Custom Title]                        # With custom title
Content here
:::

The secret :spoiler[is hidden here]!        # Inline spoilers

```js title="filename.js"                  # Code with file name
```

```js {1, 4, 7-8}                          # Line highlighting
```

```js del={2} ins={3-4}                    # Diff markers
```

```js collapse={1-5}                       # Collapsible sections
```

```js showLineNumbers startLineNumber=5    # Line numbers
```
```

### Internal Links

All internal links MUST end with a trailing slash:
- Correct: `[text](/posts/my-slug/)`
- Wrong: `[text](/posts/my-slug)`

### Content Types

Each type has a natural structure:

- **Tutorial**: What you'll learn -> Prerequisites -> Steps -> Troubleshooting -> Next steps
- **Tool/Resource**: Problem it solves -> What it is -> Install -> Basic use -> Advanced -> Alternatives
- **Concept Explanation**: Why it matters -> Simple analogy -> How it works -> Applications -> Misconceptions
- **Comparison**: Overview -> Quick table -> Detailed analysis -> Use cases -> Recommendation
- **Opinion**: Bold opening -> Context/background -> Arguments with evidence -> Counter-arguments acknowledged -> Where you land

---

## Updating Reference Files

When writing or reviewing posts, pay attention to patterns worth capturing. Suggest updates to the reference files when:

- The author expresses a new preference ("I've started preferring X over Y")
- A writing pattern gets positive feedback or feels particularly effective
- You notice a new expression or pattern that sounds AI-generated
- The author's tools, setup, or interests change
- A new content type or structure emerges that works well
- A new tag or category is created — update `content-tags.md`

Frame the suggestion clearly: "I noticed [observation]. Want me to add this to [file]?"
