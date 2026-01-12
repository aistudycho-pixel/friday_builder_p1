document.addEventListener('DOMContentLoaded', () => {
    // Dinner Menu Selector Logic
    const menuDisplay = document.getElementById('menu-display');
    const selectMenuButton = document.getElementById('select-menu-btn');

    const dinnerOptions = [
        "김치찌개", "된장찌개", "제육볶음", "돈까스", "파스타",
        "초밥", "햄버거", "피자", "치킨", "떡볶이",
        "비빔밥", "불고기", "삼겹살", "갈비찜", "칼국수"
    ];

    selectMenuButton.addEventListener('click', () => {
        selectMenuButton.disabled = true; // Disable button during spin
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
            menuDisplay.innerHTML = `<p>고민중... <strong>${dinnerOptions[randomIndex]}</strong></p>`;
            spinCount++;
        }, 100); // Change menu every 100ms

        setTimeout(() => {
            clearInterval(spinInterval); // Stop spinning
            const finalRandomIndex = Math.floor(Math.random() * dinnerOptions.length);
            const selectedMenu = dinnerOptions[finalRandomIndex];
            menuDisplay.innerHTML = `<p>오늘의 메뉴는: <strong>${selectedMenu}</strong>!</p>`;
            selectMenuButton.disabled = false; // Enable button after selection
        }, 3000); // Spin for 3 seconds
    });
});
