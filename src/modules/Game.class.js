'use strict';

class Game {
  constructor(initialState) {
    this.defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState || JSON.parse(JSON.stringify(this.defaultState));
    this.score = 0;
    this.status = 'idle';
    this.rows = 4;
    this.cols = 4;
  }

  arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  move(direction) {
    const directions = {
      left: (row) => row,
      right: (row) => row.slice().reverse(),
      up: (col) => col,
      down: (col) => col.slice().reverse(),
    };

    const reverseDirections = {
      left: (row) => row,
      right: (row) => row.slice().reverse(),
      up: (col) => col,
      down: (col) => col.slice().reverse(),
    };

    let changeBoard = false;

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < this.rows; i++) {
        let newRow = directions[direction](this.board[i]).filter(
          (value) => value !== 0,
        );

        for (let j = 0; j < newRow.length - 1; j++) {
          if (newRow[j] === newRow[j + 1]) {
            newRow[j] *= 2;
            this.score += newRow[j];
            newRow[j + 1] = 0;
            changeBoard = true;
          }
        }

        newRow = newRow.filter((value) => value !== 0);

        while (newRow.length < this.rows) {
          newRow.push(0);
        }

        newRow = reverseDirections[direction](newRow);

        if (!this.arraysEqual(this.board[i], newRow)) {
          changeBoard = true;
        }

        this.board[i] = newRow;
      }
    } else {
      for (let col = 0; col < this.cols; col++) {
        let colData = this.board.map((row) => row[col]);

        colData = directions[direction](colData);

        let newCol = colData.filter((value) => value !== 0);

        for (let i = 0; i < newCol.length - 1; i++) {
          if (newCol[i] === newCol[i + 1]) {
            newCol[i] *= 2;
            this.score += newCol[i];
            newCol[i + 1] = 0;
            changeBoard = true;
          }
        }

        newCol = newCol.filter((value) => value !== 0);

        while (newCol.length < this.rows) {
          newCol.push(0);
        }

        newCol = reverseDirections[direction](newCol);

        if (
          !this.arraysEqual(
            this.board.map((row) => row[col]),
            newCol,
          )
        ) {
          changeBoard = true;
        }

        for (let row = 0; row < this.rows; row++) {
          this.board[row][col] = newCol[row];
        }
      }
    }

    if (this.status === 'playing' && changeBoard) {
      this.addRandomTile();
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.status === 'idle') {
      return 'idle';
    }

    if (this.checkWin()) {
      return 'win';
    }

    if (this.checkLose()) {
      return 'lose';
    }

    return 'playing';
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  start() {
    this.board = JSON.parse(JSON.stringify(this.defaultState));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  restart() {
    return this.start();
  }
}

module.exports = Game;
