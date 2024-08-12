import { useEffect, useRef, useState } from "react";

const colorReveal = "#691312"

const GameBoard = ({
    color,
    gameBoard,
    list,
    updateSetting,
    wordsFound,
    points,
    resetGame,
    correctAudio,
    revealAnwser,
    updateRevealAnwser,
    revealAudio,
    streakBonusPoint,
    pointMultiplier,
    POINTS_PER_LETTER,
    updateGuessAmount,
    end,
    totalWordsFound,
    updateStagePage,
    stageStreakBonus,
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

            // Guess Limit
            if (!matchingWord && selectedWord.length > 2) {
               updateGuessAmount();
            }
            
            // Streak bonus
            const newStreakBonus = pointsGained > 0 ? streakBonusPoint + (Math.round(points - (POINTS_PER_LETTER * pointMultiplier)) * (matchingWord.word).length): streakBonusPoint;
            const newStageStreakBonus =  pointsGained > 0 ? stageStreakBonus + (Math.round(points - (POINTS_PER_LETTER * pointMultiplier)) * (matchingWord.word).length): stageStreakBonus;
            const newFoundWordLength = wordsFound.length < newWordsFound.length ? totalWordsFound + 1 : totalWordsFound;

            // Update data
            setSelectedWord("");
            setSelectedCell([]);
            updateSetting(prev => ({
                ...prev,
                wordsFound: end ? [] : newWordsFound,
                totalWordsFound: end ? 0 : newFoundWordLength,
                currentScore: end ? 0 : prev.currentScore + pointsGained,
                stagePoint: end ? 0 : prev.stagePoint + pointsGained,
                stageStreakBonus: newStageStreakBonus,
                streakBonusPoint: newStreakBonus,
                highestScore: prev.currentScore + pointsGained > prev.highestScore ? prev.currentScore + pointsGained : prev.highestScore,
            }))

            if (newWordsFound.length === list.length) {
                updateStagePage();
            }
        }

    }, [mouseDown])

    // Handle font size change
    useEffect(() => {
        const adjustFontSize = () => {
            cellRefs.current.forEach(cell => {
                // check if cell exists
                if (cell) {
                    const multiplier = gameBoard.length > 10 ? 0.70 : 0.60;
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

    // Used to handle revealing the anwser
    useEffect(() => {
        if (revealAnwser) {
            // Making copy
            const updatedGameBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))

            // Finding a random non found word
            let currentReveal;
            do {
                currentReveal = list[Math.floor(Math.random() * list.length)]
            } while (wordsFound.includes(currentReveal.word))

            const y = currentReveal.y;
            const x = currentReveal.x;
            const word = currentReveal.word

            // Updating every letter in the word depending on its direction
            if (currentReveal.direction === "right") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y][x + i].backgroundColor = colorReveal;
                    updatedGameBoard[y][x + i].text = "var(--secondary-color)";
                    updatedGameBoard[y][x + i].found = true;
                    updatedGameBoard[y][x + i].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "left") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y][x - i].backgroundColor = colorReveal;
                    updatedGameBoard[y][x - i].text = "var(--secondary-color)";
                    updatedGameBoard[y][x - i].found = true;
                    updatedGameBoard[y][x - i].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "up") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y - i][x].backgroundColor = colorReveal;
                    updatedGameBoard[y - i][x].text = "var(--secondary-color)";
                    updatedGameBoard[y - i][x].found = true;
                    updatedGameBoard[y - i][x].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "down") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y + i][x].backgroundColor = colorReveal;
                    updatedGameBoard[y + i][x].text = "var(--secondary-color)";
                    updatedGameBoard[y + i][x].found = true;
                    updatedGameBoard[y + i][x].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "up-right") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y - i][x + i].backgroundColor = colorReveal;
                    updatedGameBoard[y - i][x + i].text = "var(--secondary-color)";
                    updatedGameBoard[y - i][x + i].found = true;
                    updatedGameBoard[y - i][x + i].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "up-left") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y - i][x - i].backgroundColor = colorReveal;
                    updatedGameBoard[y - i][x - i].text = "var(--secondary-color)";
                    updatedGameBoard[y - i][x - i].found = true;
                    updatedGameBoard[y - i][x - i].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "down-right") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y + i][x + i].backgroundColor = colorReveal;
                    updatedGameBoard[y + i][x + i].text = "var(--secondary-color)";
                    updatedGameBoard[y + i][x + i].found = true;
                    updatedGameBoard[y + i][x + i].foundColor = colorReveal;
                }
            } else if (currentReveal.direction === "down-left") {
                for (let i = 0; i < word.length; i++) {
                    updatedGameBoard[y + i][x - i].backgroundColor = colorReveal;
                    updatedGameBoard[y + i][x - i].text = "var(--secondary-color)";
                    updatedGameBoard[y + i][x - i].found = true;
                    updatedGameBoard[y + i][x - i].foundColor = colorReveal;
                }
            }

            // Updating data
            const PointsLost = Math.floor((points * word.length) * -0.60)
            const newWordsFound = [...wordsFound, word]

            updateSetting(prev => ({
                ...prev,
                gameBoard: updatedGameBoard,
                wordsFound: newWordsFound,
                currentScore: prev.currentScore + PointsLost < 0 ? 0 : prev.currentScore + PointsLost,
                totalRevealAnwserUsed: prev.totalRevealAnwserUsed + 1,
                stageRevealUsed: prev.stageRevealUsed + 1,
            }))

            if (newWordsFound.length === list.length) {
                resetGame(false, "reveal");
            }

            revealAudio.play();
            updateRevealAnwser(false)
        }
    }, [revealAnwser])

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