const displayController = (function (doc) {
  const _clear = () => {
    const tiles = doc.querySelectorAll('.tile');
    tiles.forEach(tile => tile.style.backgroundImage = 'none');
  }
  const _addFade = (elem) => {
    elem.classList.add('fade');
    _toggleVisible(elem);
    elem.addEventListener('animationend', function(e) {
      _clear();
      _toggleVisible(e.target);
      e.target.classList.remove('fade');
    }, { once: true });
  }
  const _toggleVisible = (elem) => {
    if (elem.classList.contains('hidden')) {
      elem.classList.remove('hidden');
    } else {
      elem.classList.add('hidden');
    }
  }
  const _addTileListeners = () => {
    const tiles = doc.querySelectorAll(`.tile`);
    tiles.forEach(t => {
      t.addEventListener('click', (e) => gameBoard.playRound(e.target.getAttribute('data-index')));
    });
  }
  const _setPlayerNames = (p1, p2) => {
    const playerNames = doc.querySelectorAll('.player .name');
    playerNames[0].textContent = p1.playerName;
    playerNames[1].textContent = p2.playerName;
  }
  
  const displayResult = (result) => {
    const message = doc.querySelector('#message');
    message.textContent = result;
    const resultMessage = doc.querySelector('#result-message');
    _addFade(resultMessage);
  }
  const updateBoard = (move, player) => {
    const tile = doc.querySelector(`[data-index='${move}']`);
    if (player.getCharacter() === 'X') {
      tile.style.backgroundImage = "url('img/x.svg')";
    } else {
      tile.style.backgroundImage = "url('img/o.svg')";
    }
  }
  const showCurrentPlayer = (p1, p2, current) => {
    const playerCharacters = doc.querySelectorAll('.player .character');
    console.log({p1, p2, current});
    if (current === p1) {
      playerCharacters[1].style.stroke = '#ee2087';
      playerCharacters[0].style.stroke = '#e9e5e5';
    } else {
      playerCharacters[0].style.stroke = '#ee2087';
      playerCharacters[1].style.stroke = '#e9e5e5';
    }
  }
  const updatePlayers = (p1, p2) => {
    const playerScores = doc.querySelectorAll('.player .score');
    playerScores[0].textContent = p1.getTotalScore();
    playerScores[1].textContent = p2.getTotalScore();
  }
  const init = (p1, p2) => {
    _addTileListeners();
    _setPlayerNames(p1, p2);
    const menu = doc.querySelector('#menu');
    _toggleVisible(menu);
  }
  return {
    displayResult,
    updateBoard,
    showCurrentPlayer,
    updatePlayers,
    init
  }
})(document);

const gameBoard = (function () {
  let _board = [];
  let _currentPlayer;
  let _turn;
  let _player1;
  let _player2;

  const _reset = () => {
    _turn = 0;
    _board = new Array(9).fill('');
  }
  const _switchPlayer = (_currentPlayer) => {
    if (_currentPlayer.getCharacter() === 'X') return _player2;
    return _player1;
  }
  const _isTileEmpty = (index) => {
    if (_board[index] === '') return true;
    return false;
  }
  const _setTile = (tile, player) => {
    _board[tile] = player;
  }
  const _convertBoard2D = () => {
    let board = [[],[],[]];
    _board.map((tile, i) => {
      let row = Math.floor(i / 3);
      if(tile === _currentPlayer) board[row].push(1)
      else board[row].push(0);
    })
    return board;
  }
  const _convertIndex2D = (index) => {
    return {
      x: index % 3,
      y: Math.floor(index / 3)
    }
  }
  const _checkWinner = (lastMove) => {
    const board2D = _convertBoard2D();
    const lastMoveIndex = _convertIndex2D(lastMove);
    
    // Check horizontal
    let totalX = 0;
    for (let i = 0; i < 3; i++) {
      if (board2D[lastMoveIndex.y][i] === 1) totalX++;
    }
    if (totalX === 3) return true;
    // Check horizontal
    let totalY = 0;
    for (let i = 0; i < 3; i++) {
      if (board2D[i][lastMoveIndex.x] === 1) totalY++;
    }
    if (totalY === 3) return true;
    // Check diagonal
    let totalXY = board2D[0][0] + board2D[1][1] + board2D[2][2];
    if (totalXY === 3) return true;
    let totalYX = board2D[0][2] + board2D[1][1] + board2D[2][0];
    if (totalYX === 3) return true;
    if (_turn === 8) return null; 
    return false;
  }

  const playRound = (nextPlayerMove) => {
    if (_isTileEmpty(nextPlayerMove)) _setTile(nextPlayerMove, _currentPlayer);
    else return;
    displayController.updateBoard(nextPlayerMove, _currentPlayer);
    const result = _checkWinner(nextPlayerMove);
    if (result === true) {
      displayController.displayResult(`${_currentPlayer.playerName} wins!`);
      _currentPlayer.win();
      displayController.updatePlayers(_player1, _player2, _currentPlayer);
      newGame(_player1, _player2);
    } else if (result === null) {
      displayController.displayResult('Tie!');
      newGame(_player1, _player2);
    } else {
      _currentPlayer = _switchPlayer(_currentPlayer);
      _turn++;
    }
    displayController.showCurrentPlayer(_player1, _player2, _currentPlayer);
  }
  const newGame = (player1, player2) => {
    _player1 = player1;
    _player2 = player2;
    _reset();
    _currentPlayer = player1;
  }

  return {
    playRound,
    newGame
  }
})();

const Player = (name, character) => {
  let _totalScore = 0;
  let _character = character;
  let playerName = name;

  const setCharacter = (character) => _character = character;
  const getCharacter = () => _character;
  const getTotalScore = () => _totalScore;
  const win = () => _totalScore++;

  return {
    playerName,
    setCharacter,
    getCharacter,
    getTotalScore,
    win
  };
} 

const Computer = () => {
  const logic = () => {
    // ai code
  }
  const protoPlayer = Player();
  return Object.assign({}, protoPlayer, logic)
}

function newGame(player1Name, player2Name) {
  let player1 = Player(player1Name, 'X');
  let player2 = Player(player2Name, 'O');
  gameBoard.newGame(player1, player2);
  displayController.init(player1, player2);
}

const playerForm = document.querySelector('#menu form');
playerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(playerForm);
  let p1 = formData.get('player-1');
  let p2 = formData.get('player-2');
  newGame(p1, p2);
});