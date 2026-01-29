const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const zodiacMap = {
  'おひつじ座': { ko: '양자리', en: 'Aries' },
  'おうし座': { ko: '황소자리', en: 'Taurus' },
  'ふたご座': { ko: '쌍둥이자리', en: 'Gemini' },
  'かに座': { ko: '게자리', en: 'Cancer' },
  'しし座': { ko: '사자자리', en: 'Leo' },
  'おとめ座': { ko: '처녀자리', en: 'Virgo' },
  'てんびん座': { ko: '천칭자리', en: 'Libra' },
  'さそり座': { ko: '전갈자리', en: 'Scorpio' },
  'いて座': { ko: '사수자리', en: 'Sagittarius' },
  'やぎ座': { ko: '염소자리', en: 'Capricorn' },
  'みずがめ座': { ko: '물병자리', en: 'Aquarius' },
  'うお座': { ko: '물고기자리', en: 'Pisces' },
};

app.get('/api/horoscope', async (req, res) => {
  try {
    const response = await axios.get('https://www.asahi.co.jp/ohaasa/week/horoscope/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const horoscopeData = [];

    // Extract Date
    const dateText = $('.date').text().trim() || new Date().toLocaleDateString();

    // The structure seems to be in list items or divs. 
    // Based on typical scraping, let's try to target the ranking items.
    // I'll look for elements that contain numbers 1-12.
    $('ul.list li').each((i, el) => {
        const text = $(el).text().trim();
        // Match Rank, Name, and Content
        const match = text.match(/^(\d+)\s+([^\s]+)\s+([\s\S]+)$/);
        if (match) {
            const rank = match[1];
            const jpName = match[2];
            const content = match[3];
            
            horoscopeData.push({
                rank,
                jpName,
                ...zodiacMap[jpName],
                content
            });
        }
    });

    // Fallback if the selector is different (Asahi site often changes)
    if (horoscopeData.length === 0) {
        // Try another approach: finding the sign names directly
        Object.keys(zodiacMap).forEach(jpName => {
            const element = $(`li:contains("${jpName}")`);
            if (element.length > 0) {
                const text = element.text().trim();
                const rankMatch = text.match(/^(\d+)/);
                horoscopeData.push({
                    rank: rankMatch ? rankMatch[1] : '?',
                    jpName,
                    ...zodiacMap[jpName],
                    content: text.replace(/^\d+\s+[^\s]+\s+/, '')
                });
            }
        });
    }

    res.json({
      date: dateText,
      horoscope: horoscopeData.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
