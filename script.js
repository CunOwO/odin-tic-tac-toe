function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
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

    const playRound = (row, column) => {
        console.log(`Marking ${getActivePlayer().name}'s marker into row ${row}, column ${column}...`);
        board.placeMarker(row, column, getActivePlayer());

        // Check winner and win message

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
const game = GameController();
