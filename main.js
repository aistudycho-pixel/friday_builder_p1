document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('image-upload-input');
    const analysisForm = document.getElementById('analysis-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultDisplay = document.getElementById('result-display');

    imageUploadInput.addEventListener('change', (event) => {
        analysisForm.innerHTML = '';
        const files = event.target.files;

        for (const file of files) {
            const stockItem = document.createElement('div');
            stockItem.classList.add('stock-item');

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('image-preview');
                stockItem.appendChild(img);
            };
            reader.readAsDataURL(file);

            const stockNameInput = document.createElement('input');
            stockNameInput.type = 'text';
            stockNameInput.classList.add('stock-name-input');
            stockNameInput.placeholder = '종목명을 입력하세요';
            stockItem.appendChild(stockNameInput);

            analysisForm.appendChild(stockItem);
        }
    });

    const reasons = [
        "정배열 초기 단계로, 상승 추세로의 전환이 기대됩니다.",
        "거래량이 급증하며 강한 매수세가 유입되었습니다.",
        "주요 저항선을 돌파하며 새로운 지지선을 형성했습니다.",
        "이동평균선이 골든크로스를 형성하며 긍정적인 신호를 보내고 있습니다.",
        "RSI 지표가 과매도 구간에서 벗어나 상승 동력을 얻고 있습니다."
    ];

    analyzeBtn.addEventListener('click', () => {
        const stockItems = document.querySelectorAll('.stock-item');

        if (stockItems.length === 0) {
            resultDisplay.innerHTML = '<p>분석할 이미지를 먼저 올려주세요.</p>';
            return;
        }

        analyzeBtn.disabled = true;
        resultDisplay.innerHTML = '<p>차트를 분석중입니다...</p>';

        setTimeout(() => {
            const stocks = [];
            stockItems.forEach((item) => {
                const stockName = item.querySelector('.stock-name-input').value || '이름 없는 종목';
                stocks.push({
                    name: stockName,
                    score: Math.random()
                });
            });

            stocks.sort((a, b) => b.score - a.score);

            resultDisplay.innerHTML = '';

            stocks.forEach((stock, index) => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');

                const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

                resultItem.innerHTML = `
                    <h3>${index + 1}위: ${stock.name}</h3>
                    <p><b>선정 이유:</b> ${randomReason}</p>
                `;
                resultDisplay.appendChild(resultItem);
            });

            analyzeBtn.disabled = false;
        }, 3000);
    });
});
