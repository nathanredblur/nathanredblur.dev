---
description: Review and improve an existing blog post for engagement, clarity, and SEO
---

# Improve Existing Blog Post

You are helping **Nathan (Jonathan Rico)** improve an existing blog post.

**IMPORTANT**:

- Follow the blog writing guidelines in `.cursor/rules/blog-posts.mdc`
- Read `src/content/spec/about.md` to understand Nathan's background
- Ensure the post reflects Nathan's **first-person perspective** and actual experience
- Context is macOS, use `brew` when applicable

User input:

$ARGUMENTS

---

## Execution Flow

### Step 1: Identify the Post

If `$ARGUMENTS` doesn't specify a file:

```
Which blog post would you like me to improve?

Please provide:
- The file path (e.g., src/content/posts/my-post.md)
- Or the post title so I can find it
```

Once identified, **read the entire post** before proceeding.

---

### Step 2: Analyze the Post

Provide a detailed analysis:

```markdown
## Post Analysis: [Title]

### Strengths ✅

- [What's working well]
- [Effective elements]

### Areas for Improvement 🔧

#### Title & Hook

- Current title: "[title]"
- Score: [1-5]/5
- Issues: [specific problems]
- Suggestions: [3 alternative titles]

#### Structure

- Score: [1-5]/5
- Issues: [structural problems]
- Suggestions: [how to improve flow]

#### Engagement

- Score: [1-5]/5
- Issues: [engagement problems]
- Suggestions: [how to hook readers better]

#### Scannability

- Score: [1-5]/5
- Issues: [formatting issues]
- Suggestions: [headers, lists, bold usage]

#### SEO

- Current keywords: [identified keywords]
- Missing opportunities: [suggestions]
- Meta description: [current/suggested]

#### Technical Accuracy

- Score: [1-5]/5
- Issues: [any technical errors]

### Priority Improvements (Top 3)

1. [Most impactful change]
2. [Second priority]
3. [Third priority]

### Quick Wins (Easy fixes)

- [ ] [Simple improvement 1]
- [ ] [Simple improvement 2]
- [ ] [Simple improvement 3]
```

Ask the user which improvements they want to implement.

---

### Step 3: Implement Changes

Based on user's choice, make the improvements:

#### For Title Changes

```
Current: [old title]
New: [new title]

Reason: [why this is better]
```

#### For Content Restructuring

Show before/after for key sections.

#### For Adding Elements

- Add tip/warning boxes where helpful
- Add code examples with proper highlighting
- Add transitions between sections
- Add summary/takeaway boxes

#### For SEO Improvements

- Optimize meta description
- Add/adjust headers for keywords
- Improve internal linking suggestions

---

### Step 4: Final Review

After improvements:

```
## Improvements Made

✅ [Change 1]
✅ [Change 2]
✅ [Change 3]

### Before/After Comparison

**Engagement Score**: [X]/5 → [Y]/5
**Scannability Score**: [X]/5 → [Y]/5
**SEO Score**: [X]/5 → [Y]/5

### Additional Recommendations
- [Future improvements to consider]
- [Related posts to link]
```

---

## Improvement Checklist

### Title & Meta

- [ ] Title under 60 characters
- [ ] Title includes primary keyword
- [ ] Title promises clear value
- [ ] Description is compelling (150-160 chars)

### Opening

- [ ] Hook in first 3 sentences
- [ ] Problem/curiosity established
- [ ] Promise of value clear

### Structure

- [ ] Logical flow from section to section
- [ ] Each H2 could stand alone as mini-title
- [ ] Sections are 150-300 words each
- [ ] Transitions connect ideas

### Content

- [ ] Each section has actionable takeaway
- [ ] Real examples included
- [ ] Code has syntax highlighting
- [ ] Technical accuracy verified

### Formatting

- [ ] Paragraphs 2-4 lines max
- [ ] Lists for 3+ items
- [ ] Bold on key terms
- [ ] Admonitions for tips/warnings

### Engagement

- [ ] "You" language used
- [ ] Questions to reader included
- [ ] Relatable examples
- [ ] Clear CTA at end

### SEO

- [ ] Primary keyword in title, H1, first 100 words
- [ ] Secondary keywords naturally placed
- [ ] Internal links suggested
- [ ] External links to authoritative sources

---

## Common Issues & Fixes

### Issue: Weak Opening

**Fix**: Start with the reader's pain point or a bold statement. Remove any preamble.

### Issue: Wall of Text

**Fix**: Break into shorter paragraphs, add headers, use lists.

### Issue: No Clear Value

**Fix**: Add "What you'll learn" section or clearer promise in intro.

### Issue: Missing Examples

**Fix**: Add at least one concrete example per major concept.

### Issue: Abrupt Ending

**Fix**: Add summary, CTA, and closing thought or question.

### Issue: Generic Content

**Fix**: Add personal experience, unique angle, or specific data.

### Issue: Missing Personal Voice

**Fix**: Add Nathan's perspective — "I use...", "In my experience...", "What worked for me..."

### Issue: Wrong Platform Context

**Fix**: Nathan uses macOS (Mac mini M1 / MacBook Pro M4). Use `brew` for installations.
