const GameBoard = ({ gameBoard }) => {
    return (
        <div className="wordsearch__gameboard">
            {gameBoard.map((row, rowNum) => (
                <div
                    className="wordsearch-gameboard__row"
                    key={"wordsearch__gameboard-row-" + rowNum}
                >
                    {row.map((cell, cellNum) => (
                        <div
                            className="wordsearch-gameboard__cell"
                            key={"wordsearch__gameboard-row-" + rowNum + "-cell-" + cellNum}
                        >
                            {/* Render the cell text if their is content */}
                            {cell.content === 0 ? <span>{cell.content}</span> : null}
                        </div>
                    ))}
                </div> 
            ))}
        </div>
    )
}

export default GameBoard