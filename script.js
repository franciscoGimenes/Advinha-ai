
let secretNum = Math.floor(Math.random()* (99 - 10 + 1)+ 10)  
// para testar o numero
console.log('numero secreto:', secretNum );

// cria um objeto, com uma propiedade que cria um array com 6 linhas vazias, o metodo "map" faz com que ele passe por casda linha e crie um array com 2 colunas, preenchidads por nada  
const state = {
    secret: String(secretNum),
  grid: Array(5)
    .fill()
    .map(() => Array(2).fill('')),
  currentRow: 0,
  currentCol: 0,
};

//desenha o grid
function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 2; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 2) {
        const num = getCurrentNum(); 
          revealNum(num);
          state.currentRow++;
          state.currentCol = 0;
      }
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentNum() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] == letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] == letter) {
      result++;
    }
  }
  return result;
}

function revealNum(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 2; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );//pegar quantas vezes o numero q vc colocou aparece no numero secreta
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);//pegar quantas vezes o numero q vc colocou aparece no numero q vc achou
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter == state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret == guess;
  const isGameOver = state.currentRow == 4;

  setTimeout(() => {
    console.log(state.currentRow)
    if (isWinner) {
      alert('Parabens!');
    } else if (isGameOver) {
      alert(`Mais sorte na próxima, o número era: ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length == 1 && key.match(/[0-9]/);
}

function addLetter(letter) {
  if (state.currentCol == 2) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol == 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  registerKeyboardEvents();
}

startup();