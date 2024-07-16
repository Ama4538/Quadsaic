import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import { useEffect, useState } from "react";

const Wordle = ({ setting, updateSetting }) => {
    // Set Game word LATTER

    // Current row index
    const [currentRow, setCurrentRow] = useState(0)
    // Variable representing the game board
    const [gameBoard, setGameBoard] = useState([]);

    // Get the game board on mount
    useEffect(() => {
        if (setting.gameBoard === null) {
            const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(0));
            setGameBoard(tempGameBoard);
        } else {
            setGameBoard(setting.gameBoard);
            // Finding the current row
            for (let i = 0; i < setting.gameBoard.length; i++) {
                // 0 === unfilled
                if (setting.gameBoard[i][0] === 0) {
                    setCurrentRow(i);
                    break;
                }
            }
        }

    }, [setting])

    // Manage the key press down
    useEffect(() => {
        // Handle which function is ran
        const handleKeyPress = (event) => {
            const currentKey = event.key

            if (currentKey === "Enter") {
                nextLine();
            } else if (currentKey === "Backspace") {
                removeLetter();
            } else if (currentKey.length === 1 && currentKey.match(/[a-z]/i)) {
                updateLetter(currentKey);
            }
        }

        // Checking for user key press
        window.addEventListener("keydown", handleKeyPress)

        // Clean on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameBoard, currentRow])

    // Handle next line 
    const nextLine = () => {
        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];

        // TODO CHECK WORD IS VALUD AND ADDED LETTER MESSAGE
        if (updatedGameBoard[currentRow].includes(0)) {
            // Not enough letter add message later
            return;
        } else {
            setCurrentRow(currentRow + 1);
        }

    }

    // Handled removal of letter
    const removeLetter = () => {
        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];
        // Finding the current working space
        let workingLetterIndex = gameBoard[currentRow].indexOf(0);

        // Updating the current letter index
        if (workingLetterIndex === 0) {
            // At the start
            return;
        } else if (workingLetterIndex === -1) {
            // At the end
            workingLetterIndex = gameBoard[currentRow].length - 1;
        } else {
            // At the middle
            workingLetterIndex = workingLetterIndex - 1;
        }

        updatedGameBoard[currentRow][workingLetterIndex] = 0;
        setGameBoard(updatedGameBoard)

    }

    // Handled lettter press
    const updateLetter = (letter) => {
        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];
        const updateRow = updatedGameBoard[currentRow]
        // Finding the current working space
        const workingLetterIndex = updateRow.indexOf(0);

        // Seeing if the spot is valid and updating
        if (workingLetterIndex > -1) {
            updateRow[workingLetterIndex] = letter;
            setGameBoard(updatedGameBoard)
        }
    }


    return (
        <PageTransition>
            <Nav />
            <section className="wordle">
                {/* Display the information */}
                <header className="wordle__information-display">
                    <div className="wordle__information-format">
                        <p>Current Score</p>
                        <p>{setting.currentScore}</p>
                    </div>
                    {setting.timer ?
                        <div className="wordle__information-format">
                            <p>Timer</p>
                            <p>0:00</p>
                        </div>
                        : null
                    }
                    <div className="wordle__information-format">
                        <p>Highest Score</p>
                        <p>{setting.highestScore}</p>
                    </div>
                </header>

                {/* Game Board */}
                <main className="wordle__content">
                    {/* Generate the board based on the 2D array */}
                    <div className="wordle__gameboard">
                        {gameBoard.map((row, rowNum) => (
                            <div
                                className="wordle-gameboard__row"
                                key={"wordle__gameboard-row-" + rowNum}
                            >
                                {row.map((cell, cellNum) => (
                                    <div
                                        className="wordle-gameboard__cell"
                                        key={"wordle__gameboard-row-" + rowNum + "-cell-" + cellNum}
                                    >
                                        {/* Render the cell text if their is content */}
                                        {cell !== 0 ? <p>{cell}</p> : null}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </main>
            </section>
        </PageTransition>
    )
}

export default Wordle