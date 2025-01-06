function Gameboard() {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;  

    const placeMarker = (row, column, player) => {
        if (board[row][column].getValue() != "") {
            return;
        }

        board[row][column].addMarker(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, placeMarker, printBoard };
}

function Cell() {
    let value = "";

    const addMarker = (player) => {
        value = player.marker;
    };

    const getValue = () => value;

    return {
        addMarker,
        getValue
    };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            marker: "O"
        },
        {
            name: playerTwoName,
            marker: "X"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkWinner = () => {
        const boardRows = board.getBoard();
        for (let i = 0; i < 3; i++) {
            if (boardRows[i][0].getValue() === boardRows[i][1].getValue() && boardRows[i][0].getValue() === boardRows[i][2].getValue() && boardRows[i][0].getValue() != "") {
                return true;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (boardRows[0][i].getValue() === boardRows[1][i].getValue() && boardRows[0][i].getValue() === boardRows[2][i].getValue() && boardRows[0][i].getValue() != "") {
                return true;
            }
        }

        if (boardRows[0][0].getValue() === boardRows[1][1].getValue() && boardRows[0][0].getValue() === boardRows[2][2].getValue() && boardRows[0][0].getValue() != "") {
            return true;
        }

        if (boardRows[0][2].getValue() === boardRows[1][1].getValue() && boardRows[0][2].getValue() === boardRows[2][0].getValue() && boardRows[0][2].getValue() != "") {
            return true;
        }

        return false;
    };

    const checkDraw = () => {
        return board.getBoard().every((row) => row.every((cell) => cell.getValue() != ""));
    };

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().name}'s marker into row ${row}, column ${column}...`);
        board.placeMarker(row, column, getActivePlayer());

        if (checkWinner()) {
            console.log(`${activePlayer.name} won!`);
            return;
        }
        
        if (checkDraw()) {     
            console.log("Draw!");
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        checkDraw,
        checkWinner
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    let isGameOver = false;

    const updateScreen = () => {
        const boardRows = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        boardRows.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                const cellButton = document.querySelector(`button[data-row="${indexRow}"][data-column="${indexColumn}"]`);
                cellButton.textContent = cell.getValue();
            });
        });
    }; 

    function clickHandlerBoard(e) {
        if (e.target.textContent != "") {
            return;
        }

        if (e.target.textContent === "" && isGameOver === true) {
            return;
        }

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();

        if (game.checkWinner()) {
            playerTurnDiv.textContent = `${game.getActivePlayer().name} won!`;
            isGameOver = true;
        }

        if (game.checkDraw()) {
            playerTurnDiv.textContent = "Draw!";
            isGameOver = true;
        }
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();