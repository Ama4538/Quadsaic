import { useEffect, useRef, useState } from "react";

const GameBoard = ({ gameBoard }) => {

    // Create a ref for all cell
    const cellRefs = useRef([]);

    // Variable
    const gridSize = Math.sqrt(gameBoard.length)

    // UseEffect

    // Handle font size change
    useEffect(() => {
        const adjustFontSize = () => {
            cellRefs.current.forEach(cell => {
                // check if cell exists
                if (cell) {
                    const multiplier = gridSize < 4 ? 0.50 : 0.60;
                    const newFontSize = cell.getBoundingClientRect().width * multiplier;
                    cell.style.fontSize = `${newFontSize}px`;
                }
            });
        };

        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);

        return () => {
            window.removeEventListener('resize', adjustFontSize);
        };
    }, [gameBoard]);

    return (
        <div
            className="sudoku__gameboard"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
            }}
        >
            {gameBoard.map((section, sectionNum) => {
                // Border adjustment so border arn't doubling
                const className = [];
                if (sectionNum < gridSize) {
                    className.push("top-border-none")
                }

                if (sectionNum % gridSize === 0) {
                    className.push("left-border-none")
                }

                return (
                    <div
                        className={`sudoku__gameboard-section ${className.join(" ")}`}
                        key={"sudoku__gameboard-section-" + sectionNum}
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            gridTemplateRows: `repeat(${gridSize}, 1fr)`
                        }}
                    >
                        {section.map((cell, cellNum) => (
                            <div
                                className="sudoku__gameboard-cell"
                                key={"sudoku__gameboard-section-" + sectionNum + "-cell-" + cellNum}
                                ref={element => cellRefs.current[sectionNum * gameBoard[0].length + cellNum] = element}
                            >
                                {cell.content !== 0 ? <span>{cell.content}</span> : null}
                            </div>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

export default GameBoard