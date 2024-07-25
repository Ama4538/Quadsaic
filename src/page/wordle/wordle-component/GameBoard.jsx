import { motion } from "framer-motion"

const GameBoard = ({
    gameBoard,
    message,
    showMessage,
    currentRow,
    rowAnimation,
    cellAnimation,
    animationController
}) => {
    // Generate the board based on the 2D array
    return (
        <div
            className="wordle__gameboard"
            data-message={showMessage ? true : false}
        >
            <div className="wordle__message">
                <p>{message}</p>
            </div>
            {gameBoard.map((row, rowNum) => (
                <motion.div
                    className="wordle-gameboard__row"
                    key={"wordle__gameboard-row-" + rowNum}
                    variants={rowNum === currentRow ? rowAnimation : null}
                    animate={animationController}
                >
                    {row.map((cell, cellNum) => (
                        <motion.div
                            className="wordle-gameboard__cell"
                            key={"wordle__gameboard-row-" + rowNum + "-cell-" + cellNum}
                            variants={rowNum === currentRow ? cellAnimation : null}
                            animate={animationController}
                            custom={cellNum}
                            style={{
                                backgroundColor: cell.backgroundColor !== null ? cell.backgroundColor : null,
                                color: cell.textColor !== null ? "var(--secondary-color)" : "var(--primary-color)"
                            }}
                            data-filled={cell.content !== 0 ? true : false}
                        >
                            {/* Render the cell text if their is content */}
                            {cell.content !== 0 ? <span>{cell.content}</span> : null}
                        </motion.div>
                    ))}
                </motion.div>
            ))}
        </div>
    )
}

export default GameBoard