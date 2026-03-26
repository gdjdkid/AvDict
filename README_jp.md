[English](README.md) | [中文](README_zh.md) | 日本語 | [한국어](README_kr.md) | [Deutsch](README_de.md)

# AvDict 🎬

> コマンドラインで AV 番号を検索するツール — 出演者、発売日、メーカーなどの情報を取得

[![npm version](https://img.shields.io/badge/version-1.2.2-blue.svg)](https://github.com/gdjdkid/AvDict)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)]()

番号を入力するだけで、出演者・発売日・メーカー・収録時間・タグなどの詳細情報を取得できます。複数のデータソースを自動的に切り替えて検索します。

![JavDict-Demo](https://raw.githubusercontent.com/gdjdkid/AvDict/master/Javdict-Demo.gif)

---

## 特徴

- 🔍 **複数データソース自動フォールバック** — JAVBUS → NJAV → JavLibrary → JAVDB の順に検索、最初にヒットした結果を返す
- 📋 **豊富な情報** — 女優、男優、発売日、収録時間、メーカー、レーベル、監督、シリーズ、タグ、パッケージ画像、評価
- 💾 **ローカルキャッシュ** — 検索結果を7日間キャッシュし、重複リクエストを削減
- 🖥️ **クロスプラットフォーム** — Linux、Windows、macOS 対応
- 🎨 **カラー出力** — ターミナルで見やすいカラー表示
- ⚡ **高速検索** — 番号から直接 URL を生成、ログイン不要

---

## 動作要件

- Node.js >= 18.0.0
- npm >= 6.0.0
- curl（Linux/macOS は標準搭載、Windows は Git Bash 環境で利用可能なこと）

---

## プラットフォームサポート

| プラットフォーム | JAVBUS | NJAV | JavLibrary | JAVDB |
|----------------|--------|------|------------|-------|
| Linux / macOS | ✅ | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ❌ |

> JAVDB は Cloudflare の TLS フィンガープリント制限により Windows では利用不可。その他の3つのソースは Windows でも正常に動作します。

---

## インストール

**方法1：npm からインストール（推奨）**

```bash
npm install -g javdict
```

**方法2：GitHub からクローン（開発者向け）**

```bash
git clone https://github.com/gdjdkid/AvDict.git
cd AvDict
npm install
npm install -g .
```

**インストール確認：**

```bash
jav -v
```

## アップデート方法

**方法1：npm でアップデート（推奨）**
```bash
sudo npm install -g javdict@latest
```

**方法2：GitHub からアップデート（開発者向け）**
```bash
cd AvDict
git pull
sudo npm install -g .
```

---

## 使い方

**番号を検索：**

```bash
jav SSIS-001
jav ABF-331
jav JUR-067
```

**言語を指定して出力：**
```bash
jav --lang jp SSIS-001   # 日本語（デフォルト設定時）
jav --lang zh SSIS-001   # 中文
jav --lang en SSIS-001   # English
jav --lang kr SSIS-001   # 한국어
jav --lang de SSIS-001   # Deutsch
jav -l ja SSIS-001       # 省略形
```

**生の JSON データで出力：**

```bash
jav -r SSIS-001
```

**キャッシュを削除：**

```bash
jav --clear-cache
```

**JAVDB Cookie を設定（任意）：**

```bash
jav --setup
```

**ヘルプを表示：**

```bash
jav -h
```

---

## コマンドオプション

```
Usage: jav [options] [番号]

Arguments:
  番号                   検索する番号、例: SSIS-001

Options:
  -v, --version         バージョンを表示
  -l, --lang <言語>     出力言語：zh/en/jp/kr/de（デフォルト：zh）
  -r, --raw             生の JSON 形式で出力
  --setup               JAVDB Cookie を設定（任意、カバレッジ向上）
  --clear-cache         ローカルキャッシュを削除
  -h, --help            ヘルプを表示
```

---

## 設定

### JAVDB Cookie（任意）

設定しなくても通常通り使用できます。設定すると、一部のマイナー作品の検索カバレッジが向上します（Linux/macOS のみ有効）。

**取得手順：**

1. Chrome で [https://javdb.com](https://javdb.com) を開いてログイン
2. Chrome 拡張機能 [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) をインストール
3. JAVDB ページで拡張機能アイコンをクリックし、Cookie をエクスポート
4. `_jdb_session` の行を見つけ、最後の列の値をコピー
5. 以下のコマンドを実行して貼り付け：

```bash
jav --setup
```

Cookie は `~/.config/javinfo/config.json` にローカル保存されます。外部に送信されることはありません。

**Cookie の有効期限は約2週間**です。マイナー作品が見つからなくなったら `jav --setup` を再実行して更新してください。

---

## キャッシュについて

検索結果は `~/.config/javinfo/cache.json` に自動的にキャッシュされ、有効期限は7日間です。

強制的に最新データを取得するには：

```bash
jav --clear-cache
```

---

## よくある質問

**Q: 「番号が見つかりません」と表示される？**

A: 考えられる原因：
1. すべてのデータソースに収録されていない（非常にマイナーなコンテンツ）
2. JAVDB Cookie の有効期限切れ — `jav --setup` で更新
3. データソースへのネットワークアクセス不可 — プロキシ設定を確認

**Q: Windows で一部の番号が見つからない？**

A: Windows では Cloudflare の制限により JAVDB が使用できません。JAVDB にのみ収録されている一部の作品は Windows では検索できません。完全な検索結果を得るには Linux 環境（Raspberry Pi など）の使用を推奨します。

**Q: `Permission denied` と表示される？**

A: グローバルインストールには管理者権限が必要です：
```bash
sudo npm install -g .
```

**Q: Cookie はどのくらいの頻度で更新が必要ですか？**

A: 通常は約2週間ごとです。以前は検索できていたマイナー作品が見つからなくなったら、Cookie の有効期限切れの可能性があります — `jav --setup` を実行して更新してください。

**Q: FC2 素人番号は対応していますか？**

A: 対応しています。`031926-100` のようなハイフン形式で入力してください。ツールが自動的に形式を変換して検索します。

**Q: 中国本土でも使えますか？**

A: すべてのデータソースは中国本土からアクセスできない海外サイトです。中国本土ではプロキシ（VPN）が必要です。検索が失敗する場合は、以下のコマンドでネットワーク接続を確認してください：
```bash
curl -sL --connect-timeout 5 "https://www.javbus.com" -o /dev/null -w "JAVBUS: %{http_code}\n"
curl -sL --connect-timeout 5 "https://www.njav.com" -o /dev/null -w "NJAV: %{http_code}\n"
curl -sL --connect-timeout 5 "https://www.google.com" -o /dev/null -w "Google: %{http_code}\n"
```

`200` が返ってくれば接続可能、`000` が返ってくれば接続不可です。プロキシ設定を確認してください。

---

## データソース

| ソース | サイト | 特徴 |
|--------|--------|------|
| JAVBUS | [javbus.com](https://www.javbus.com) | 高速、豊富なデータ |
| NJAV | [njav.com](https://www.njav.com) | 高カバレッジ、Cookie 不要 |
| JavLibrary | [javlibrary.com](https://www.javlibrary.com) | 詳細なメタデータ、評価情報あり |
| JAVDB | [javdb.com](https://javdb.com) | 最も包括的、Cookie 必要 |

---

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとでオープンソース公開されています。

---

## コントリビュート

PR や Issue を歓迎します！

1. このリポジトリを Fork
2. ブランチを作成：`git checkout -b feat/your-feature`
3. 変更をコミット：`git commit -m "feat: 変更内容を説明"`
4. ブランチをプッシュ：`git push origin feat/your-feature`
5. Pull Request を作成

**コミットメッセージ規則：**
- `feat:` — 新機能
- `fix:` — バグ修正
- `docs:` — ドキュメント更新
- `chore:` — メンテナンス

---

## 作者にコーヒーを ☕

このツールが役に立った場合は、サポートをご検討ください：

| WeChat Pay | Alipay | PayPal |
|------------|--------|--------|
| ![WeChat](assets/WeChatPay.JPG) | ![Alipay](assets/AliPay.JPG) | ![PayPal](assets/PayPal.jpg) |

---

## 更新履歴

- **v1.2.2** — README 多言語対応、npm 公開
- **v1.2.0** — NJAV を第4データソースとして追加、優先順位を調整
- **v1.1.x** — 3ソースフォールバック、JAVDB Cookie をオプション化、クロスプラットフォーム対応
- **v1.0.0** — 初回リリース
