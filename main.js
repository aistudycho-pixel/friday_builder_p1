const numberContainer = document.querySelector('.number-container');
const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function generateNumbers() {
  numberContainer.innerHTML = '';
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  for (const number of [...numbers].sort((a, b) => a - b)) {
    const circle = document.createElement('div');
    circle.classList.add('number');
    circle.textContent = number;
    numberContainer.appendChild(circle);
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

generateBtn.addEventListener('click', generateNumbers);
themeToggleBtn.addEventListener('click', toggleTheme);

// Generate initial numbers
generateNumbers();
