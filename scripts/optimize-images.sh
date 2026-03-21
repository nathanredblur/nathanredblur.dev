#!/usr/bin/env bash
set -euo pipefail

# Optimize images in src/content/ while keeping their original format.
# Requires: imagemagick (brew install imagemagick)
#
# Usage: pnpm optimize-images [--dry-run] [--max-width 1600] [--quality 85]

CONTENT_DIR="$(cd "$(dirname "$0")/.." && pwd)/src/content"
MAX_WIDTH=1600
QUALITY=85
DRY_RUN=false

while [[ $# -gt 0 ]]; do
	case "$1" in
		--dry-run) DRY_RUN=true; shift ;;
		--max-width) MAX_WIDTH="$2"; shift 2 ;;
		--quality) QUALITY="$2"; shift 2 ;;
		*) echo "Unknown option: $1"; exit 1 ;;
	esac
done

if ! command -v magick &>/dev/null; then
	echo "Error: imagemagick is required. Install with: brew install imagemagick"
	exit 1
fi

total_before=0
total_after=0
files_optimized=0

human_size() {
	local bytes=$1
	if [[ $bytes -ge 1048576 ]]; then
		echo "$(( bytes / 1048576 )).$(( bytes % 1048576 * 10 / 1048576 ))MB"
	elif [[ $bytes -ge 1024 ]]; then
		echo "$(( bytes / 1024 ))KB"
	else
		echo "${bytes}B"
	fi
}

optimize_image() {
	local file="$1"
	local ext="${file##*.}"
	ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

	local size_before
	size_before=$(stat -f%z "$file")

	local width
	width=$(magick identify -format "%w" "$file[0]")

	local resize_flag=""
	if [[ "$width" -gt "$MAX_WIDTH" ]]; then
		resize_flag="-resize ${MAX_WIDTH}x"
	fi

	local format_opts=""
	case "$ext" in
		png)
			format_opts="-strip -define png:compression-level=9 -define png:compression-filter=5 -define png:compression-strategy=1"
			;;
		jpg|jpeg)
			format_opts="-strip -quality ${QUALITY} -sampling-factor 4:2:0 -interlace JPEG"
			;;
		webp)
			format_opts="-quality ${QUALITY}"
			;;
		gif)
			format_opts="-layers optimize"
			if [[ -n "$resize_flag" ]]; then
				resize_flag="-coalesce $resize_flag"
			fi
			;;
		*)
			return
			;;
	esac

	if $DRY_RUN; then
		local would_resize=""
		if [[ -n "$resize_flag" ]]; then
			would_resize=" (resize ${width}→${MAX_WIDTH}px)"
		fi
		echo "[dry-run] $(basename "$file") — $(human_size "$size_before")${would_resize}"
		return
	fi

	local tmp="/tmp/optimize-img-$$.${ext}"

	# shellcheck disable=SC2086
	magick "$file" $resize_flag $format_opts "$tmp"

	local size_after
	size_after=$(stat -f%z "$tmp")

	if [[ "$size_after" -lt "$size_before" ]]; then
		command cp "$tmp" "$file"
		local saved=$((size_before - size_after))
		local pct=$((saved * 100 / size_before))
		echo "✓ $(basename "$file") — $(human_size "$size_before") → $(human_size "$size_after") (-${pct}%)"
		total_before=$((total_before + size_before))
		total_after=$((total_after + size_after))
		files_optimized=$((files_optimized + 1))
	else
		echo "· $(basename "$file") — already optimal"
	fi

	rm -f "$tmp"
}

echo "Scanning ${CONTENT_DIR} for images..."
echo "Max width: ${MAX_WIDTH}px | Quality: ${QUALITY}"
echo ""

while IFS= read -r -d '' file; do
	optimize_image "$file"
done < <(find "$CONTENT_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.gif" \) -print0 | sort -z)

echo ""
if [[ "$files_optimized" -gt 0 ]]; then
	total_saved=$((total_before - total_after))
	echo "Done: ${files_optimized} files optimized, $(human_size "$total_saved") saved"
else
	echo "Done: no files needed optimization"
fi
