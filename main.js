document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('image-upload-input');
    const analysisForm = document.getElementById('analysis-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultDisplay = document.getElementById('result-display');

    imageUploadInput.addEventListener('change', async (event) => {
        analysisForm.innerHTML = '';
        const files = event.target.files;

        for (const file of files) {
            const stockItem = document.createElement('div');
            stockItem.classList.add('stock-item');

            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('image-preview');
                stockItem.appendChild(img);

                const stockNameInput = document.createElement('input');
                stockNameInput.type = 'text';
                stockNameInput.classList.add('stock-name-input');
                stockNameInput.placeholder = '종목명 인식 중...';
                stockItem.appendChild(stockNameInput);

                analysisForm.appendChild(stockItem);

                const statusDiv = document.createElement('div');
                statusDiv.classList.add('ocr-status');
                stockItem.appendChild(statusDiv);

                try {
                    const { data: { text } } = await Tesseract.recognize(
                        e.target.result,
                        'eng+kor',
                        {
                            logger: m => {
                                statusDiv.innerHTML = `${m.status}: ${(m.progress * 100).toFixed(0)}%`;
                            }
                        }
                    );
                    const lines = text.split('\n');
                    const stockName = lines[0] || '인식 실패';
                    stockNameInput.value = stockName;
                    statusDiv.innerHTML = '종목명 인식 완료';
                } catch (error) {
                    console.error('OCR Error:', error);
                    stockNameInput.placeholder = '인식 실패';
                    statusDiv.innerHTML = '오류 발생';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    const getStockDataFromDOM = () => {
        const stockItems = document.querySelectorAll('.stock-item');
        if (stockItems.length === 0) {
            return null;
        }

        const stocks = [];
        stockItems.forEach((item) => {
            const stockName = item.querySelector('.stock-name-input').value || '이름 없는 종목';
            stocks.push({
                name: stockName,
            });
        });
        return stocks;
    };

    const showLoading = (isLoading) => {
        if (isLoading) {
            analyzeBtn.disabled = true;
            resultDisplay.innerHTML = '<p>차트를 분석중입니다...</p>';
        } else {
            analyzeBtn.disabled = false;
            resultDisplay.innerHTML = '';
        }
    };

    const displayResults = (stocks) => {
        if (!stocks || stocks.length === 0) {
            resultDisplay.innerHTML = '<h2>분석 결과</h2><p>분석 결과가 없습니다.</p>';
            return;
        }

        resultDisplay.innerHTML = '<h2>분석 결과</h2>';
        stocks.forEach((stock, index) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            const scorePercentage = (stock.score * 100).toFixed(2);

            resultItem.innerHTML = `
                <h3>${index + 1}위: ${stock.name}</h3>
                <p><b>현재가:</b> ${stock.currentPrice}원</p>
                <p><b>신뢰도:</b> ${scorePercentage}%</p>
                <p><b>선정 이유:</b> ${stock.reason}</p>
                <div class="technical-indicators">
                    <h4>기술적 지표:</h4>
                    <p>5일 이동평균: ${stock.technicalIndicators.movingAverage}</p>
                    <p>RSI: ${stock.technicalIndicators.rsi}</p>
                    <p>MACD 신호: ${stock.technicalIndicators.macd.signal}</p>
                    <p>MACD 히스토그램: ${stock.technicalIndicators.macd.histogram}</p>
                </div>
            `;
            resultDisplay.appendChild(resultItem);
        });
    };

    const analyzeStocks = async (stocks) => {
        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stocks }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analyzedStocks = await response.json();
            return analyzedStocks;
        } catch (error) {
            console.error("Error analyzing stocks:", error);
            resultDisplay.innerHTML = `<p>분석 중 오류가 발생했습니다: ${error.message}</p>`;
            return [];
        }
    };

    const handleAnalysis = async () => {
        const stocks = getStockDataFromDOM();
        if (!stocks) {
            resultDisplay.innerHTML = '<p>분석할 이미지를 먼저 올려주세요.</p>';
            return;
        }

        showLoading(true);
        const analyzedStocks = await analyzeStocks(stocks);
        showLoading(false);
        displayResults(analyzedStocks);
    };

    analyzeBtn.addEventListener('click', handleAnalysis);
});
