English | [中文](README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](README_de.md)

# AvDict 🎬

> A command-line tool to look up JAV metadata by title ID — cast, release date, studio, and more

[![npm version](https://img.shields.io/badge/version-1.2.1-blue.svg)](https://github.com/gdjdkid/AvDict)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)]()

Type a title ID, get back the full details — cast, release date, studio, duration, tags, and more. Multiple data sources are queried automatically with no manual switching required.

![JavDict-Demo](https://raw.githubusercontent.com/gdjdkid/AvDict/master/Javdict-Demo.gif)

---

## Features

- 🔍 **Multi-source fallback** — Queries JAVBUS → NJAV → JavLibrary → JAVDB in order; returns on first hit
- 📋 **Rich metadata** — Cast, release date, duration, studio, label, director, series, tags, cover image, rating
- 💾 **Local cache** — Results cached for 7 days to reduce repeat requests
- 🖥️ **Cross-platform** — Linux, Windows, and macOS supported
- 🎨 **Color output** — Terminal-formatted display with field-level color coding
- ⚡ **Fast lookups** — Direct URL construction by title ID; no login required for most sources

---

## Requirements

- Node.js >= 18.0.0
- npm >= 6.0.0
- curl (built into Linux/macOS; ensure it's available in your Git Bash environment on Windows)

---

## Platform Support

| Platform | JAVBUS | NJAV | JavLibrary | JAVDB |
|----------|--------|------|------------|-------|
| Linux / macOS | ✅ | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ❌ |

> JAVDB is unavailable on Windows due to Cloudflare TLS fingerprint restrictions. The other three sources work fully on Windows.

---

## Installation

**Option 1: Install via npm (recommended)**
```bash
npm install -g javdict
```

**Option 2: Clone from GitHub (for developers)**
```bash
git clone https://github.com/gdjdkid/AvDict.git
cd AvDict
npm install
npm install -g .
```

**Verify the installation:**

```bash
jav -v
```

## Updating

**Option 1: Update via npm (recommended)**
```bash
sudo npm install -g javdict@latest
```

**Option 2: Update from GitHub (for developers)**
```bash
cd AvDict
git pull
sudo npm install -g .
```

---

## Usage

**Look up a title ID:**

```bash
jav SSIS-001
jav ABF-331
jav JUR-067
```

**Query with specific language output:**
```bash
jav --lang en SSIS-001   # English
jav --lang zh SSIS-001   # 中文
jav --lang jp SSIS-001   # 日本語
jav --lang kr SSIS-001   # 한국어
jav --lang de SSIS-001   # Deutsch
jav -l en SSIS-001       # shorthand
```

**Output raw JSON:**

```bash
jav -r SSIS-001
```

**Clear local cache:**

```bash
jav --clear-cache
```

**Configure JAVDB Cookie (optional):**

```bash
jav --setup
```

**Show help:**

```bash
jav -h
```

---

## CLI Options

```
Usage: jav [options] [id]

Arguments:
  id                    Title ID to look up, e.g. SSIS-001

Options:
  -v, --version         Print version number
  -l, --lang <lang>     Output language: zh/en/jp/kr/de (default: zh)
  -r, --raw             Output raw JSON instead of formatted display
  --setup               Configure JAVDB Cookie (optional, improves coverage)
  --clear-cache         Clear local result cache
  -h, --help            Show help
```

---

## Configuration

### JAVDB Cookie (optional)

The tool works without any configuration. Adding a JAVDB Cookie improves coverage for niche titles that only exist in JAVDB's database. This only takes effect on Linux/macOS.

**How to get your Cookie:**

1. Open [https://javdb.com](https://javdb.com) in Chrome and sign in
2. Install the Chrome extension [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
3. Click the extension icon on the JAVDB page and export your cookies
4. Find the `_jdb_session` row and copy the value in the last column
5. Run the setup command and paste it in:

```bash
jav --setup
```

Your Cookie is saved locally at `~/.config/javinfo/config.json` and never sent anywhere.

**Cookies typically expire in about 2 weeks.** When niche titles start returning "not found", just run `jav --setup` again to refresh.

---

## Caching

Query results are automatically cached to `~/.config/javinfo/cache.json` with a 7-day TTL. This speeds up repeat lookups and reduces load on the source sites.

To force a fresh fetch:

```bash
jav --clear-cache
```

---

## FAQ

**Q: I get "title not found" — what's wrong?**

A: There are three likely causes:
1. The title isn't indexed by any of the four sources (extremely niche content)
2. Your JAVDB Cookie has expired — run `jav --setup` to refresh it
3. Your network can't reach the source sites — check your proxy settings

**Q: Some titles don't show up on Windows?**

A: JAVDB is unavailable on Windows due to Cloudflare restrictions. A small number of titles that only exist in JAVDB can't be found on Windows. For full coverage, use a Linux environment (e.g. a Raspberry Pi).

**Q: I get `Permission denied` when installing?**

A: Global installation requires elevated permissions:
```bash
sudo npm install -g .
```

**Q: How often do I need to update my Cookie?**

A: Roughly every 2 weeks. If niche titles that previously worked start returning "not found", your Cookie has likely expired — run `jav --setup` to update it.

**Q: Does it support FC2 amateur titles?**

A: Yes. Enter the title in hyphen format, e.g. `031926-100`. The tool auto-detects FC2 format and handles the conversion internally.

**Q: Does it work in mainland China?**

A: All data sources are hosted outside mainland China and require a proxy to access. If queries consistently fail, run the following commands to check your network connectivity:
```bash
curl -sL --connect-timeout 5 "https://www.javbus.com" -o /dev/null -w "JAVBUS: %{http_code}\n"
curl -sL --connect-timeout 5 "https://www.njav.com" -o /dev/null -w "NJAV: %{http_code}\n"
curl -sL --connect-timeout 5 "https://www.google.com" -o /dev/null -w "Google: %{http_code}\n"
```

A response of `200` means the site is reachable. A response of `000` means the connection failed — check your proxy settings.

---

## Data Sources

| Source | Website | Notes |
|--------|---------|-------|
| JAVBUS | [javbus.com](https://www.javbus.com) | Fast, broad coverage |
| NJAV | [njav.com](https://www.njav.com) | High coverage, no Cookie needed |
| JavLibrary | [javlibrary.com](https://www.javlibrary.com) | Detailed metadata, includes ratings |
| JAVDB | [javdb.com](https://javdb.com) | Most comprehensive, requires Cookie |

---

## License

This project is open source under the [MIT License](LICENSE). You're free to use, modify, and distribute it.

---

## Contributing

PRs and Issues are welcome!

1. Fork this repository
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push the branch: `git push origin feat/your-feature`
5. Open a Pull Request

**Commit message conventions:**
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation update
- `chore:` — maintenance / housekeeping

---

## Buy Me a Coffee ☕

If this tool saves you time, consider supporting development:

| WeChat Pay | Alipay | PayPal |
|------------|--------|--------|
| ![WeChat](assets/WeChatPay.JPG) | ![Alipay](assets/AliPay.JPG) | ![PayPal](assets/PayPal.jpg) |

---

## Changelog

- **v1.2.1** — Minor fixes and stability improvements
- **v1.2.0** — Added NJAV as fourth data source; reordered source priority
- **v1.1.x** — Three-source fallback; JAVDB Cookie made optional; cross-platform compatibility fixes
- **v1.0.0** — Initial release
