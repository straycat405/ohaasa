# 작업 이력 (Changelog)

## 프로젝트 개요
- **프로젝트명**: Astro (별자리 운세 앱)
- **기술 스택**: React 19 + TypeScript + Vite + Tailwind CSS / Node.js Express + Cheerio
- **기능**: 일본 Asahi TV에서 별자리 운세 스크래핑, 다국어(한/일/영) 지원

---

## 2026-01-29

### 세션 시작 - 프로젝트 파악
- 프로젝트 구조 분석 완료
- 이전 작업 내역 확인 (`work_summary.txt`)
- 현재 상태:
  - Backend: 의존성 설치 완료, 서버 실행 가능
  - Frontend: 의존성 설치 완료, `npm run dev`로 실행 가능
- 미완료 작업:
  - 프론트엔드 개발 서버 실행 확인
  - "lucky item" 파싱/표시 로직 구현
  - 스크래핑 개선 검토

### Git 커밋 및 푸시
- **커밋**: `601e885` - 스크래핑 로직 개선 및 작업 이력 추가
- **변경 파일**: server/index.js, CHANGELOG.md, horoscope.html, install.cmd
- **삭제 파일**: scriptforgemini.txt
- **푸시 완료**: origin/master

### Cloudflare Pages 배포 문제 수정
- **문제**: MIME type 에러로 흰 화면 발생
- **원인**: Cloudflare Pages 빌드 설정 미비
- **수정**:
  - `src/App.tsx`: 미사용 import 제거 (빌드 에러 해결)
  - `public/_redirects`: SPA 라우팅 설정 추가
- **커밋**: `387a8d6`
- **추가 이슈**: 백엔드 API가 localhost를 바라봄 (Cloudflare Workers 필요)

### Cloudflare Workers로 백엔드 이전
- **신규**: `functions/api/horoscope.js` - Pages Functions로 스크래핑 API 구현
- **수정**: `src/App.tsx` - 환경별 API URL 분기 (DEV: localhost:3001, PROD: /api/horoscope)
- **커밋**: `cf46bc3`
- **결과**: Cloudflare Pages 재배포 시 백엔드 API 자동 포함

---

## 이전 작업 (Initial Commit 이후)
- `server/package.json`에 start 스크립트 추가
- PowerShell 실행 정책 우회하여 의존성 설치
- 백엔드 서버 백그라운드 실행 성공
