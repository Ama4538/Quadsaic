import { useEffect, useState } from "react";
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import useFetchWord from "../../components/hooks/useFetchWord";

const Wordle = ({ setting, updateSetting }) => {
    // Set Game word LATTER
    useEffect(() => {
        console.log(useFetchWord(setting.letterCount));
    }, [])
   
    // Current row index
    const [currentRow, setCurrentRow] = useState(0)
    // Variable representing the game board
    const [gameBoard, setGameBoard] = useState([]);

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        textColor: null,
    }

    // Colors used based on criteria
    const color = {
        corrent: "#48552b",
        partial: "#a9903e",
        incorrect: "#3b3e41",
    }

    // Get the game board on mount
    useEffect(() => {
        if (setting.gameBoard === null) {
            const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
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
        if (updatedGameBoard[currentRow].some(cell => cell.content === 0)) {
            // Not enough letter add message later
            return;
        } else {
            // Get current word and the current working word
            const currentWord = (setting.currentWord).toLowerCase().split("");
            const workingWord = updatedGameBoard[currentRow];
            // Match counter to find next word
            let matchCounter = 0;

            // Going through both word
            for (let i = 0; i < currentWord.length; i++) {
                if (workingWord[i].content === currentWord[i]) {
                    // Checking if the letter is in the right spot
                    workingWord[i].backgroundColor = color["corrent"];
                    matchCounter = matchCounter + 1;
                } else if (workingWord[i].backgroundColor !== color["corrent"] && currentWord.includes(workingWord[i].content)) {
                    // Checking if letter is in the word
                    workingWord[i].backgroundColor = color["partial"];
                } else if (workingWord[i].backgroundColor !== color["corrent"] || workingWord[i].backgroundColor !== color["partial"]) {
                    // No Letter or word
                    workingWord[i].backgroundColor = color["incorrect"];
                }

                // Change the textColor to not be null
                workingWord[i].textColor = 1;
            }

            // Wordle is a complete match
            if (matchCounter === currentWord.length) {
                console.log("Matched");
            }


            setGameBoard(updatedGameBoard)
            setCurrentRow(currentRow + 1);
            console.log(setting.currentWord);
        }

    }

    // Handled removal of letter
    const removeLetter = () => {
        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];
        const updateRow = updatedGameBoard[currentRow]
        // Finding the current working space
        let workingLetterIndex = updateRow.findIndex(cell => cell.content === 0);

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

        updateRow[workingLetterIndex].content = 0;
        setGameBoard(updatedGameBoard)
    }

    // Handled lettter press
    const updateLetter = (letter) => {
        // Creating a depp copy of the game board
        const updatedGameBoard = gameBoard.map(row =>
            row.map(cell => ({ ...cell }))
        );
        const updateRow = updatedGameBoard[currentRow]
        // Finding the current working space
        const workingLetterIndex = updateRow.findIndex(cell => cell.content === 0);

        // Seeing if the spot is valid and updating
        if (workingLetterIndex > -1) {
            updateRow[workingLetterIndex].content = letter;
            setGameBoard(updatedGameBoard)
        }
    }


    return (
        <PageTransition>
            <Nav location={"wordle"} />
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
                                        style={{
                                            backgroundColor: cell.backgroundColor !== null ? cell.backgroundColor : null,
                                            color: cell.textColor !== null ? "var(--secondary-color)" : "var(--primary-color)"
                                        }}
                                        data-filled={cell.content !== 0 ? true : false}
                                    >
                                        {/* Render the cell text if their is content */}
                                        {cell.content !== 0 ? <p>{cell.content}</p> : null}
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