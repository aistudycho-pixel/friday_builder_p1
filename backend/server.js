const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
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
        headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);
    const prices = [];
    $('table.type2 tr[onmouseover="mouseOver(this)"]').each((i, el) => {
        if (i < 10) {
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

const generateAIComment = (stockName, currentPrice, sma5) => {
    if (!currentPrice || !sma5) {
        return "데이터가 부족하여 상세 분석을 생성할 수 없습니다.";
    }

    const price = parseFloat(currentPrice);
    const sma = parseFloat(sma5);
    const diff = price - sma;
    const diffPercent = (diff / sma) * 100;

    let analysis = `**${stockName}에 대한 AI 분석:**\n\n`;
    analysis += `현재 주가는 ${price.toLocaleString()}원이며, 5일 이동평균선은 ${sma.toLocaleString()}원입니다. `;

    if (diff > 0) {
        analysis += `현재 주가가 5일 이동평균선보다 ${diff.toLocaleString()}원 (${diffPercent.toFixed(2)}%) 높아, 단기적으로 강한 상승 모멘텀을 보여주고 있습니다. `;
        if (diffPercent > 3) {
            analysis += "최근 매수세가 강하게 유입된 것으로 보이며, 단기 과열 가능성도 염두에 두어야 합니다.";
        } else {
            analysis += "안정적인 상승 추세를 유지하고 있는 것으로 판단됩니다.";
        }
    } else if (diff < 0) {
        analysis += `현재 주가가 5일 이동평균선보다 ${Math.abs(diff).toLocaleString()}원 (${Math.abs(diffPercent).toFixed(2)}%) 낮아, 단기적인 조정 국면에 있는 것으로 보입니다. `;
        if (diffPercent < -3) {
            analysis += "최근 매도 압력이 강했던 것으로 보이며, 기술적 반등 시점을 신중하게 관찰할 필요가 있습니다.";
        } else {
            analysis += "다만 하락폭이 크지 않아, 곧 지지선을 찾고 반등을 시도할 가능성도 있습니다.";
        }
    } else {
        analysis += "현재 주가가 5일 이동평균선과 거의 동일한 수준으로, 단기적인 방향성을 탐색하는 구간으로 보입니다.";
    }

    return analysis;
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
            let sma5 = null;
            let recommendation = 'N/A';

            if (stockCode) {
                try {
                    const mainUrl = `https://finance.naver.com/item/main.naver?code=${stockCode}`;
                    const { data: mainData } = await axios.get(mainUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                    const $main = cheerio.load(mainData);
                    const priceText = $main('p.no_today span.blind').first().text();
                    currentPrice = parseFloat(priceText.replace(/,/g, ''));

                    const historicalData = await getHistoricalData(stockCode);
                    sma5 = calculateSMA(historicalData, 5);
                    
                    recommendation = generateAIComment(stock.name, currentPrice, sma5);

                } catch (error) {
                    console.error(`Error processing data for ${stock.name}:`, error.message);
                    recommendation = "데이터를 가져오는 중 오류가 발생했습니다.";
                }
            } else {
                recommendation = "분석할 수 없는 종목입니다. 종목명을 확인해주세요.";
            }

            return {
                ...stock,
                currentPrice: currentPrice,
                score: Math.random(),
                reason: recommendation,
                technicalIndicators: {
                    movingAverage: sma5 ? sma5.toFixed(2) : 'N/A',
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