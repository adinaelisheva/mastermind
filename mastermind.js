let currInd = 0;
let currRow;
let currScore;
let code = [];
let colors = ['one','two','three','four','five','six'];
let playing = true;
let resetButton;
let submitButton;

function setup(){
  const pbuttons = document.querySelectorAll('.piece.clickable');
  pbuttons.forEach((pb) => {
    pb.addEventListener('click', () => {
      if (!playing) { return; }
      handlePieceClick(pb);
    });
  });
  document.querySelector('.giveup').addEventListener('click',() => {
    giveUp();
  });
  resetButton = document.querySelector('.reset');
  resetButton.addEventListener('click',() => {
    if (!playing) { return; }
    resetCurrentRow();
  });
  submitButton = document.querySelector('.submit');
  submitButton.addEventListener('click',() => {
    if (!playing) { return; }
    submitCurrentRow();
  });
  addNewRow();

  //generate code
  for(let i = 0; i < 4; i++) {
    let c = Math.floor(Math.random() * 6);
    code.push(colors[c])
  }

};

function handlePieceClick(button){
  const color = button.classList[button.classList.length - 1];
  addPieceByColor(color);
}

function updateButtonDisabledState() {
  const numFilled = countCurrRowFilled();
  if (numFilled === 0) {
    resetButton.classList.add('disabled');
  } else {
    resetButton.classList.remove('disabled');
  }
  if (numFilled < 4) {
    submitButton.classList.add('disabled');
  } else {
    submitButton.classList.remove('disabled');
  }
}

function addPieceByColor(color){
  const pieces = currRow.querySelectorAll('.piece');
  clearPieceColor(pieces[currInd]);
  pieces[currInd].classList.add(color);
  pieces[currInd].setAttribute('color', color);
  selectIndex(currInd + 1);
  updateButtonDisabledState();
};

function selectIndex(index) {
  const pieces = currRow.querySelectorAll('.piece');
  pieces[currInd].classList.remove('current');
  currInd = index % 4;
  pieces[currInd].classList.add('current');
}

function clearPieceColor(p) {
  colors.forEach((c) => {
    p.classList.remove(c);
  });
}

function resetCurrentRow(){
  const pieces = currRow.querySelectorAll('.piece');
  pieces.forEach((p) => {
    clearPieceColor(p);
  });
  selectIndex(0);
  updateButtonDisabledState();
};

function countCurrRowFilled(){
  let curRowFilled = 0;
  currRow.querySelectorAll('.piece').forEach((p) => {
    const color = p.className
        .replace('current','')
        .replace('clickable','')
        .replace('piece','')
        .trim();
    if(color.length) {
      // this piece has a color class
      curRowFilled++;
    }
  });
  return curRowFilled;
}

function submitCurrentRow(){
  if (countCurrRowFilled() < 4) {
    alert('Current row incomplete!');
    return;
  }
  const pieces = currRow.querySelectorAll('.piece');
  pieces.forEach((p) => {
    p.classList.remove('current');
  });
  const guess = [];
  pieces.forEach((p) => {
    guess.push(p.getAttribute('color'));
  });
  scoreGuess(guess);
}

function addNewRow(){
  if (currRow) {
    currRow.querySelectorAll('.piece.clickable').forEach((p) => {
      p.classList.remove('clickable');
      p.classList.add('unclickable');
    });
  }
  const board = document.querySelector('#board');
  const container = document.createElement('div');
  container.className = 'rowholder';
  const row = document.createElement('div');
  row.className = 'row';
  for(let i = 0; i < 4; i++) {
    let piece = document.createElement('div');
    piece.className = 'piece clickable';
    if(i === 0) {
      piece.classList.add('current');
    }
    piece.addEventListener('click', () => {
      selectIndex(i);
    });
    row.appendChild(piece);
  }

  const score = document.createElement('div');
  score.className = 'score';

  container.appendChild(row);
  container.appendChild(score);
  board.appendChild(container);
  
  currInd = 0;
  currRow = row;
  currScore = score;

  board.scrollTop = board.scrollHeight;
  updateButtonDisabledState();
};

function giveUp(){
  addNewRow();
  for(let i = 0; i < 4; i++) {
    addPieceByColor(code[i]);
  }
  alert(`You gave up! The correct answer is now shown.`);
  endGame();
}

function win(){
  document.title = "Online Mastermind - You Win!"
  alert(`Correct! You Win!\nScore: ${document.querySelector('#board').childElementCount}`);
  const star = document.createElement('div');
  star.id = 'star';
  star.innerHTML = '&#x263a;';
  currScore.appendChild(star);
  endGame();
}

function endGame(){
  playing = false;
  document.querySelectorAll('.clickable').forEach((b) => {
    b.classList.remove('clickable');
    b.classList.add('unclickable');
  });
}

function scoreGuess(guess){
  if (guess.join('') === code.join('')) {
    win();
    return;
  }
  //score
  let scores = [];
  let usedCode = {};
  let usedGuess = {};
  //first, find the black pegs
  for(let i = 0; i < 4; i++) {
    if(guess[i] === code[i]) {
      scores.push('black border');
      usedCode[i] = true;
      usedGuess[i] = true;
    } 
  }
  //now, find the white pegs - unused code pieces that match
  //unused guess pieces
  for(let i = 0; i < 4; i++) {
    if(usedGuess[i]) { continue; }
    for(let j = 0; j < 4; j++) {
      if(usedCode[j]) { continue; }
      if(code[j] === guess[i]) {
        usedCode[j] = true;
        scores.push('white border');
        break;
      }
    }
  }

  //add pegs
  let s = 0;
  for(let i = 0; i < 2; i++) {
    const scoreRow = document.createElement('div');
    scoreRow.className = 'scorerow';
    for(let j = 0; j < 2; j++) {
      const peg = document.createElement('div');
      const score = scores[s] ? scores[s] : '';
      s++;
      peg.className = `peg ${score}`;
      scoreRow.appendChild(peg);
    }
    currScore.appendChild(scoreRow);
  }
  addNewRow();
}

window.onload = setup;
