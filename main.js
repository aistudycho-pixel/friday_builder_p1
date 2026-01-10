document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Light Mode';
    } else {
        body.classList.remove('dark-mode');
        themeToggleButton.textContent = 'Dark Mode';
    }

    themeToggleButton.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
            themeToggleButton.textContent = 'Dark Mode';
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            themeToggleButton.textContent = 'Light Mode';
        }
    });

    // Dinner Menu Selector Logic
    const menuDisplay = document.getElementById('menu-display');
    const selectMenuButton = document.getElementById('select-menu-btn');

    const dinnerOptions = [
        "김치찌개", "된장찌개", "제육볶음", "돈까스", "파스타",
        "초밥", "햄버거", "피자", "치킨", "떡볶이",
        "비빔밥", "불고기", "삼겹살", "갈비찜", "칼국수"
    ];

    selectMenuButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
        const selectedMenu = dinnerOptions[randomIndex];
        menuDisplay.innerHTML = `<p>오늘의 메뉴는: <strong>${selectedMenu}</strong>!</p>`;
    });
});
