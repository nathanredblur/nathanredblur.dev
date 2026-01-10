---
description: Generate blog post ideas based on a topic, technology, or theme
---

# Generate Blog Post Ideas

You are helping **Nathan (Jonathan Rico)** brainstorm blog post ideas for his personal tech blog.

**IMPORTANT**:

- Follow the blog writing guidelines in `.cursor/rules/blog-posts.mdc`
- Read `src/content/spec/about.md` to understand Nathan's expertise and interests
- Suggest topics that align with his experience: React, frontend dev, productivity, macOS
- Consider his interests: anime, Y2K aesthetics, indie games, music, experimentation

User input:

$ARGUMENTS

---

## Execution Flow

### Step 1: Understand the Direction

If `$ARGUMENTS` is empty or vague, ask:

```
Let me help you brainstorm blog post ideas! First, tell me:

1. **Topic Area**: What general area interests you?
   (e.g., React, DevOps, productivity, a specific tool)

2. **Your Expertise**: What do you know well that others struggle with?

3. **Recent Learnings**: What have you figured out recently that
   took you a while to understand?

4. **Pain Points**: What problems do you keep solving for yourself
   or others?

5. **Content Gap**: What do you wish existed when you were learning?
```

---

### Step 2: Generate Ideas

Based on the input, generate ideas using these frameworks:

```markdown
## Blog Post Ideas: [Topic Area]

### 🎯 Tutorial Ideas (How-To)

Step-by-step guides that solve specific problems.

1. **[Title]**
   - Angle: [unique approach]
   - Target: [audience level]
   - Estimated length: [reading time]

2. **[Title]**
   - Angle: [unique approach]
   - Target: [audience level]
   - Estimated length: [reading time]

3. **[Title]**
   - Angle: [unique approach]
   - Target: [audience level]
   - Estimated length: [reading time]

### 💡 Concept Explainers

Make complex topics accessible.

4. **[Title]**
   - Angle: [unique approach]
   - Target: [audience level]
   - Why it works: [appeal factor]

5. **[Title]**
   - Angle: [unique approach]
   - Target: [audience level]
   - Why it works: [appeal factor]

### ⚔️ Comparison/Opinion Posts

Help readers make decisions.

6. **[Title]**
   - Angle: [unique approach]
   - Controversy level: [low/medium/high]
   - Why it works: [appeal factor]

7. **[Title]**
   - Angle: [unique approach]
   - Controversy level: [low/medium/high]
   - Why it works: [appeal factor]

### 🔧 Tool/Resource Posts

Share useful tools and workflows.

8. **[Title]**
   - Angle: [unique approach]
   - Personal experience: [what you'd share]
   - Why it works: [appeal factor]

### 📚 List/Roundup Posts

Curated collections of value.

9. **[Title]**
   - Angle: [unique approach]
   - Value prop: [what reader gains]

10. **[Title]**
    - Angle: [unique approach]
    - Value prop: [what reader gains]

---

## Top 3 Recommendations

Based on your expertise and audience, I recommend starting with:

### 1. [Title] ⭐ Best First Post

**Why**: [reasoning]
**Effort**: [low/medium/high]
**Potential impact**: [reasoning]

### 2. [Title]

**Why**: [reasoning]
**Effort**: [low/medium/high]
**Potential impact**: [reasoning]

### 3. [Title]

**Why**: [reasoning]
**Effort**: [low/medium/high]
**Potential impact**: [reasoning]
```

---

### Step 3: Develop Selected Idea

When user picks an idea:

```
Great choice! Let me help you develop "[Title]" further.

Would you like me to:
A) Create a detailed outline for this post
B) Generate more title variations
C) Identify the key sections and examples needed
D) Start writing the post directly

Or use the `/blog.create` command with this idea!
```

---

## Idea Generation Frameworks

### The Problem-Solution Framework

1. What problem did you recently solve?
2. What was hard about it?
3. What do you wish you knew earlier?
4. → Write: "How to [solve problem] without [common pain]"

### The Comparison Framework

1. What tools/approaches have you tried?
2. What did you learn about the tradeoffs?
3. When would you use each?
4. → Write: "[Option A] vs [Option B]: When to Use Each"

### The Myth-Busting Framework

1. What do people commonly get wrong?
2. What's the actual truth?
3. What's the evidence?
4. → Write: "Why [Common Belief] is Wrong (And What to Do Instead)"

### The Journey Framework

1. Where did you start?
2. What mistakes did you make?
3. Where are you now?
4. → Write: "How I Went From [Start] to [End]: Lessons Learned"

### The Toolkit Framework

1. What tools do you use daily?
2. What makes them special?
3. How do they work together?
4. → Write: "My [X] Toolkit: [N] Tools I Can't Live Without"

### The Deep Dive Framework

1. What topic seems simple but isn't?
2. What are the hidden complexities?
3. What do experts know that beginners don't?
4. → Write: "[Topic]: Everything You Need to Know"

---

## Evergreen Topic Categories

### Developer Productivity

- Workflow optimization
- Tool configurations
- Automation scripts
- Time management

### Technical Deep Dives

- How X works under the hood
- Performance optimization
- Security practices
- Architecture decisions

### Career & Growth

- Learning strategies
- Interview prep
- Team collaboration
- Open source contribution

### Project Showcases

- Build logs
- Side project breakdowns
- Tech stack decisions
- Lessons learned

---

## Nathan's Unique Topic Areas

Based on his expertise and interests, consider these angles:

### macOS & Productivity

- Mac setup and workflows
- CLI tools and automation
- App discoveries and recommendations

### Frontend Architecture

- React patterns from 15+ years experience
- Next.js real-world lessons
- TypeScript tips and gotchas
- Design system experiences

### Aesthetic & Culture

- Y2K / retro-futuristic design in web
- Anime-inspired UI/UX
- Indie game design principles applied to web

### Experimentation

- "I tried X for a week" posts
- New tool first impressions
- Hardware experiments
- Side project learnings

---

## Title Formulas for Ideas

**Numbers**: "5 Ways to...", "10 Tools for...", "3 Mistakes..."
**How-to**: "How to X Without Y", "How to X in Y Minutes"
**Why**: "Why X Matters", "Why I Switched from X to Y"
**Ultimate**: "The Complete Guide to X", "Everything About X"
**Problem**: "Stop Doing X", "X is Broken, Here's the Fix"
**Personal**: "How I X", "What I Learned From X"
