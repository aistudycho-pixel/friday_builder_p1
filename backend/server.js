const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/api/analyze', (req, res) => {
  const stocks = req.body.stocks;
  console.log('Received stocks for analysis:', stocks);

  const reasons = [
      "정배열 초기 단계로, 상승 추세로의 전환이 기대됩니다.",
      "거래량이 급증하며 강한 매수세가 유입되었습니다.",
      "주요 저항선을 돌파하며 새로운 지지선을 형성했습니다.",
      "이동평균선이 골든크로스를 형성하며 긍정적인 신호를 보내고 있습니다.",
      "RSI 지표가 과매도 구간에서 벗어나 상승 동력을 얻고 있습니다."
  ];

  const analyzedStocks = stocks.map(stock => ({
      ...stock,
      score: Math.random(),
      reason: reasons[Math.floor(Math.random() * reasons.length)]
  }));

  analyzedStocks.sort((a, b) => b.score - a.score);

  res.json(analyzedStocks);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});