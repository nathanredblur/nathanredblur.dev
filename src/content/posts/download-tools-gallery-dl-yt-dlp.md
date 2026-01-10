---
title: Master Media Downloads with gallery-dl and yt-dlp
published: 2026-01-07
description: A comprehensive guide to downloading media from any website using gallery-dl and yt-dlp, including advanced techniques with browser cookies and automation tools.
tags: [Tools, CLI, Tutorial, Productivity]
category: Tutorials
draft: false
---

# Master Media Downloads with gallery-dl and yt-dlp

In the world of content archiving and media management, two powerful command-line tools stand out: **gallery-dl** and **yt-dlp**. Whether you're downloading images from galleries, videos from streaming platforms, or content from social media, these tools have you covered.

## What Are These Tools?

### gallery-dl

[gallery-dl](https://github.com/mikf/gallery-dl) is a command-line program to download image galleries and collections from various image hosting sites. It supports over 300 websites including Pinterest, Instagram, DeviantArt, Twitter, and many more.

### yt-dlp

[yt-dlp](https://github.com/yt-dlp/yt-dlp) is a feature-rich fork of youtube-dl with additional features and fixes. It can download videos from YouTube and over 1000 other video platforms, including Twitch, Vimeo, TikTok, and streaming services.

## Installation

### Installing gallery-dl

**Using pip (recommended):**
```bash
pip install -U gallery-dl
```

**Using Homebrew (macOS/Linux):**
```bash
brew install gallery-dl
```

**Windows:**
Download the standalone executable from the [releases page](https://github.com/mikf/gallery-dl/releases).

### Installing yt-dlp

**Using pip:**
```bash
pip install -U yt-dlp
```

**Using Homebrew (macOS/Linux):**
```bash
brew install yt-dlp
```

**Windows:**
Download the executable from the [releases page](https://github.com/yt-dlp/yt-dlp/releases).

## Basic Usage

### gallery-dl: Downloading Image Galleries

**Download from a URL:**
```bash
gallery-dl https://www.pinterest.com/pin/123456789/
```

**Download an entire board:**
```bash
gallery-dl https://www.pinterest.com/username/board-name/
```

**Specify output directory:**
```bash
gallery-dl -D ~/Downloads/images https://example.com/gallery
```

### yt-dlp: Downloading Videos

**Download a video:**
```bash
yt-dlp https://www.youtube.com/watch?v=VIDEO_ID
```

**Download best quality:**
```bash
yt-dlp -f bestvideo+bestaudio https://www.youtube.com/watch?v=VIDEO_ID
```

**Download playlist:**
```bash
yt-dlp https://www.youtube.com/playlist?list=PLAYLIST_ID
```

**Extract audio only:**
```bash
yt-dlp -x --audio-format mp3 https://www.youtube.com/watch?v=VIDEO_ID
```

## Advanced Features: Using Browser Cookies

One of the most powerful features of both tools is the ability to use your browser's cookies. This is essential when downloading content that requires authentication or when dealing with sites that block automated downloads.

### Why Use Browser Cookies?

- **Access private content**: Download from your own private boards, playlists, or subscriptions
- **Bypass restrictions**: Some sites only allow downloads for logged-in users
- **Avoid rate limiting**: Authenticated requests are often treated more favorably
- **Access region-locked content**: Use your authenticated session to access content

### Using Cookies with gallery-dl

The `--cookies-from-browser` option allows gallery-dl to use cookies from your browser session:

```bash
gallery-dl --cookies-from-browser chrome https://co.pinterest.com/nathanredblur/home-ideas/
```

**Supported browsers:**
- `chrome` - Google Chrome
- `firefox` - Mozilla Firefox
- `edge` - Microsoft Edge
- `safari` - Safari (macOS)
- `opera` - Opera
- `brave` - Brave Browser

**Example: Download private Pinterest board:**
```bash
# Make sure you're logged into Pinterest in Chrome first
gallery-dl --cookies-from-browser chrome https://www.pinterest.com/your-username/private-board/
```

### Using Cookies with yt-dlp

Similarly, yt-dlp can use browser cookies for authenticated downloads:

```bash
yt-dlp --cookies-from-browser chrome https://www.youtube.com/watch?v=VIDEO_ID
```

**Example: Download age-restricted or members-only content:**
```bash
# Log into YouTube in your browser first
yt-dlp --cookies-from-browser firefox https://www.youtube.com/watch?v=RESTRICTED_VIDEO
```

**Example: Download from streaming services:**
```bash
yt-dlp --cookies-from-browser chrome https://www.twitch.tv/videos/123456789
```

## Browser Integration: The Stream Detector Extension

For YouTube and streaming platforms, manually copying URLs can be tedious. The **Stream Detector** Chrome extension makes this process much easier.

### The Stream Detector

[The Stream Detector](https://chromewebstore.google.com/detail/the-stream-detector/iakkmkmhhckcmoiibcfjnooibphlobak) is a Chrome extension that automatically detects media streams on web pages and generates the necessary download commands for you.

**Features:**
- Automatically detects video and audio streams
- Generates ready-to-use yt-dlp commands
- Supports multiple streaming protocols (HLS, DASH, etc.)
- One-click copy to clipboard
- Works with most streaming sites

**How to use:**
1. Install the extension from the Chrome Web Store
2. Navigate to a video or stream
3. Click the extension icon
4. Copy the generated yt-dlp command
5. Paste and run in your terminal

**Example workflow:**
```bash
# Extension detects stream and generates:
yt-dlp -f bestvideo+bestaudio "https://streaming-site.com/video.m3u8"

# You can then add your own options:
yt-dlp -f bestvideo+bestaudio --cookies-from-browser chrome \
  -o "~/Videos/%(title)s.%(ext)s" \
  "https://streaming-site.com/video.m3u8"
```

## Practical Examples

### Example 1: Archive Your Pinterest Boards

```bash
# Download all images from your board with metadata
gallery-dl --cookies-from-browser chrome \
  --write-metadata \
  -D ~/Pictures/Pinterest \
  https://www.pinterest.com/your-username/your-board/
```

### Example 2: Download YouTube Playlist with Subtitles

```bash
# Download entire playlist with subtitles in best quality
yt-dlp --cookies-from-browser chrome \
  --write-subs \
  --sub-lang en \
  -f bestvideo+bestaudio \
  -o "~/Videos/%(playlist)s/%(title)s.%(ext)s" \
  https://www.youtube.com/playlist?list=PLAYLIST_ID
```

### Example 3: Download Instagram Profile (Private)

```bash
# Download all posts from a private account you follow
gallery-dl --cookies-from-browser firefox \
  -D ~/Pictures/Instagram \
  https://www.instagram.com/username/
```

### Example 4: Download Twitch VOD

```bash
# Download a Twitch VOD with chat replay
yt-dlp --cookies-from-browser chrome \
  --write-subs \
  -f best \
  https://www.twitch.tv/videos/123456789
```

## Configuration Files

Both tools support configuration files for persistent settings.

### gallery-dl configuration

Create `~/.config/gallery-dl/config.json`:

```json
{
  "extractor": {
    "base-directory": "~/Downloads/gallery-dl",
    "cookies-from-browser": "chrome"
  }
}
```

### yt-dlp configuration

Create `~/.config/yt-dlp/config`:

```
# Default output template
-o ~/Videos/%(uploader)s/%(title)s.%(ext)s

# Always use best quality
-f bestvideo+bestaudio

# Use Chrome cookies by default
--cookies-from-browser chrome

# Write metadata
--write-info-json
--write-thumbnail
```

## Tips and Best Practices

1. **Always respect copyright**: Only download content you have the right to access
2. **Use rate limiting**: Add `--sleep-interval 5` to avoid overwhelming servers
3. **Keep tools updated**: Both projects are actively maintained with frequent updates
4. **Check supported sites**: Use `gallery-dl --list-extractors` and `yt-dlp --list-extractors`
5. **Read the documentation**: Both tools have extensive documentation with many more options

## Troubleshooting

### Common Issues

**"Unable to extract data" error:**
- Update the tool: `pip install -U gallery-dl` or `pip install -U yt-dlp`
- Try using browser cookies: `--cookies-from-browser chrome`

**"HTTP Error 403: Forbidden":**
- Use browser cookies to authenticate
- Add a user-agent: `--user-agent "Mozilla/5.0..."`

**Downloads are slow:**
- Use `--concurrent-fragments 4` for yt-dlp
- Check your internet connection
- Some sites have rate limits

## Conclusion

gallery-dl and yt-dlp are incredibly powerful tools for media archiving and content management. By leveraging browser cookies and extensions like The Stream Detector, you can download virtually any content from the web efficiently and reliably.

The combination of these tools provides a complete solution for:
- Archiving your social media content
- Building offline video libraries
- Preserving educational content
- Managing media collections

Start with the basic commands, experiment with the cookie authentication feature, and gradually explore the advanced options to build your perfect download workflow.

## Resources

- [gallery-dl GitHub](https://github.com/mikf/gallery-dl)
- [gallery-dl Documentation](https://github.com/mikf/gallery-dl/blob/master/docs/configuration.rst)
- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp#readme)
- [The Stream Detector Extension](https://chromewebstore.google.com/detail/the-stream-detector/iakkmkmhhckcmoiibcfjnooibphlobak)

Happy downloading! 🚀
