// -------------------------------------
// MAIN CODE WITH NO FUNCTION 
const tileState = {
    empty: 0,
    red: 1,
    yellow: 2
};

const winResult = {
    inPlay: 0,
    tie: 1,
    red: 2,
    yellow: 3
}

const numRows = 6;
const numCols = 7;
let gameTurn = tileState.red;

// initialize gameBoard
let gameBoard = new Array(numRows);
for(let i = 0; i < numRows; ++i)
{
    gameBoard[i] = new Array(numCols).fill(tileState.empty);
}

// add the board tiles
for(let i = 0; i < numRows * numCols; ++i)
{
    $("#gameboard").append(`<div class="tile" data-col=${i % numCols} data-row=${Math.floor(i / numCols)}>
                                <div class="tile-hole"></div>
                            </div>`);
}

// add the invisible row on the top
for(let i = 0; i < numCols; ++i)
{
    $("#place-row").append(`<div class="tile" data-col=${i}><div class="place-hole"></div></div>`)
}
// -------------------------------------
function getLowestEmptyHole(board, col) {
    /*
        Returns the rowNumber of the lowest empty hole in the board
        Returns -1 if there is no empty hole in this column
    */
    let row = numRows - 1;
    while(row >= 0 && board[row][col] !== tileState.empty)
    {
        row--;
    }
    return row;
}

function turnStateToColor(turn) {
    if(turn === tileState.red)
        return "red";
    if(turn === tileState.yellow)
        return "yellow";
}

function placePiece(board, col, turn) {

    let row = getLowestEmptyHole(board, col);
    if(row === -1) return -1;
    board[row][col] = turn;
    let selectedHole = $(`[data-row=${row}][data-col=${col}][class="tile"]`).find('.tile-hole');
    selectedHole.addClass(turnStateToColor(turn));
    return 0;
}

function switchTurnState(turn) {
    if(turn === tileState.yellow)
        return tileState.red;
    if(turn === tileState.red)
        return tileState.yellow;
}

function isOutOfBounds(gameboard, row, col) {
    if(row >= numRows || row < 0) return true;
    if(col >= numCols || col < 0) return true;
    return false;
}

function checkWin(gameBoard, row, col) {
    row = parseInt(row);
    col = parseInt(col);
    // check if there is a tie
    function isTie() {
        let totalTiles = 0;
        for(let r = 0; r < numRows; r++)
        {
            for(let c = 0; c < numCols; c++)
            {
                if(gameBoard[r][c] === tileState.empty)
                {
                    return false;
                }
            }
        }
        return true;
    }
    function checkDirection(rDelta, cDelta) {
        let numInARow = 0;
        let curRow = row;
        let curCol = col;
        let curColor = gameBoard[row][col];
        // go one way
        while(!(isOutOfBounds(gameBoard, curRow, curCol) || gameBoard[curRow][curCol] !== curColor))
        {
            curRow += rDelta;
            curCol += cDelta;
            numInARow++;
        }
        // go the other way
        curRow = row - rDelta;
        curCol = col - cDelta;
        while(!(isOutOfBounds(gameBoard, curRow, curCol) || gameBoard[curRow][curCol] !== curColor))
        {
            curRow -= rDelta;
            curCol -= cDelta;
            numInARow++;
        }
        if(numInARow >= 4) return true;
        return false;
    }

    if(checkDirection(0, 1) || checkDirection(1, 1) || checkDirection(1, 0) || checkDirection(1, -1))
    {
        let color = gameBoard[row][col];
        if(color === tileState.red)
            return winResult.red;
        return winResult.yellow;
    }

    if(isTie()) {
        return winResult.tie;
    }

    return winResult.inPlay;
}
// add event listeners for hovering over the columns
$(".tile").on("mouseenter", (event) => {
    let selectedCol = $(event.currentTarget).attr('data-col');
    let turnStateColor = turnStateToColor(gameTurn);
    $(`[data-col=${selectedCol}][class="tile"]`).find(".place-hole").addClass(`${turnStateColor} place-hole-on`);
});
$(".tile").on("mouseleave", (event) => {
    let selectedCol = $(event.currentTarget).attr('data-col');
    let turnStateColor = turnStateToColor(gameTurn);
    $(`[data-col=${selectedCol}][class="tile"]`).find(".place-hole").removeClass(`${turnStateColor} place-hole-on`);
});


// add event on mouseclick
$(".tile").on("mousedown", (event) => {
    /*
     * Step 1: Place the correct piece in the position
     * Step 2: Switch the player turn
     * Step 3: Check if a player has won
     */

    let selectedTile = $(event.currentTarget);
    let selectedCol = selectedTile.attr("data-col");
    let selectedRow = selectedTile.attr("data-row");
    let toPlaceRow = getLowestEmptyHole(gameBoard, selectedCol);

    if(placePiece(gameBoard, selectedCol, gameTurn) < 0) return;

    let turnStateColor = turnStateToColor(gameTurn);
    let selectedPlaceHole = $(`[data-col=${selectedCol}][class="tile"]`).find(".place-hole");
    selectedPlaceHole.removeClass(turnStateColor);
    gameTurn = switchTurnState(gameTurn);
    turnStateColor = turnStateToColor(gameTurn);
    selectedPlaceHole.addClass(turnStateColor)

    let winState = checkWin(gameBoard, toPlaceRow, selectedCol);
    let toAdd = $("h1")
    if (winState === winResult.tie)
    {
        toAdd.text("It's a tie")
    }
    else if (winState === winResult.red)
    {
        toAdd.text("Red wins")
    }
    else if (winState === winResult.yellow)
    {
        toAdd.text("Yellow wins")
    }
});