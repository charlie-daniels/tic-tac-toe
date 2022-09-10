const displayController = (function (doc) {
  const _clear = () => {
    const tiles = doc.querySelectorAll(`#board .tile`);
    tiles.forEach(tile => tile.textContent = '');
  }
  const _addFade = (elem) => {
    elem.style.display = 'inline';
    elem.classList.add('fade');
    elem.addEventListener('animationend', function(e) {
      e.target.style.display = 'none';
      e.target.classList.remove('fade');
    });
  }
  const _toggleVisible = (elem) => {
    if (elem.classList.contains('hidden')) {
      elem.classList.remove('hidden');
    } else {
      elem.classList.add('hidden');
    }
  }
  const _addTileListeners = () => {
    const tiles = doc.querySelectorAll(`#board .tile`);
    tiles.forEach(t => {
      t.addEventListener('click', (e) => gameBoard.playRound(e.target.getAttribute('data-index')));
    });
  }
  const _addMenuListeners = () => {
    const buttonStart = doc.querySelector('#start-game');
    buttonStart.addEventListener('click', () => {
      const menu = doc.querySelector('#menu');
      menu.classList.add('hidden');
    });
  }
  
  const displayResult = (result) => {
    const message = doc.querySelector('#message');
    message.textContent = result;
    const resultMessage = doc.querySelector('#result-message');
    _toggleVisible(resultMessage);
    _addFade(resultMessage);
    _clear();
  }
  const updateBoard = (move, player) => {
    const tile = doc.querySelector(`#board>[data-index='${move}']`);
    tile.textContent = player.getCharacter();
  }
  const init = () => {
    _addTileListeners();
    _addMenuListeners();
  }
  return {
    displayResult,
    updateBoard,
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
    console.log(result);
    if (result === true) {
      displayController.displayResult(`${_currentPlayer.playerName} wins!`);
      _currentPlayer.win();
      newGame(_player1, _player2);
      return;
    } else if (result === null) {
      displayController.displayResult('Tie!');
      newGame(_player1, _player2);
    } else {
      _currentPlayer = _switchPlayer(_currentPlayer);
      _turn++;
    }
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
  let isCurrentPlayer = false;
  let playerName = name;

  const setCharacter = (character) => _character = character;
  const getCharacter = () => _character;
  const getTotalScore = () => _totalScore;
  const win = () => _totalScore++;

  return {
    playerName,
    isCurrentPlayer,
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

function newGame() {
  let player1 = Player('Jack', 'X');
  let player2 = Player('Jill', 'O');
  gameBoard.newGame(player1, player2);
  displayController.init();
}
newGame();