import { useEffect, useRef, useState } from "react";

const GameBoard = ({
    color,
    gameBoard,
    list,
    updateSetting,
    wordsFound,
    points,
    resetGame,
    correctAudio,
    submitAudio,
}) => {
    // States

    // Actions
    const [mouseDown, setMouseDown] = useState(false)

    // Data
    const [selectedWord, setSelectedWord] = useState("");
    const [selectedCell, setSelectedCell] = useState([]);
    const [usedColor, setUsedColor] = useState([]);

    // variables

    // Create a ref for all cell
    const cellRefs = useRef([]);

    // UseEffect
    useEffect(() => {
        if (!mouseDown) {
            // Trying to find if word is in the required list
            let matchingWord = list.find(element => element.word === selectedWord);

            if (!matchingWord) {
                // If the word was not found, check for its reverse
                let reversedWord = selectedWord.split("").reverse().join("");
                matchingWord = list.find(element => element.word === reversedWord);
            }

            let selectedColor = null;
            let newWordsFound = [...wordsFound]
            let pointsGained = 0;

            if (matchingWord && !wordsFound.includes(matchingWord.word)) {
                newWordsFound.push(matchingWord.word)
                pointsGained = points * (matchingWord.word).length;
                // Prevents repeating color
                if (color.length - 1 === usedColor.length) {
                    selectedColor = color[Math.floor(Math.random() * color.length)]
                    setUsedColor([selectedColor]);
                } else {
                    do {
                        selectedColor = color[Math.floor(Math.random() * color.length)]
                    } while (usedColor.includes(selectedColor))

                    setUsedColor([...usedColor, selectedColor])
                }

                // Prevent the last one from playing audio
                if (!(newWordsFound.length === list.length)) {
                    correctAudio.play();
                }
            }

            // Handled the coloring if the word is found
            selectedCell.forEach(cell => {
                if (!cell.found && selectedColor !== null) {
                    cell.backgroundColor = selectedColor;
                    cell.foundColor = selectedColor;
                    cell.text = "var(--secondary-color)";
                    cell.found = true;
                    // Let the most current color to be on top
                } else if (cell.found && selectedColor !== null) {
                    cell.backgroundColor = selectedColor;
                    cell.foundColor = selectedColor;
                } else if (cell.foundColor !== null) {
                    cell.backgroundColor = cell.foundColor;
                } else {
                    // Default
                    cell.backgroundColor = null;
                    cell.text = null;
                }
            })

            // Update data
            setSelectedWord("");
            setSelectedCell([]);
            updateSetting(prev => ({
                ...prev,
                wordsFound: newWordsFound,
                currentScore: prev.currentScore + pointsGained,
                highestScore: prev.currentScore + pointsGained > prev.highestScore ? prev.currentScore + pointsGained : prev.highestScore,
            }))

            if (newWordsFound.length === list.length) {
                submitAudio.play()
                resetGame(false);
            }
        }

    }, [mouseDown])

    // Handle font size change
    useEffect(() => {
        const adjustFontSize = () => {
            cellRefs.current.forEach(cell => {
                // check if cell exists
                if (cell) {
                    const newFontSize = cell.getBoundingClientRect().width * 0.70;
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

    // Function

    // Update our selected cell array based on straightness
    const updateSelectedCell = (cell) => {
        const newSelection = [...selectedCell, cell]
        const lineValue = checkInLine(newSelection)

        switch (lineValue) {
            case 1:
                cell.backgroundColor = "var(--primary-color)"
                cell.text = "var(--secondary-color)"
                setSelectedCell(newSelection);
                setSelectedWord(prev => prev + cell.content)
                break;
            case 2:
                const newSelectedWord = selectedWord.substring(0, selectedWord.length - 1)
                // Removing the latest selected
                const oldSelection = selectedCell;
                const oldCell = oldSelection[oldSelection.length - 1];
                if (oldCell.found) {
                    oldCell.backgroundColor = oldCell.foundColor;
                } else {
                    oldCell.backgroundColor = null;
                    oldCell.text = null;
                }
                newSelection.splice(newSelection.length - 2, 2)

                setSelectedWord(newSelectedWord);
                setSelectedCell(newSelection);
            default:
                break;
        }
    }

    // Return a value based on the following:
    // 0 = not in a line
    // 1 = in a line
    // 2 = opposite direction
    const checkInLine = (cells) => {
        // its a line if it only has 2 values
        if (cells.length <= 2) {
            return 1;
        }

        // Getting starting direction
        let orginalDirection = getDirection(cells[0], cells[1])
        if (!orginalDirection) {
            return 0;
        }

        // Two pointer system
        let index = 2;
        let current = cells[index];
        let prev = cells[index - 1];

        do {
            // Check for gaps
            if (Math.abs(prev.y - current.y) !== 1 && Math.abs(prev.x - current.x) !== 1
                || current.x === prev.x && Math.abs(prev.y - current.y) !== 1
                || current.y === prev.y && Math.abs(prev.x - current.x) !== 1) {
                return 0;
            }

            // Check if the direction of all the cell matches
            let newDirection = getDirection(prev, current);

            if (index === cells.length - 1 && newDirection + orginalDirection === 0) {
                return 2;
            } else if (newDirection !== orginalDirection) {
                return 0;
            }

            index++;
            current = cells[index];
            prev = cells[index - 1];
        } while (index < cells.length)

        return 1;
    }

    // Get the current direction
    const getDirection = (firstCell, secondCell) => {
        let vertical = firstCell.y - secondCell.y;
        let horizontal = firstCell.x - secondCell.x;

        // 3 = up-right, -3 = down-left, 4 = up-left, -4 = down-left
        if (Math.abs(vertical) === Math.abs(horizontal)) {
            if (vertical < 0 && horizontal < 0) {
                return 3;
            } else if (vertical > 0 && horizontal > 0) {
                return -3
            } else if (vertical < 0 && horizontal > 0) {
                return 4
            } else if (vertical > 0 && horizontal < 0) {
                return -4
            }
        } else {
            //  1 = up, -1 = down, 2 = right, -2 = left
            if (horizontal === 0 && vertical !== 0) {
                return vertical > 0 ? 1 : -1
            } else if (horizontal !== 0 && vertical === 0) {
                return horizontal < 0 ? 2 : -2
            }
        }

        return null
    }

    return (
        <div
            className="wordsearch__gameboard"
            style={{
                gap: `calc(var(--padding-size-small) / ${gameBoard.length >= 15 ? 8 : 6})`
            }}
        >
            {gameBoard.map((row, rowNum) => (
                <div
                    className="wordsearch-gameboard__row"
                    key={"wordsearch__gameboard-row-" + rowNum}
                    style={{
                        gap: `calc(var(--padding-size-small) / ${gameBoard.length >= 15 ? 8 : 6})`
                    }}
                >
                    {row.map((cell, cellNum) => {
                        cell.x = cellNum;
                        cell.y = rowNum;

                        return (
                            <div
                                className="wordsearch-gameboard__cell"
                                key={"wordsearch__gameboard-row-" + rowNum + "-cell-" + cellNum}
                                style={{
                                    backgroundColor: cell.backgroundColor !== null ? cell.backgroundColor : null,
                                    color: cell.text !== null ? cell.text : null,
                                }}
                                // Create a unqiue index for the cell ref
                                ref={element => cellRefs.current[rowNum * gameBoard[0].length + cellNum] = element}
                                onMouseUp={() => { setMouseDown(false) }}
                                onMouseDown={() => {
                                    setMouseDown(true);
                                    updateSelectedCell(cell)
                                }}
                                onMouseEnter={() => { mouseDown ? updateSelectedCell(cell) : null }}
                            >
                                {/* Render the cell text if their is content */}
                                {cell.content !== 0 ? <span>{cell.content}</span> : null}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default GameBoard