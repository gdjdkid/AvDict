[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | Deutsch

# AvDict 🎬

> Ein Kommandozeilen-Tool zum Abrufen von JAV-Metadaten anhand der Titel-ID — Besetzung, Erscheinungsdatum, Studio und mehr

[![npm version](https://img.shields.io/badge/version-1.2.2-blue.svg)](https://github.com/gdjdkid/AvDict)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)]()

Gib eine Titel-ID ein und erhalte sofort vollständige Informationen — Besetzung, Erscheinungsdatum, Studio, Laufzeit, Tags und mehr. Mehrere Datenquellen werden automatisch abgefragt, ohne manuelles Umschalten.

![JavDict-Demo](https://raw.githubusercontent.com/gdjdkid/AvDict/master/Javdict-Demo.gif)

---

## Funktionen

- 🔍 **Automatisches Multi-Source-Fallback** — Fragt JAVBUS → NJAV → JavLibrary → JAVDB der Reihe nach ab und gibt beim ersten Treffer zurück
- 📋 **Umfangreiche Metadaten** — Besetzung, Erscheinungsdatum, Laufzeit, Studio, Label, Regisseur, Serie, Tags, Cover-Bild, Bewertung
- 💾 **Lokaler Cache** — Ergebnisse werden 7 Tage lang gecacht, um wiederholte Anfragen zu reduzieren
- 🖥️ **Plattformübergreifend** — Linux, Windows und macOS werden unterstützt
- 🎨 **Farbige Ausgabe** — Übersichtliche Terminal-Darstellung mit feldweiser Farbkodierung
- ⚡ **Schnelle Suche** — Direkte URL-Konstruktion anhand der Titel-ID, kein Login erforderlich

---

## Systemanforderungen

- Node.js >= 18.0.0
- npm >= 6.0.0
- curl（unter Linux/macOS vorinstalliert; unter Windows in der Git Bash-Umgebung verfügbar）

---

## Plattform-Unterstützung

| Plattform | JAVBUS | NJAV | JavLibrary | JAVDB |
|-----------|--------|------|------------|-------|
| Linux / macOS | ✅ | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ❌ |

> JAVDB ist unter Windows aufgrund von Cloudflare TLS-Fingerprint-Einschränkungen nicht verfügbar. Die anderen drei Quellen funktionieren unter Windows vollständig.

---

## Installation

**Option 1: Installation über npm（empfohlen）**

```bash
npm install -g javdict
```

**Option 2: Klonen von GitHub（für Entwickler）**

```bash
git clone https://github.com/gdjdkid/AvDict.git
cd AvDict
npm install
npm install -g .
```

**Installation überprüfen：**

```bash
jav -v
```

---

## Verwendung

**Titel-ID suchen：**

```bash
jav SSIS-001
jav ABF-331
jav JUR-067
```

**Rohdaten als JSON ausgeben：**

```bash
jav -r SSIS-001
```

**Lokalen Cache leeren：**

```bash
jav --clear-cache
```

**JAVDB Cookie konfigurieren（optional）：**

```bash
jav --setup
```

**Hilfe anzeigen：**

```bash
jav -h
```

---

## CLI-Optionen

```
Usage: jav [options] [id]

Arguments:
  id                    Zu suchende Titel-ID, z.B. SSIS-001

Options:
  -v, --version         Versionsnummer ausgeben
  -r, --raw             Ausgabe als rohes JSON
  --setup               JAVDB Cookie konfigurieren（optional, verbessert Abdeckung）
  --clear-cache         Lokalen Cache leeren
  -h, --help            Hilfe anzeigen
```

---

## Konfiguration

### JAVDB Cookie（optional）

Das Tool funktioniert ohne jede Konfiguration. Das Hinzufügen eines JAVDB Cookies verbessert die Abdeckung für seltene Titel, die nur in der JAVDB-Datenbank vorhanden sind. Dies gilt nur für Linux/macOS.

**So erhältst du deinen Cookie：**

1. Öffne [https://javdb.com](https://javdb.com) in Chrome und melde dich an
2. Installiere die Chrome-Erweiterung [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
3. Klicke auf das Erweiterungs-Symbol auf der JAVDB-Seite und exportiere die Cookies
4. Suche die Zeile `_jdb_session` und kopiere den Wert in der letzten Spalte
5. Führe den Setup-Befehl aus und füge den Wert ein：

```bash
jav --setup
```

Dein Cookie wird lokal unter `~/.config/javinfo/config.json` gespeichert und nirgendwo hin gesendet.

**Cookies laufen in etwa 2 Wochen ab.** Wenn seltene Titel plötzlich nicht mehr gefunden werden, führe einfach `jav --setup` erneut aus.

---

## Caching

Suchergebnisse werden automatisch in `~/.config/javinfo/cache.json` mit einer Gültigkeitsdauer von 7 Tagen gespeichert.

Um frische Daten zu erzwingen：

```bash
jav --clear-cache
```

---

## Häufige Fragen

**F: Ich erhalte „Titel nicht gefunden" — was ist falsch?**

A: Es gibt drei mögliche Ursachen：
1. Der Titel ist in keiner der vier Quellen indexiert（sehr seltene Inhalte）
2. Dein JAVDB Cookie ist abgelaufen — führe `jav --setup` aus, um ihn zu erneuern
3. Dein Netzwerk kann die Quellen nicht erreichen — überprüfe deine Proxy-Einstellungen

**F: Einige Titel werden unter Windows nicht gefunden?**

A: JAVDB ist unter Windows aufgrund von Cloudflare-Einschränkungen nicht verfügbar. Eine kleine Anzahl von Titeln, die nur in JAVDB existieren, kann unter Windows nicht gefunden werden. Für vollständige Abdeckung empfehlen wir eine Linux-Umgebung（z.B. Raspberry Pi）.

**F: Werden FC2-Amateur-Titel unterstützt?**

A: Ja. Gib den Titel im Bindestrich-Format ein, z.B. `031926-100`. Das Tool erkennt das FC2-Format automatisch und wandelt es intern um.

---

## Datenquellen

| Quelle | Website | Hinweise |
|--------|---------|----------|
| JAVBUS | [javbus.com](https://www.javbus.com) | Schnell, breite Abdeckung |
| NJAV | [njav.com](https://www.njav.com) | Hohe Abdeckung, kein Cookie erforderlich |
| JavLibrary | [javlibrary.com](https://www.javlibrary.com) | Detaillierte Metadaten, enthält Bewertungen |
| JAVDB | [javdb.com](https://javdb.com) | Umfangreichste Datenbank, Cookie erforderlich |

---

## Lizenz

Dieses Projekt ist Open Source unter der [MIT License](LICENSE). Du kannst es frei verwenden, modifizieren und verteilen.

---

## Mitwirken

PRs und Issues sind willkommen！

1. Dieses Repository forken
2. Branch erstellen：`git checkout -b feat/dein-feature`
3. Änderungen committen：`git commit -m "feat: Beschreibe deine Änderung"`
4. Branch pushen：`git push origin feat/dein-feature`
5. Pull Request öffnen

**Commit-Nachricht-Konventionen：**
- `feat:` — Neue Funktion
- `fix:` — Fehlerbehebung
- `docs:` — Dokumentation aktualisiert
- `chore:` — Wartung / Housekeeping

---

## Kauf mir einen Kaffee ☕

Wenn dir dieses Tool Zeit spart, unterstütze gerne die Entwicklung：

| WeChat Pay | Alipay |
|------------|--------|
| *(QR-Code)* | *(QR-Code)* |

---

## Änderungsprotokoll

- **v1.2.2** — Mehrsprachige README, npm-Veröffentlichung
- **v1.2.0** — NJAV als vierte Datenquelle hinzugefügt, Quellenpriorität neu geordnet
- **v1.1.x** — Drei-Quellen-Fallback, JAVDB Cookie optional, plattformübergreifende Kompatibilität
- **v1.0.0** — Erstveröffentlichung
