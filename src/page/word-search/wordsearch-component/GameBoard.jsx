import { useEffect, useRef } from "react";

const GameBoard = ({ gameBoard }) => {
    // Create a ref for all cell
    const cellRefs = useRef([]);

    useEffect(() => {
        // Change Font size when grid layout changes
        const adjustFontSize = () => {
            cellRefs.current.forEach(cell => {
                    const newFontSize = cell.getBoundingClientRect().width * 0.70; // Adjust this multiplier as needed
                    cell.style.fontSize = `${newFontSize}px`;
            });
        };

        adjustFontSize(); 
        // Update when the screen changes size
        window.addEventListener('resize', adjustFontSize); 

        return () => {
            window.removeEventListener('resize', adjustFontSize); 
        };
    }, [gameBoard]);

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
                            style={{
                                backgroundColor: cell.backgroundColor !== null ? cell.backgroundColor : null,
                                color: cell.textColor !== null ? "var(--secondary-color)" : "var(--primary-color)"
                            }}
                            // Create a unqiue index for the cell ref
                            ref={element => cellRefs.current[rowNum * gameBoard[0].length + cellNum] = element}
                        >
                            {/* Render the cell text if their is content */}
                            {cell.content !== 0 ? <span>{cell.content}</span> : null}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard