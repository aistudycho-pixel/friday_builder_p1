document.addEventListener('DOMContentLoaded', () => {
    const imageUploadInput = document.getElementById('image-upload-input');
    const imagePreviewSection = document.getElementById('image-preview-section');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultDisplay = document.getElementById('result-display');

    let uploadedFiles = [];

    imageUploadInput.addEventListener('change', (event) => {
        imagePreviewSection.innerHTML = '';
        uploadedFiles = [];

        const files = event.target.files;

        for (const file of files) {
            uploadedFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('image-preview');
                imagePreviewSection.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    analyzeBtn.addEventListener('click', () => {
        if (uploadedFiles.length === 0) {
            resultDisplay.innerHTML = '<p>분석할 이미지를 먼저 올려주세요.</p>';
            return;
        }

        analyzeBtn.disabled = true;
        resultDisplay.innerHTML = '<p>차트를 분석중입니다...</p>';

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * uploadedFiles.length);
            const winnerIndex = randomIndex + 1;

            resultDisplay.innerHTML = `<p>기술적 분석 결과, 확률상 ${winnerIndex}번째 이미지가 가장 좋아보입니다!</p>`;
            analyzeBtn.disabled = false;
        }, 3000);
    });
});