const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const stockCodeMap = {
    '삼성전자': '005930',
    'SK하이닉스': '000660',
    'LG에너지솔루션': '373220',
    '현대차': '005380',
};

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/analyze', async (req, res) => {
    const stocks = req.body.stocks;
    console.log('Received stocks for analysis:', stocks);

    try {
        const analyzedStocks = await Promise.all(stocks.map(async (stock) => {
            const stockCode = stockCodeMap[stock.name.trim()];
            let currentPrice = 'N/A';

            if (stockCode) {
                try {
                    const url = `https://finance.naver.com/item/main.naver?code=${stockCode}`;
                    const { data } = await axios.get(url);
                    const $ = cheerio.load(data);
                    const priceText = $('p.no_today span.blind').first().text();
                    currentPrice = priceText.replace(/,/g, '');
                } catch (error) {
                    console.error(`Error scraping data for ${stock.name}:`, error.message);
                }
            }

            const reasons = [
                "정배열 초기 단계로, 상승 추세로의 전환이 기대됩니다.",
                "거래량이 급증하며 강한 매수세가 유입되었습니다.",
                "주요 저항선을 돌파하며 새로운 지지선을 형성했습니다.",
                "이동평균선이 골든크로스를 형성하며 긍정적인 신호를 보내고 있습니다.",
                "RSI 지표가 과매도 구간에서 벗어나 상승 동력을 얻고 있습니다."
            ];

            return {
                ...stock,
                currentPrice,
                score: Math.random(),
                reason: reasons[Math.floor(Math.random() * reasons.length)],
                technicalIndicators: {
                    movingAverage: (Math.random() * 100).toFixed(2),
                    rsi: (Math.random() * 70 + 30).toFixed(2),
                    macd: {
                        signal: (Math.random() * 2 - 1).toFixed(2),
                        histogram: (Math.random() * 0.5 - 0.25).toFixed(2),
                    }
                }
            };
        }));

        analyzedStocks.sort((a, b) => b.score - a.score);
        res.json(analyzedStocks);

    } catch (error) {
        console.error('Error in /api/analyze:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});