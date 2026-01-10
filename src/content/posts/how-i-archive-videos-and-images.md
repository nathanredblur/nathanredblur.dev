---
title: How I Archive Videos and Images from Any Website
published: 2026-01-07
description: My personal toolkit for downloading courses, videos, and image galleries using yt-dlp and gallery-dl — including the browser cookie trick that finally made everything work.
tags: [Tools, CLI, Tutorial, Productivity]
category: Tutorials
draft: false
---

A friend and I split the cost of an expensive course on Hotmart. The problem? Only one of us could watch at a time. I needed a way to download the videos so we could both access them whenever we wanted.

After trying several methods (including wrestling with `ffmpeg` commands that never quite worked), I stumbled upon **yt-dlp** combined with a Chrome extension called **The Stream Detector**. This combo changed everything — not just for courses, but for archiving any video content I care about.

Later, when I started a house construction project and needed to download hundreds of inspiration images from Pinterest, I discovered **gallery-dl**. These two tools have become essential in my media archiving workflow.

## yt-dlp: The Video Download Swiss Army Knife

::github{repo="yt-dlp/yt-dlp"}

[yt-dlp](https://github.com/yt-dlp/yt-dlp) is a powerful command-line tool that can download videos from YouTube and over 1,000 other platforms. It's a fork of the original `youtube-dl` with more features and active maintenance.

I started using yt-dlp because `ffmpeg` commands were too complex and didn't always work. With yt-dlp, downloading is straightforward.

### Installation

On macOS, I recommend using Homebrew — it keeps everything updated automatically:

```bash
brew install yt-dlp
```

:::tip[Keep it Updated]
Using `brew` means you can run `brew upgrade yt-dlp` periodically to get the latest version. This is important because streaming sites change frequently, and yt-dlp updates to match.
:::

For other platforms:

```bash
# Using pip
pip install -U yt-dlp

# Windows: Download from releases
# https://github.com/yt-dlp/yt-dlp/releases
```

### Basic Usage

Download a YouTube video:

```bash
yt-dlp https://www.youtube.com/watch?v=VIDEO_ID
```

Download best quality:

```bash
yt-dlp -f bestvideo+bestaudio https://www.youtube.com/watch?v=VIDEO_ID
```

Extract audio only (great for music or podcasts):

```bash
yt-dlp -x --audio-format mp3 https://www.youtube.com/watch?v=VIDEO_ID
```

## The Stream Detector: My Secret Weapon

Here's where it gets interesting. For platforms like Hotmart (or any course platform), you can't just paste the URL into yt-dlp. The video streams are hidden behind authentication and dynamic URLs.

**The Stream Detector** is a browser extension that detects media streams on any webpage and generates ready-to-use download commands.

- [Chrome Extension](https://chromewebstore.google.com/detail/the-stream-detector/iakkmkmhhckcmoiibcfjnooibphlobak)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/hls-stream-detector/)

:::tip[Firefox Has More Options]
The Firefox version of The Stream Detector has more features. If you're serious about downloading streams, consider using a Firefox-based browser like [Zen Browser](https://zen-browser.app/).
:::

### My Workflow for Downloading Courses

Here's exactly how I download course videos from platforms like Hotmart:

1. **Open the course** in your browser (make sure you're logged in)
2. **Start playing the video** you want to download
3. **Click The Stream Detector icon** — it will show detected streams
4. **Look for the highest quality option** (usually the one with the largest resolution)
5. **Copy the generated command** and paste it in your terminal

The extension generates something like:

```bash
yt-dlp "https://streaming-platform.com/video.m3u8"
```

You can add options for better organization:

```bash
yt-dlp -o "~/Videos/Course/%(title)s.%(ext)s" "https://streaming-platform.com/video.m3u8"
```

### The Tedious Part (Being Honest)

I won't lie — downloading an entire course is tedious. You have to:

1. Open each video one by one
2. Wait for the stream to be detected
3. Copy and run the command
4. Potentially rename files to keep them in order

There's no magic "download all" button. But for an expensive course you want to keep forever, it's worth the effort.

:::note[Pro Tip]
I usually rename files with a number prefix like `01-introduction.mp4`, `02-getting-started.mp4` to keep them organized for later viewing.
:::

## gallery-dl: For Image Galleries and Collections

::github{repo="mikf/gallery-dl"}

[gallery-dl](https://github.com/mikf/gallery-dl) downloads image galleries from over 300 websites including Pinterest, Instagram, DeviantArt, Twitter, and many more.

I discovered this tool while working on a house construction project. I had a massive Pinterest board with hundreds (maybe thousands) of inspiration images — kitchen designs, floor plans, furniture ideas. I needed to download them all to review offline and create a mood board.

### Installation

Again, Homebrew is my go-to:

```bash
brew install gallery-dl
```

Or with pip:

```bash
pip install -U gallery-dl
```

### The Cookie Trick (This Was My "Aha" Moment)

When I first tried gallery-dl with Pinterest, it barely worked. It only downloaded a few images, and they were all low resolution. Frustrating.

The solution? **Use your browser's cookies.**

```bash
gallery-dl --cookies-from-browser chrome https://www.pinterest.com/username/board-name/
```

:::important[This Changes Everything]
The `--cookies-from-browser` option lets gallery-dl use your logged-in browser session. This means:

- Access to your private boards
- Full resolution images
- No rate limiting issues
- Access to age-restricted content
  :::

After enabling cookies, gallery-dl downloaded everything in full quality. Game changer.

### Supported Browsers

```bash
# Use cookies from different browsers
gallery-dl --cookies-from-browser chrome URL
gallery-dl --cookies-from-browser firefox URL
gallery-dl --cookies-from-browser safari URL
gallery-dl --cookies-from-browser brave URL
```

### My Pinterest Workflow

Here's how I downloaded my house inspiration board:

```bash
gallery-dl --cookies-from-browser chrome \
  -D ~/Pictures/House-Project \
  https://www.pinterest.com/myusername/house-ideas/
```

After downloading, I went through the images manually, deleted the ones that didn't fit my vision, and kept the best ones for my mood board. It saved me hours compared to saving images one by one.

### A Trip Down Memory Lane

Using gallery-dl reminded me of my university days. Back then, I was obsessed with collecting images — anime wallpapers, character art, references for drawing. I had entire CDs filled with collections.

My "downloading tools" back then were primitive: either saving images one by one, or using sketchy scrapers that would crawl pages and download files based on extension or file size. gallery-dl is the modern, reliable version of what I wished I had back then.

## Using yt-dlp with Browser Cookies Too

The cookie trick works for yt-dlp as well. This is useful for:

- Age-restricted YouTube videos
- Members-only content
- Subscription-based platforms

```bash
yt-dlp --cookies-from-browser chrome https://www.youtube.com/watch?v=VIDEO_ID
```

## Configuration Files (Optional)

Both tools support configuration files if you want persistent settings. I don't use them personally — this post serves as my reference — but here's how they work:

### yt-dlp Configuration

Create `~/.config/yt-dlp/config`:

```
# Default output template
-o ~/Videos/%(uploader)s/%(title)s.%(ext)s

# Always use best quality
-f bestvideo+bestaudio

# Use Chrome cookies by default
--cookies-from-browser chrome
```

### gallery-dl Configuration

Create `~/.config/gallery-dl/config.json`:

```json
{
  "extractor": {
    "base-directory": "~/Downloads/gallery-dl",
    "cookies-from-browser": "chrome"
  }
}
```

## Tips I've Learned Along the Way

### 1. Keep Tools Updated

```bash
brew upgrade yt-dlp gallery-dl
```

Streaming sites change constantly. Updated tools = fewer errors.

### 2. When Stuck, Ask AI

Both tools have extensive documentation, but it can be overwhelming. What works for me: **copy the README into an AI chat and ask how to do something specific**.

For example: "I have the gallery-dl README. How do I download only images larger than 1MB?"

### 3. Firefox/Zen for More Options

The Stream Detector has more features on Firefox. If you're doing this regularly, consider using [Zen Browser](https://zen-browser.app/) or Firefox for your downloading sessions.

### 4. Respect the Content

I use these tools to:

- Archive courses I've legitimately purchased
- Download my own content and collections
- Save things I'm afraid might disappear

Always respect copyright and terms of service.

## Quick Reference

### yt-dlp Commands

```bash
# Basic download
yt-dlp URL

# Best quality
yt-dlp -f bestvideo+bestaudio URL

# Audio only
yt-dlp -x --audio-format mp3 URL

# With cookies
yt-dlp --cookies-from-browser chrome URL

# Custom output path
yt-dlp -o "~/Videos/%(title)s.%(ext)s" URL
```

### gallery-dl Commands

```bash
# Basic download
gallery-dl URL

# With browser cookies (recommended)
gallery-dl --cookies-from-browser chrome URL

# Custom output directory
gallery-dl -D ~/Pictures/MyDownloads URL

# With metadata
gallery-dl --write-metadata --cookies-from-browser chrome URL
```

## Troubleshooting

**"Unable to extract" errors**: Update the tool (`brew upgrade yt-dlp`)

**Low resolution or few images**: Use `--cookies-from-browser`

**403 Forbidden errors**: Try adding cookies or updating the tool

**Slow downloads**: Normal for some sites. Be patient.

## Conclusion

These two tools have saved me countless hours:

- **yt-dlp + The Stream Detector**: For archiving courses and videos from any platform
- **gallery-dl + browser cookies**: For downloading image collections in full quality

The key insight that took me a while to figure out: **always use browser cookies**. It solves most authentication and quality issues.

Whether you're archiving educational content you've paid for, saving inspiration for a project, or just building a personal media library, these tools get the job done.

## Resources

- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [gallery-dl GitHub](https://github.com/mikf/gallery-dl)
- [The Stream Detector (Chrome)](https://chromewebstore.google.com/detail/the-stream-detector/iakkmkmhhckcmoiibcfjnooibphlobak)
- [The Stream Detector (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/hls-stream-detector/)
- [Zen Browser](https://zen-browser.app/)
