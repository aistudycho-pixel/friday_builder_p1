const numberContainer = document.querySelector('.number-container');
const generateBtn = document.getElementById('generate-btn');

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

generateBtn.addEventListener('click', generateNumbers);

generateNumbers();
