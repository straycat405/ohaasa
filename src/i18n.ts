import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      title: '오늘의 별자리 운세',
      subtitle: '아사히 TV "오하아사" 기준 별자리 순위',
      rank: '위',
      luckyItem: '행운의 아이템/액션',
      lang_ko: '한국어',
      lang_ja: '日本語',
      lang_en: 'English',
      loading: '운세를 가져오는 중...',
    }
  },
  ja: {
    translation: {
      title: '今日の星座占い',
      subtitle: '朝日放送「おはよう朝日です」より',
      rank: '位',
      luckyItem: 'ラッキーアイテム/アクション',
      lang_ko: '한국어',
      lang_ja: '日本語',
      lang_en: 'English',
      loading: '占いを取得中...',
    }
  },
  en: {
    translation: {
      title: 'Daily Horoscope',
      subtitle: 'Based on Asahi TV "Oha-Asa" Rankings',
      rank: 'st/nd/rd/th',
      luckyItem: 'Lucky Item/Action',
      lang_ko: 'Korean',
      lang_jp: 'Japanese',
      lang_en: 'English',
      loading: 'Loading horoscope...',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
