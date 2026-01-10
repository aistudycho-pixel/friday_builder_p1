const numberContainer = document.querySelector('.number-container');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');

function generateNumbers() {
  numberContainer.innerHTML = '';
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  for (const number of numbers) {
    const circle = document.createElement('div');
    circle.classList.add('number');
    circle.textContent = number;
    numberContainer.appendChild(circle);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark-mode');
  } else {
    localStorage.removeItem('theme');
  }
}

if (localStorage.getItem('theme') === 'dark-mode') {
  document.body.classList.add('dark-mode');
}

generateBtn.addEventListener('click', generateNumbers);
themeToggle.addEventListener('click', toggleTheme);

generateNumbers();
