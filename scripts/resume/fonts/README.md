# Fonts

- **Roboto-Regular.ttf / Roboto-Bold.ttf / Roboto-Italic.ttf** — Roboto font family, licensed under the Apache License 2.0. Downloaded from <https://github.com/googlefonts/roboto-classic> (upstream of Google Fonts).

These TTF files are required at runtime by `@react-pdf/renderer` because pdfkit (its underlying PDF engine) cannot load the `.woff`/`.woff2` format shipped by `@fontsource/roboto`.

The ATS-Friendly template uses the built-in Helvetica font and does not require any file from this directory.
