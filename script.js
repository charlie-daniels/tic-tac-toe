const displayController = (function (doc) {
  const _addTileListeners = (performClick) => {
    const tiles = doc.querySelectorAll(`#board .tile`);
    tiles.forEach(t => {
      t.addEventListener('click', (e) => performClick(e.target.getAttribute('data-index')));
    });
  }

  const updateBoard = (move, player) => {
    const tile = doc.querySelector(`#board>[data-index='${move}']`);
    tile.textContent = player;
  }
  const init = (performClick) => {
    _addTileListeners(performClick);
  }
  return {
    updateBoard,
    init
  }
})(document);

const gameBoard = (function () {
  let _board = [];
  let _currentPlayer = 'X'

  const _reset = () => {
    _board = new Array(9).fill('');
  }
  const _switchPlayer = (_currentPlayer) => {
    if (_currentPlayer === 'X') return 'O';
    return 'X';
  }
  const _isTileEmpty = (index) => {
    if (_board[index] !== 'X' || _board[index] !== 'O') return true;
    return false;
  }
  const _setTile = (tile, player) => {
    _board[tile] = player;
  }

  const playRound = (nextPlayerMove) => {
    if (_isTileEmpty(nextPlayerMove)) _setTile(nextPlayerMove, _currentPlayer);
    else return null; // Maybe add retry variable here?
    displayController.updateBoard(nextPlayerMove, _currentPlayer);
    // let result = _checkWinner();
    // if (result != null) return;
    _currentPlayer = _switchPlayer(_currentPlayer);
  }
  const newGame = (player1, player2) => {
    player1.reset();
    player2.reset();
    _reset();
    displayController.init(playRound);
  }

  return {
    playRound,
    newGame
  }
})();

const Player = () => {
  let _score = 0;
  let _totalScore = 0;
  
  const getScore = () => _score;
  const getTotalScore = () => _totalScore;
  const win = () => _score++;
  const reset = () => {
    _score = 0;
  }

  return {
    getScore,
    getTotalScore,
    win,
    reset
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
  let player1 = Player(); let player2 = Player();
  gameBoard.newGame(player1, player2);
}

newGame();