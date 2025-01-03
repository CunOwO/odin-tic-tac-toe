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
        const boardCells = board.getBoard();
        for (let i = 0; i < 3; i++) {
            if (boardCells[i][0].getValue() === boardCells[i][1].getValue() && boardCells[i][0].getValue() === boardCells[i][2].getValue() && boardCells[i][0].getValue() != "") {
                return true;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (boardCells[0][i].getValue() === boardCells[1][i].getValue() && boardCells[0][i].getValue() === boardCells[2][i].getValue() && boardCells[0][i].getValue() != "") {
                return true;
            }
        }

        if (boardCells[0][0].getValue() === boardCells[1][1].getValue() && boardCells[0][0].getValue() === boardCells[2][2].getValue() && boardCells[0][0].getValue() != "") {
            return true;
        }

        if (boardCells[0][2].getValue() === boardCells[1][1].getValue() && boardCells[0][2].getValue() === boardCells[2][0].getValue() && boardCells[0][2].getValue() != "") {
            return true;
        }

        return false;
    };

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().name}'s marker into row ${row}, column ${column}...`);
        board.placeMarker(row, column, getActivePlayer());

        // Check winner and win message
        if (checkWinner()) {
            console.log("Game over");
            return;
        }

        const boardCells = board.getBoard();
        if (!checkWinner()) {
            let isGameDraw = boardCells.every((row) => row.every((cell) => cell.getValue() != ""));
            if (isGameDraw) {
                console.log("Game over too");
                return;
            }
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, indexRow) => {
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
        
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();