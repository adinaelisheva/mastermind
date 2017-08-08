let currInd = 0;
let currRow;
let currScore;
let code = [];
let colors = ['one','two','three','four','five','six'];
let playing = true;

const setup = () => {
  const pbuttons = document.querySelectorAll('.piece.clickable');
  pbuttons.forEach((pb) => {
    pb.addEventListener('click', () => {
      if (!playing) { return; }
      handlePieceClick(pb);
    });
  });
  document.querySelector('.reset').addEventListener('click',() => {
    if (!playing) { return; }
    resetCurrentRow();
  });
  document.querySelector('.submit').addEventListener('click',() => {
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

const handlePieceClick = (button) => {
  const color = button.classList[button.classList.length - 1];
  const pieces = currRow.querySelectorAll('.piece');
  pieces[currInd].className = `piece ${color}`;
  currInd = (currInd + 1) % 4;
  pieces[currInd].classList.add('current');
};

const resetCurrentRow = () => {
  const pieces = currRow.querySelectorAll('.piece');
  pieces.forEach((p) => {
    p.className = 'piece';
  });
  currInd = 0;
  pieces[0].classList.add('current');
};

const isCurrentRowComplete = () => {
  let isComplete = true;
  currRow.querySelectorAll('.piece').forEach((p) => {
    const color = p.className.replace('current','').replace('piece','').replace(' ','');
    if(!color.length) {
      // this piece doesn't have a color class
      isComplete = false;
    }
  });
  return isComplete;
}

const submitCurrentRow = () => {
  if (!isCurrentRowComplete()) {
    alert('Current row incomplete!');
    return;
  }
  const pieces = currRow.querySelectorAll('.piece');
  pieces.forEach((p) => {
    p.classList.remove('current');
  });
  const guess = [];
  pieces.forEach((p) => {
    guess.push(p.classList[p.classList.length - 1]);
  })
  scoreGuess(guess);
}

const addNewRow = () => {
  const board = document.querySelector('#board');
  const container = document.createElement('div');
  container.className = 'rowholder';
  const row = document.createElement('div');
  row.className = 'row';
  for(let i = 0; i < 4; i++) {
    let piece = document.createElement('div');
    piece.className = 'piece';
    if(i === 0) {
      piece.classList.add('current');
    }
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
};

const endGame = () => {
  playing = false;
  document.title = "Online Mastermind - You Win!"
  document.querySelectorAll('.clickable').forEach((b) => {
    b.classList.remove('clickable');
  });
}

const scoreGuess = (guess) => {
  if (guess.join('') === code.join('')) {
    alert(`Correct! You Win!\nScore: ${document.querySelector('#board').childElementCount}`);
    const star = document.createElement('div');
    star.id = 'star';
    star.innerHTML = '&#x263a;';
    currScore.appendChild(star);
    endGame();
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
