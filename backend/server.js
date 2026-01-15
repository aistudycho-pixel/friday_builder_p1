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

const getHistoricalData = async (stockCode) => {
    const url = `https://finance.naver.com/item/sise_day.naver?code=${stockCode}`;
    const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' } // Add User-Agent to prevent blocking
    });
    const $ = cheerio.load(data);
    const prices = [];
    $('table.type2 tr[onmouseover="mouseOver(this)"]').each((i, el) => {
        if (i < 10) { // Get last 10 days of data
            const tds = $(el).find('td');
            const closingPrice = tds.eq(1).text().replace(/,/g, '');
            if (closingPrice) {
                prices.push(parseFloat(closingPrice));
            }
        }
    });
    return prices;
};

const calculateSMA = (data, period) => {
    if (data.length < period) {
        return null;
    }
    const sum = data.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
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
            let analysis = {
                movingAverage: 'N/A',
                sma5: 'N/A',
                recommendation: 'N/A',
            };

            if (stockCode) {
                try {
                    const mainUrl = `https://finance.naver.com/item/main.naver?code=${stockCode}`;
                    const { data: mainData } = await axios.get(mainUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                    const $main = cheerio.load(mainData);
                    const priceText = $main('p.no_today span.blind').first().text();
                    currentPrice = parseFloat(priceText.replace(/,/g, ''));

                    const historicalData = await getHistoricalData(stockCode);
                    const sma5 = calculateSMA(historicalData, 5);
                    
                    if (sma5) {
                        analysis.sma5 = sma5.toFixed(2);
                        if (currentPrice > sma5) {
                            analysis.recommendation = '현재가가 5일 이동평균선 위에 있어 단기 상승 추세일 수 있습니다.';
                        } else if (currentPrice < sma5) {
                            analysis.recommendation = '현재가가 5일 이동평균선 아래에 있어 단기 하락 추세일 수 있습니다.';
                        } else {
                            analysis.recommendation = '현재가가 5일 이동평균선과 비슷합니다.';
                        }
                    }

                } catch (error) {
                    console.error(`Error processing data for ${stock.name}:`, error.message);
                }
            }

            return {
                ...stock,
                currentPrice: currentPrice,
                score: Math.random(),
                reason: analysis.recommendation || "데이터가 부족하여 분석할 수 없습니다.",
                technicalIndicators: {
                    movingAverage: analysis.sma5, // Use calculated SMA
                    rsi: (Math.random() * 70 + 30).toFixed(2), // Still fake
                    macd: { // Still fake
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
