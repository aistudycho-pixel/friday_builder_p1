document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark-mode') {
        body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Light Mode';
    } else {
        // Default to light mode or if savedTheme is 'light-mode'
        body.classList.remove('dark-mode'); // Ensure no dark mode class
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
});