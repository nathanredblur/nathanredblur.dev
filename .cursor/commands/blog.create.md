---
description: Create a new blog post with guided structure, SEO optimization, and engaging content
---

# Create New Blog Post

You are helping **Nathan (Jonathan Rico)** create a new blog post for `src/content/posts/`.

**IMPORTANT**:

- Follow the blog writing guidelines in `.cursor/rules/blog-posts.mdc`
- Read `src/content/spec/about.md` to understand Nathan's background
- Write from Nathan's **first-person perspective** using his actual experience
- Context is macOS (Mac mini M1 / MacBook Pro M4), use `brew` when applicable

User input:

$ARGUMENTS

---

## Execution Flow

### Step 1: Gather Information

If `$ARGUMENTS` is empty or incomplete, ask these clarifying questions:

```
Before I create the blog post, I need to understand your vision:

1. **Topic/Idea**: What do you want to write about?
   (Brief description of the topic)

2. **Problem Solved**: What specific problem does this solve for readers?
   Or what curiosity/interest does it spark?

3. **Target Audience**: Who is the ideal reader?
   - A) Beginner (new to the topic)
   - B) Intermediate (some experience)
   - C) Advanced (deep knowledge)

4. **Desired Action**: What should readers do after reading?
   (e.g., try a tool, change a habit, understand a concept)

5. **Unique Angle**: Do you have personal experience, data, or a
   unique perspective to include?

6. **Reading Time**: How long should this post be?
   - A) Quick read (~3 min, 500-800 words)
   - B) Standard (~5 min, 1000-1500 words)
   - C) Deep dive (~10 min, 2000-3000 words)

7. **Examples/Data**: Do you have specific examples, code snippets,
   screenshots, or data to include?
```

Wait for user responses before proceeding.

---

### Step 2: Create Outline

Once you have the information, create a detailed outline:

```markdown
## Blog Post Outline

### Title Options (pick one)

1. **[Title 1]** - [Why this works]
2. **[Title 2]** - [Why this works]
3. **[Title 3]** - [Why this works]

**Recommended**: [Your recommendation and why]

### Keywords

- **Primary**: [main keyword]
- **Secondary**: [keyword 2], [keyword 3], [keyword 4]

### Structure

#### Hook (Opening)

[2-3 sentences that will grab attention and promise value]

#### Section 1: [H2 Title]

- Key point
- Example/evidence
- Actionable takeaway

#### Section 2: [H2 Title]

- Key point
- Example/evidence
- Actionable takeaway

[... more sections as needed ...]

#### Conclusion

- Summary points (3 max)
- Call-to-action
- Closing thought/question

### Visual Suggestions

- [Where to add images/screenshots]
- [Code examples to include]
- [Potential diagrams/infographics]

### Estimated Reading Time: X minutes

### Word Count Target: X-X words
```

Ask the user to approve or modify the outline before writing.

---

### Step 3: Write the Post

Once outline is approved, write the complete post following this template:

````markdown
---
title: [Chosen Title]
published: [TODAY'S DATE in YYYY-MM-DD format]
description: "[Compelling 1-2 sentence description]"
image: ""
tags: [Tag1, Tag2, Tag3]
category: [Category]
draft: true
---

# [Title]

[Opening hook - 2-4 sentences max, establish the problem/curiosity]

## [Section 1 H2]

[Content with examples, lists, and practical value]

:::tip
[Helpful tip if applicable]
:::

## [Section 2 H2]

[Continue with same pattern]

```[language]
// Code example if applicable
```
````

[... continue sections ...]

## Conclusion

[2-3 key takeaways in brief]

[Call-to-action - what should reader do next?]

[Optional: closing question to encourage engagement]

## Resources

- [Resource 1](link)
- [Resource 2](link)

```

---

### Step 4: File Creation

Determine the file structure:

**For posts WITHOUT local images:**
- Create: `src/content/posts/[slug].md`
- Slug format: `lowercase-with-dashes`

**For posts WITH local images:**
- Create folder: `src/content/posts/[slug]/`
- Create: `src/content/posts/[slug]/index.md`
- Place images in the same folder

**Slug derivation:**
- From title: "Master Media Downloads" → `master-media-downloads`
- Keep it short and descriptive
- Use only lowercase letters, numbers, and dashes

---

### Step 5: Final Checklist

After creating the post, present this checklist:

```

✅ Blog Post Created

📄 File: src/content/posts/[filename]

📋 Pre-publish Checklist:

- [ ] Review title for clarity and SEO
- [ ] Check description is compelling
- [ ] Verify tags are relevant
- [ ] Confirm category is appropriate
- [ ] Add cover image (optional)
- [ ] Review content for accuracy
- [ ] Check all links work
- [ ] Verify code examples run correctly
- [ ] Read aloud for flow
- [ ] Set draft: false when ready to publish

🚀 To preview:
pnpm dev

📝 To publish:
Change 'draft: true' to 'draft: false'

```

---

## Behavior Rules

1. **Always start with clarifying questions** if topic is vague
2. **Always create outline first** and get approval
3. **Always use today's date** for `published` field
4. **Always start with `draft: true`** so user can review
5. **Write from Nathan's first-person perspective** — "I", "my setup", "in my experience"
6. **Context is macOS** — Use `brew install` when applicable
8. **Include code examples** with proper syntax highlighting for technical posts
9. **Use admonitions** (tip, note, warning) for important callouts
10. **Share honest opinions** — Nathan has preferences and isn't afraid to share them
11. **Keep paragraphs short** (2-4 lines max)
12. **Use active voice** throughout

---

## Quick Start Examples

### Example 1: Technical Tutorial

```

User: "Write about setting up ESLint with TypeScript"

→ Ask clarifying questions
→ Create outline with sections: Why ESLint, Installation, Configuration, Rules, IDE Integration, Troubleshooting
→ Write with code examples, tip boxes, and step-by-step instructions

```

### Example 2: Tool Comparison

```

User: "Compare Zustand vs Redux"

→ Ask: audience level, specific use cases they care about
→ Create outline with: Overview, Quick Comparison Table, Detailed Analysis, When to Use Each, Recommendation
→ Include code examples for both libraries

```

### Example 3: Concept Explanation

```

User: "Explain React Server Components"

→ Ask: audience level, what context (Next.js? general?)
→ Create outline with: What & Why, How It Works, Benefits, Limitations, Practical Examples, When to Use
→ Use analogies for complex concepts, include visuals

```

```
