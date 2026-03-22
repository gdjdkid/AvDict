[English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | 한국어 | [Deutsch](README_de.md)

# AvDict 🎬

> 커맨드라인에서 AV 번호로 상세 정보를 검색하는 도구 — 출연진, 발매일, 제작사 등

[![npm version](https://img.shields.io/badge/version-1.2.2-blue.svg)](https://github.com/gdjdkid/AvDict)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)]()

번호를 입력하면 출연진, 발매일, 제작사, 재생 시간, 태그 등 상세 정보를 바로 확인할 수 있습니다. 여러 데이터 소스를 자동으로 전환하며 검색합니다.

![JavDict-Demo](https://raw.githubusercontent.com/gdjdkid/AvDict/master/Javdict-Demo.gif)

---

## 주요 기능

- 🔍 **다중 소스 자동 폴백** — JAVBUS → NJAV → JavLibrary → JAVDB 순서로 검색, 첫 번째 결과 반환
- 📋 **풍부한 정보** — 여배우, 남배우, 발매일, 재생 시간, 제작사, 레이블, 감독, 시리즈, 태그, 커버 이미지, 평점
- 💾 **로컬 캐시** — 검색 결과를 7일간 캐시하여 중복 요청 감소
- 🖥️ **크로스 플랫폼** — Linux, Windows, macOS 지원
- 🎨 **컬러 출력** — 터미널에서 필드별 색상으로 가독성 향상
- ⚡ **빠른 검색** — 번호로 직접 URL 생성, 로그인 불필요

---

## 시스템 요구 사항

- Node.js >= 18.0.0
- npm >= 6.0.0
- curl（Linux/macOS 기본 탑재, Windows는 Git Bash 환경에서 사용 가능해야 함）

---

## 플랫폼 지원

| 플랫폼 | JAVBUS | NJAV | JavLibrary | JAVDB |
|--------|--------|------|------------|-------|
| Linux / macOS | ✅ | ✅ | ✅ | ✅ |
| Windows | ✅ | ✅ | ✅ | ❌ |

> JAVDB는 Cloudflare TLS 핑거프린트 제한으로 인해 Windows에서 사용 불가. 나머지 3개 소스는 Windows에서도 정상 동작합니다.

---

## 설치 방법

**방법 1：npm으로 설치（권장）**

```bash
npm install -g javdict
```

**방법 2：GitHub에서 클론（개발자용）**

```bash
git clone https://github.com/gdjdkid/AvDict.git
cd AvDict
npm install
npm install -g .
```

**설치 확인：**

```bash
jav -v
```

---

## 사용 방법

**번호 검색：**

```bash
jav SSIS-001
jav ABF-331
jav JUR-067
```

**원시 JSON 출력：**

```bash
jav -r SSIS-001
```

**로컬 캐시 삭제：**

```bash
jav --clear-cache
```

**JAVDB Cookie 설정（선택）：**

```bash
jav --setup
```

**도움말 표시：**

```bash
jav -h
```

---

## 명령어 옵션

```
Usage: jav [options] [번호]

Arguments:
  번호                   검색할 번호, 예: SSIS-001

Options:
  -v, --version         버전 출력
  -r, --raw             원시 JSON 형식으로 출력
  --setup               JAVDB Cookie 설정（선택, 커버리지 향상）
  --clear-cache         로컬 캐시 삭제
  -h, --help            도움말 표시
```

---

## 설정

### JAVDB Cookie（선택）

설정하지 않아도 정상적으로 사용할 수 있습니다. 설정하면 일부 마이너 번호의 검색 커버리지가 향상됩니다（Linux/macOS에서만 적용）.

**획득 방법：**

1. Chrome에서 [https://javdb.com](https://javdb.com) 열고 로그인
2. Chrome 확장 프로그램 [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc) 설치
3. JAVDB 페이지에서 확장 프로그램 아이콘 클릭 후 Cookie 내보내기
4. `_jdb_session` 행을 찾아 마지막 열의 값 복사
5. 다음 명령어 실행 후 붙여넣기：

```bash
jav --setup
```

Cookie는 `~/.config/javinfo/config.json`에 로컬 저장되며 외부로 전송되지 않습니다.

**Cookie 유효기간은 약 2주**입니다. 마이너 번호가 갑자기 검색되지 않으면 `jav --setup`을 다시 실행하여 갱신하세요.

---

## 캐시 설명

검색 결과는 `~/.config/javinfo/cache.json`에 자동으로 캐시되며 유효기간은 7일입니다.

강제로 새 데이터를 가져오려면：

```bash
jav --clear-cache
```

---

## 자주 묻는 질문

**Q: "번호를 찾을 수 없습니다"가 표시되면？**

A: 가능한 원인：
1. 모든 데이터 소스에 등록되지 않은 번호（매우 마이너한 콘텐츠）
2. JAVDB Cookie 만료 — `jav --setup`으로 갱신
3. 데이터 소스 접근 불가 — 프록시 설정 확인

**Q: Windows에서 일부 번호가 검색되지 않나요？**

A: Windows에서는 Cloudflare 제한으로 JAVDB를 사용할 수 없습니다. JAVDB에만 등록된 일부 번호는 Windows에서 검색할 수 없습니다. 완전한 검색 결과를 위해서는 Linux 환경（예: Raspberry Pi）사용을 권장합니다.

**Q: FC2 소인 번호도 지원하나요？**

A: 지원합니다. `031926-100`과 같은 하이픈 형식으로 입력하세요. 도구가 자동으로 형식을 변환하여 검색합니다.

---

## 데이터 소스

| 소스 | 사이트 | 특징 |
|------|--------|------|
| JAVBUS | [javbus.com](https://www.javbus.com) | 빠른 속도, 풍부한 데이터 |
| NJAV | [njav.com](https://www.njav.com) | 높은 커버리지, Cookie 불필요 |
| JavLibrary | [javlibrary.com](https://www.javlibrary.com) | 상세한 메타데이터, 평점 정보 |
| JAVDB | [javdb.com](https://javdb.com) | 가장 포괄적, Cookie 필요 |

---

## 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 오픈소스로 공개됩니다.

---

## 기여하기

PR과 Issue를 환영합니다！

1. 이 저장소를 Fork
2. 브랜치 생성：`git checkout -b feat/your-feature`
3. 변경 사항 커밋：`git commit -m "feat: 변경 내용 설명"`
4. 브랜치 푸시：`git push origin feat/your-feature`
5. Pull Request 생성

**커밋 메시지 규칙：**
- `feat:` — 새 기능
- `fix:` — 버그 수정
- `docs:` — 문서 업데이트
- `chore:` — 유지보수

---

## 작성자에게 커피 한 잔 ☕

이 도구가 도움이 됐다면 후원을 고려해 주세요：

| WeChat Pay | Alipay |
|------------|--------|
| *(QR코드)* | *(QR코드)* |

---

## 변경 이력

- **v1.2.2** — README 다국어 지원, npm 공개
- **v1.2.0** — NJAV를 4번째 데이터 소스로 추가, 우선순위 조정
- **v1.1.x** — 3소스 폴백, JAVDB Cookie 선택 사항으로 변경, 크로스 플랫폼 호환성
- **v1.0.0** — 최초 릴리스
