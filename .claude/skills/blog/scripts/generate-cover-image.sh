#!/usr/bin/env bash
set -euo pipefail

# Generate a blog cover image with the Gemini image API and save it to disk.
#
# The visual style lives in references/image-style-system-prompt.md (sent as the
# system instruction). The --prompt argument describes ONLY the article — the
# same article-only prompt produced by references/image-prompts.md.
#
# Usage:
#   GEMINI_API_KEY=... generate-cover-image.sh \
#     --prompt "Article: ...; Key elements: ..." \
#     --output src/content/posts/<slug>/cover.png
#
# Options:
#   --prompt   TEXT   Article-only description (required)
#   --output   PATH   Where to write the image (required)
#   --system   PATH   System-prompt file (default: references/image-style-system-prompt.md)
#   --model    NAME   Model id (default: models/gemini-3.1-flash-lite-image)
#   --aspect   RATIO  Aspect ratio (default: 16:9)
#   --size     SIZE   Image size (default: 1K)

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SYSTEM_FILE="${SKILL_DIR}/references/image-style-system-prompt.md"
MODEL="models/gemini-3.1-flash-lite-image"
ASPECT="16:9"
SIZE="1K"
PROMPT=""
OUTPUT=""

while [[ $# -gt 0 ]]; do
	case "$1" in
		--prompt) PROMPT="$2"; shift 2 ;;
		--output) OUTPUT="$2"; shift 2 ;;
		--system) SYSTEM_FILE="$2"; shift 2 ;;
		--model) MODEL="$2"; shift 2 ;;
		--aspect) ASPECT="$2"; shift 2 ;;
		--size) SIZE="$2"; shift 2 ;;
		*) echo "Error: unknown option: $1" >&2; exit 1 ;;
	esac
done

for cmd in curl jq base64; do
	command -v "$cmd" &>/dev/null || { echo "Error: '$cmd' is required." >&2; exit 1; }
done

[[ -n "${GEMINI_API_KEY:-}" ]] || { echo "Error: GEMINI_API_KEY is not set." >&2; exit 1; }
[[ -n "$PROMPT" ]] || { echo "Error: --prompt is required." >&2; exit 1; }
[[ -n "$OUTPUT" ]] || { echo "Error: --output is required." >&2; exit 1; }
[[ -f "$SYSTEM_FILE" ]] || { echo "Error: system-prompt file not found: $SYSTEM_FILE" >&2; exit 1; }

SYSTEM_PROMPT="$(cat "$SYSTEM_FILE")"

request="$(jq -n \
	--arg model "$MODEL" \
	--arg input "$PROMPT" \
	--arg system "$SYSTEM_PROMPT" \
	--arg aspect "$ASPECT" \
	--arg size "$SIZE" \
	'{
		model: $model,
		input: $input,
		system_instruction: $system,
		generation_config: {
			temperature: 1,
			max_output_tokens: 65536,
			top_p: 0.95,
			thinking_level: "high",
			image_config: { aspect_ratio: $aspect, image_size: $size }
		},
		response_modalities: ["image"]
	}')"

response="$(curl -sS -X POST \
	-H "Content-Type: application/json" \
	"https://generativelanguage.googleapis.com/v1beta/interactions?key=${GEMINI_API_KEY}" \
	-d "$request")"

api_error="$(printf '%s' "$response" | jq -r '.error.message // empty')"
if [[ -n "$api_error" ]]; then
	echo "Error: Gemini API returned an error: $api_error" >&2
	exit 1
fi

image_data="$(printf '%s' "$response" | jq -r 'first(.steps[]?.content[]? | select(.type == "image") | .data) // empty')"
if [[ -z "$image_data" ]]; then
	echo "Error: no image found in the API response. Raw response (truncated):" >&2
	printf '%s' "$response" | head -c 2000 >&2
	echo >&2
	exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"
printf '%s' "$image_data" | base64 --decode >"$OUTPUT"

echo "✓ Cover image saved to $OUTPUT ($(command wc -c <"$OUTPUT" | tr -d ' ') bytes)"
