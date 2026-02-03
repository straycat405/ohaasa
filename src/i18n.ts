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
      // Footer
      footer_copyright: 'OHAYO ASAHI HOROSCOPE',
      footer_powered: 'Powered by DeepL | Data from Asahi TV',
      nav_home: '홈',
      nav_about: '소개',
      nav_privacy: '개인정보처리방침',
      nav_terms: '이용약관',
      // About Page
      about_title: '사이트 소개',
      about_service_title: '서비스 소개',
      about_service_desc: '오하요 아사히 운세는 일본 아사히 TV의 인기 아침 프로그램 "오하요 아사히(おはよう朝日です)"에서 방송되는 매일 별자리 운세를 제공하는 서비스입니다.',
      about_source_title: '데이터 출처',
      about_source_desc: '모든 운세 데이터는 아사히 TV "오하요 아사히(おはよう朝日です)" 프로그램에서 제공됩니다. 본 서비스는 교육 및 오락 목적으로 해당 콘텐츠를 번역하여 제공합니다.',
      about_source_note: '※ 운세는 월~금요일에만 업데이트됩니다. 주말에는 금요일 운세가 표시됩니다.',
      about_source_link: '오하아사 공식 사이트 바로가기',
      about_translation_title: '번역 안내',
      about_translation_desc: '일본어 원문은 DeepL을 통해 한국어와 영어로 번역됩니다. AI 번역의 특성상 약간의 오차가 있을 수 있습니다.',
      about_disclaimer_title: '면책 조항',
      about_disclaimer_desc: '본 서비스는 순수하게 오락 목적으로 제공됩니다. 운세 내용은 재미를 위한 것이며, 중요한 결정을 내리는 데 사용해서는 안 됩니다.',
      // Privacy Page
      privacy_title: '개인정보처리방침',
      privacy_intro: '본 개인정보처리방침은 오하요 아사히 운세 서비스(이하 "서비스")의 개인정보 수집 및 이용에 관한 내용을 설명합니다.',
      privacy_collect_title: '수집하는 정보',
      privacy_collect_desc: '본 서비스는 사용자의 개인정보를 직접 수집하지 않습니다. 사용자의 언어 설정은 브라우저의 로컬 스토리지에만 저장되며, 서버로 전송되지 않습니다.',
      privacy_cookies_title: '쿠키 및 광고',
      privacy_cookies_desc: '본 서비스는 Google AdSense를 사용하여 광고를 표시합니다. Google은 광고 개인화를 위해 쿠키를 사용할 수 있습니다. Google의 개인정보처리방침은 https://policies.google.com/privacy 에서 확인할 수 있습니다.',
      privacy_third_title: '제3자 서비스',
      privacy_third_desc: '본 서비스는 다음의 제3자 서비스를 사용합니다: Google AdSense (광고), DeepL (번역), Cloudflare Pages (호스팅).',
      privacy_contact_title: '문의',
      privacy_contact_desc: '개인정보 관련 문의사항이 있으시면 GitHub 이슈를 통해 연락해 주세요.',
      // Terms Page
      terms_title: '이용약관',
      terms_intro: '본 이용약관은 오하요 아사히 운세 서비스(이하 "서비스")의 이용 조건을 규정합니다.',
      terms_use_title: '서비스 이용',
      terms_use_desc: '본 서비스는 무료로 제공되며, 누구나 자유롭게 이용할 수 있습니다. 서비스 이용 시 본 약관에 동의하는 것으로 간주됩니다.',
      terms_entertainment_title: '오락 목적',
      terms_entertainment_desc: '본 서비스에서 제공하는 모든 운세 정보는 오락 목적으로만 제공됩니다. 운세 내용은 과학적 근거가 없으며, 중요한 결정을 내리는 데 사용해서는 안 됩니다.',
      terms_ip_title: '지적 재산권',
      terms_ip_desc: '원본 운세 콘텐츠에 대한 모든 권리는 아사히 TV에 귀속됩니다. 본 서비스는 교육 및 오락 목적으로 해당 콘텐츠를 번역하여 제공합니다.',
      terms_warranty_title: '보증 부인',
      terms_warranty_desc: '본 서비스는 "있는 그대로" 제공됩니다. 서비스의 정확성, 완전성, 신뢰성에 대해 어떠한 보증도 하지 않습니다. 서비스 이용으로 인한 모든 책임은 사용자에게 있습니다.',
      terms_changes_title: '약관 변경',
      terms_changes_desc: '본 약관은 사전 고지 없이 변경될 수 있습니다. 변경된 약관은 서비스에 게시된 시점부터 효력이 발생합니다.',
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
      // Footer
      footer_copyright: 'OHAYO ASAHI HOROSCOPE',
      footer_powered: 'Powered by DeepL | Data from Asahi TV',
      nav_home: 'ホーム',
      nav_about: 'について',
      nav_privacy: 'プライバシーポリシー',
      nav_terms: '利用規約',
      // About Page
      about_title: 'サイト紹介',
      about_service_title: 'サービス紹介',
      about_service_desc: 'おはよう朝日占いは、日本の朝日放送の人気朝番組「おはよう朝日です」で放送される毎日の星座占いを提供するサービスです。',
      about_source_title: 'データソース',
      about_source_desc: 'すべての占いデータは朝日放送「おはよう朝日です」番組から提供されています。本サービスは教育およびエンターテインメント目的でコンテンツを翻訳して提供しています。',
      about_source_note: '※ 占いは月〜金曜日のみ更新されます。週末は金曜日の占いが表示されます。',
      about_source_link: 'おはよう朝日です 公式サイトへ',
      about_translation_title: '翻訳について',
      about_translation_desc: '日本語の原文はDeepLを使用して韓国語と英語に翻訳されます。AI翻訳の特性上、多少の誤差がある場合があります。',
      about_disclaimer_title: '免責事項',
      about_disclaimer_desc: '本サービスは純粋にエンターテインメント目的で提供されています。占いの内容は楽しみのためのものであり、重要な決定を下す際に使用すべきではありません。',
      // Privacy Page
      privacy_title: 'プライバシーポリシー',
      privacy_intro: '本プライバシーポリシーは、おはよう朝日占いサービス（以下「サービス」）の個人情報の収集および利用について説明します。',
      privacy_collect_title: '収集する情報',
      privacy_collect_desc: '本サービスはユーザーの個人情報を直接収集しません。ユーザーの言語設定はブラウザのローカルストレージにのみ保存され、サーバーには送信されません。',
      privacy_cookies_title: 'Cookieと広告',
      privacy_cookies_desc: '本サービスはGoogle AdSenseを使用して広告を表示します。Googleは広告のパーソナライズのためにCookieを使用する場合があります。Googleのプライバシーポリシーは https://policies.google.com/privacy でご確認いただけます。',
      privacy_third_title: 'サードパーティサービス',
      privacy_third_desc: '本サービスは以下のサードパーティサービスを使用しています：Google AdSense（広告）、DeepL（翻訳）、Cloudflare Pages（ホスティング）。',
      privacy_contact_title: 'お問い合わせ',
      privacy_contact_desc: 'プライバシーに関するお問い合わせは、GitHubイシューを通じてご連絡ください。',
      // Terms Page
      terms_title: '利用規約',
      terms_intro: '本利用規約は、おはよう朝日占いサービス（以下「サービス」）の利用条件を規定します。',
      terms_use_title: 'サービスの利用',
      terms_use_desc: '本サービスは無料で提供され、どなたでも自由にご利用いただけます。サービスをご利用いただくことで、本規約に同意したものとみなされます。',
      terms_entertainment_title: 'エンターテインメント目的',
      terms_entertainment_desc: '本サービスで提供されるすべての占い情報はエンターテインメント目的でのみ提供されます。占いの内容には科学的根拠がなく、重要な決定を下す際に使用すべきではありません。',
      terms_ip_title: '知的財産権',
      terms_ip_desc: 'オリジナルの占いコンテンツに関するすべての権利は朝日放送に帰属します。本サービスは教育およびエンターテインメント目的でコンテンツを翻訳して提供しています。',
      terms_warranty_title: '保証の否認',
      terms_warranty_desc: '本サービスは「現状のまま」提供されます。サービスの正確性、完全性、信頼性について一切の保証を行いません。サービスの利用に起因するすべての責任はユーザーにあります。',
      terms_changes_title: '規約の変更',
      terms_changes_desc: '本規約は予告なく変更される場合があります。変更された規約はサービスに掲載された時点から効力を発生します。',
    }
  },
  en: {
    translation: {
      title: 'Daily Horoscope',
      subtitle: 'Based on Asahi TV "Oha-Asa" Rankings',
      rank: 'st/nd/rd/th',
      luckyItem: 'Lucky Item/Action',
      lang_ko: 'Korean',
      lang_ja: 'Japanese',
      lang_en: 'English',
      loading: 'Loading horoscope...',
      // Footer
      footer_copyright: 'OHAYO ASAHI HOROSCOPE',
      footer_powered: 'Powered by DeepL | Data from Asahi TV',
      nav_home: 'Home',
      nav_about: 'About',
      nav_privacy: 'Privacy Policy',
      nav_terms: 'Terms of Service',
      // About Page
      about_title: 'About Us',
      about_service_title: 'Our Service',
      about_service_desc: 'Ohayo Asahi Horoscope provides daily zodiac horoscopes from the popular Japanese morning TV program "Ohayo Asahi (Good Morning Asahi)" aired on Asahi TV.',
      about_source_title: 'Data Source',
      about_source_desc: 'All horoscope data is sourced from Asahi TV\'s "Ohayo Asahi (おはよう朝日です)" program. This service translates the content for educational and entertainment purposes.',
      about_source_note: '※ Horoscopes are updated Monday through Friday only. Weekend displays Friday\'s horoscope.',
      about_source_link: 'Visit Ohayo Asahi Official Site',
      about_translation_title: 'Translation',
      about_translation_desc: 'Japanese original text is translated into Korean and English using DeepL. Due to the nature of AI translation, there may be minor inaccuracies.',
      about_disclaimer_title: 'Disclaimer',
      about_disclaimer_desc: 'This service is provided purely for entertainment purposes. Horoscope content is meant for fun and should not be used for making important decisions.',
      // Privacy Page
      privacy_title: 'Privacy Policy',
      privacy_intro: 'This Privacy Policy explains how Ohayo Asahi Horoscope service ("Service") collects and uses personal information.',
      privacy_collect_title: 'Information We Collect',
      privacy_collect_desc: 'This Service does not directly collect user personal information. Your language preference is stored only in your browser\'s local storage and is not transmitted to our servers.',
      privacy_cookies_title: 'Cookies and Advertising',
      privacy_cookies_desc: 'This Service uses Google AdSense to display advertisements. Google may use cookies for ad personalization. Google\'s Privacy Policy can be found at https://policies.google.com/privacy.',
      privacy_third_title: 'Third-Party Services',
      privacy_third_desc: 'This Service uses the following third-party services: Google AdSense (advertising), DeepL (translation), Cloudflare Pages (hosting).',
      privacy_contact_title: 'Contact',
      privacy_contact_desc: 'For privacy-related inquiries, please contact us through GitHub Issues.',
      // Terms Page
      terms_title: 'Terms of Service',
      terms_intro: 'These Terms of Service govern the use of Ohayo Asahi Horoscope service ("Service").',
      terms_use_title: 'Use of Service',
      terms_use_desc: 'This Service is provided free of charge and is available for anyone to use. By using the Service, you agree to be bound by these Terms.',
      terms_entertainment_title: 'Entertainment Purpose',
      terms_entertainment_desc: 'All horoscope information provided by this Service is for entertainment purposes only. Horoscope content has no scientific basis and should not be used for making important decisions.',
      terms_ip_title: 'Intellectual Property',
      terms_ip_desc: 'All rights to the original horoscope content belong to Asahi TV. This Service translates the content for educational and entertainment purposes.',
      terms_warranty_title: 'Disclaimer of Warranties',
      terms_warranty_desc: 'This Service is provided "as is" without any warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of the Service. Users assume all responsibility for their use of the Service.',
      terms_changes_title: 'Changes to Terms',
      terms_changes_desc: 'These Terms may be changed without prior notice. Modified Terms become effective upon posting on the Service.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
