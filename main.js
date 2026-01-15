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
                <p><b>신뢰도:</b> ${scorePercentage}%</p>
                <p><b>선정 이유:</b> ${stock.reason}</p>
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
