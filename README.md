# Ohayo Asahi Horoscope (오하요 아사히 운세)

일본 아사히 TV "오하요 아사히(おはよう朝日です)" 프로그램의 매일 별자리 운세를 한국어, 일본어, 영어로 제공하는 웹 서비스입니다.

**Live Site:** https://ohaasa.site

---

## 1. 기술 스택

### Frontend
| 기술 | 버전 | 설명 |
|------|------|------|
| React | ^19.2.0 | UI 라이브러리 |
| TypeScript | ~5.9.3 | 타입 안전성 |
| Vite (rolldown-vite) | 7.2.5 | 빌드 도구 |
| Tailwind CSS | ^4.1.18 | 스타일링 |
| React Router DOM | ^7.13.0 | 클라이언트 라우팅 |
| i18next / react-i18next | ^25.8.0 / ^16.5.4 | 다국어 지원 (한/일/영) |
| Lucide React | ^0.563.0 | 아이콘 |
| react-helmet-async | ^2.0.5 | SEO 메타 태그 관리 |

### Backend / Infrastructure
| 기술 | 설명 |
|------|------|
| Cloudflare Pages | 프론트엔드 호스팅 |
| Cloudflare Workers | API 백엔드 (운세 데이터 스크래핑) |
| Google Gemini AI | 일본어 → 한국어/영어 번역 |
| Cloudflare KV | 캐시 스토리지 |

### Analytics & Ads
- Google Analytics (gtag.js)
- Google AdSense
- Microsoft Clarity

---

## 2. 라우터 구조

```
src/App.tsx
└── Routes
    └── Layout (공통 레이아웃: Header + Footer)
        ├── /           → HomePage     (메인 운세 페이지)
        ├── /about      → AboutPage    (서비스 소개)
        ├── /privacy    → PrivacyPage  (개인정보처리방침)
        └── /terms      → TermsPage    (이용약관)
```

### 파일 구조
```
src/
├── App.tsx              # 라우터 설정
├── main.tsx             # 앱 진입점
├── i18n.ts              # 다국어 설정 (ko/ja/en)
├── components/
│   ├── Layout.tsx       # 공통 레이아웃
│   └── Footer.tsx       # 푸터 컴포넌트
└── pages/
    ├── HomePage.tsx     # 메인 운세 페이지
    ├── AboutPage.tsx    # 소개 페이지
    ├── PrivacyPage.tsx  # 개인정보처리방침
    └── TermsPage.tsx    # 이용약관
```

---

## 3. 주요 기능 구현

### 3.1 별자리 운세 표시
- API (`/api/horoscope`)에서 12별자리 운세 데이터 fetch
- 순위별 정렬 및 카드 형태로 표시
- 1위 별자리 특별 하이라이트 (Crown 아이콘, 골드 배지)
- 각 별자리별 생일 날짜 범위 표시

### 3.2 다국어 지원 (i18n)
- 한국어 (ko), 일본어 (ja), 영어 (en) 3개 언어 지원
- 헤더에서 실시간 언어 전환
- 운세 내용은 Gemini AI가 일본어 원문에서 번역

### 3.3 행운의 비법 (Lucky Hint)
- 각 별자리별 행운의 아이템/액션 표시
- Clover 아이콘과 함께 강조 디자인

### 3.4 SEO 최적화
- react-helmet-async로 동적 메타 태그 관리
- Open Graph / Twitter Card 메타 태그
- robots.txt, sitemap 설정

### 3.5 반응형 UI
- Tailwind CSS 기반 모바일 우선 디자인
- 그린/에메랄드 테마 컬러

---

## 4. 커밋 히스토리

| 날짜 | 커밋 | 주요 내용 |
|------|------|----------|
| 2026-02-16 | `a61ac98` | 7시 이전 전날 운세 표시 (방송 시간 기준 로직 수정) |
| 2026-02-16 | `b14d25f` | API 데이터 갱신 지연 시 TV Asahi 사이트 Fallback 구현 |
| 2026-02-11 | `22db3e0` | SEO 강화 (타이틀, 키워드, 메타 태그 최적화) |
| 2026-02-10 | `5f6e3b8` | 모바일 이메일 링크 인식 문제 수정 |
| 2026-02-08 | `c161ce3` | 배경 별 반짝임 애니메이션 추가 (다크 모드 전용) |
| 2026-01-30 | `0251821` | 각 별자리 옆에 생일 날짜 범위 표시 추가 |
| 2026-01-30 | `0dc77f6` | Microsoft Clarity 추적 코드 추가 |
| 2026-01-30 | `c0760f2` | Google Analytics (gtag.js) 추가 |
| 2026-01-30 | `d1ccab8` | Google AdSense 스크립트 및 ads.txt 추가 |
| 2026-01-30 | `3f34641` | React 19 호환성을 위한 .npmrc 설정 추가 |
| 2026-01-30 | `793fcd9` | 멀티 페이지 라우팅 구현 및 로컬 개발 프록시 수정 |
| 2026-01-30 | `266cff5` | 매일 캐시 워밍업을 위한 GitHub Actions 워크플로우 추가 |
| 2026-01-30 | `f715d65` | Gemini 모델을 gemini-2.0-flash로 설정, 캐시 v7 |
| 2026-01-30 | `a7519ae` | gemini-2.0-flash-exp로 전환, 캐시 v6 |
| 2026-01-30 | `bb0b8d3` | 최대 호환성을 위해 responseMimeType 제거 |
| 2026-01-30 | `32ae29f` | 안정적인 v1 Gemini API 엔드포인트로 전환 |
| 2026-01-30 | `41a6d70` | 안정적인 gemini-1.5-flash 모델로 전환 |
| 2026-01-30 | `21794da` | 로직 개선 및 i18n 표준화 |
| 2026-01-30 | `8cbff2b` | Gemini 응답 정제 로직 및 프론트엔드 진단 기능 추가 |
| 2026-01-30 | `deb8042` | 모델 복원 및 에러 리포팅 개선 |
| 2026-01-30 | `15d4257` | Clover 아이콘, 그린 테마, 일본어 지원 추가 |
| 2026-01-30 | `70041da` | 안정 모델명 수정, console.log 제거, 일본어 날짜 버그 수정 |
| 2026-01-30 | `83ed7a1` | 방어적 코딩 추가, 캐시 버전 v2로 업데이트 |
| 2026-01-30 | `4e4b64a` | Gemini AI 번역 구현 및 Lucky Secret UI 추가 |
| 2026-01-29 | `f3eab66` | UI 디자인 전면 개선 |
| 2026-01-29 | `6087380` | JSON API로 스크래핑 방식 변경 |
| 2026-01-29 | `13f551c` | 스크래핑 로직 개선 - HTML 구조 기반 파싱 |
| 2026-01-29 | `d8208b6` | CHANGELOG 업데이트 - Cloudflare 배포 설정 기록 |
| 2026-01-29 | `cf46bc3` | Cloudflare Workers로 백엔드 이전 |
| 2026-01-29 | `387a8d6` | Cloudflare Pages 배포 수정 |
| 2026-01-29 | `601e885` | 스크래핑 로직 개선 및 작업 이력 추가 |
| 2026-01-29 | `2f9fafb` | 초기 커밋 및 프로젝트 셋업 |

---

## 5. 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

---

## 6. 라이선스

원본 운세 콘텐츠의 모든 권리는 아사히 TV에 귀속됩니다.
본 서비스는 교육 및 오락 목적으로 제공됩니다.
