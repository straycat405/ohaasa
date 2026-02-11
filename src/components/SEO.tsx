import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical = 'https://ohaasa.site/', 
  image = 'https://ohaasa.site/og-image-v2.png',
  type = 'website',
  keywords
}: SEOProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Determine locale format for OG (e.g., ko_KR, ja_JP, en_US)
  const getOgLocale = (lang: string) => {
    switch (lang) {
      case 'ja': return 'ja_JP';
      case 'en': return 'en_US';
      case 'ko': default: return 'ko_KR';
    }
  };

  const siteName = '오하아사 별자리운세 | Ohaasa';
  const fullTitle = `${title} | ${siteName}`;

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "alternateName": ["오하아사", "Ohaasa", "오하요아사히데스"],
    "url": "https://ohaasa.site/",
    "description": "오하아사(Ohaasa) 별자리운세 - 아사히 TV 오하요아사히데스의 오늘의 별자리운세. 주말 포함 매일 업데이트.",
    "inLanguage": currentLang,
    "keywords": "오하아사, ohaasa, 별자리운세, 오하아사 별자리운세, 오하아사 운세, 오늘의 별자리운세, 주말 운세, 星座占い, horoscope, daily horoscope, weekend horoscope"
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={getOgLocale(currentLang)} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
