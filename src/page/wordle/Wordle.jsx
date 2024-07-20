import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion"
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import useFetchWord from "../../components/hooks/useFetchWord";

const Wordle = ({ setting, updateSetting }) => {
    useEffect(() => {
        console.log(setting);
    }, [setting])

    const animationController = useAnimation()
    // Current row index
    const [currentRow, setCurrentRow] = useState(0)
    // Variable representing the game board
    const [gameBoard, setGameBoard] = useState([]);
    // Message
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(false)
    // Timer
    const [time, setTime] = useState(setting.timerAmount)

    // Default point
    const BASE_POINT = 100;

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        textColor: null,
    }

    // Colors used based on criteria
    const color = {
        correct: "#48552b",
        partial: "#a9903e",
        incorrect: "#3b3e41",
    }

    // Set word if empty
    useEffect(() => {
        if (setting.currentWord === "") {
            const newWord = useFetchWord(setting.letterCount)
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                }
            ))
        }
    }, [])

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

    // Timer
    useEffect(() => {
        let timeInterval = null;

        if (setting.timer && time > 0) {
            timeInterval = setInterval(() => {
                setTime(prev => prev - 1)
            }, 1000)
        } else if (time <= 0) {
            clearInterval(timeInterval)
            updateMessage("Game Over")
        }
        return () => clearInterval(timeInterval)
    }, [setting.timer, time])

    //format the time
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Handle next line 
    const nextLine = () => {
        // Out of Guess
        if (currentRow >= setting.guessAmount - 1) {
            updateMessage("Game Over")
            setTimeout(() => {
                resetGame()
            }, 1000)
        }

        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];

        if (updatedGameBoard[currentRow].some(cell => cell.content === 0)) {
            // Not enough letter add message later
            updateMessage("Not enough letters entered")
            // Play animation
            animationController.start("error")
            return;
        } else {
            // Get current word and the current working word
            const currentWord = (setting.currentWord).toLowerCase().split("");
            const workingWord = updatedGameBoard[currentRow];
            // Match counter to find next word
            let matchCounter = 0;

            // Going through both word
            for (let i = 0; i < currentWord.length; i++) {
                if ((workingWord[i].content).toLowerCase() === currentWord[i]) {
                    // Checking if the letter is in the right spot
                    workingWord[i].backgroundColor = color["correct"];
                    matchCounter = matchCounter + 1;
                } else if (workingWord[i].backgroundColor !== color["correct"] && currentWord.includes((workingWord[i].content).toLowerCase())) {
                    // Checking if letter is in the word
                    workingWord[i].backgroundColor = color["partial"];
                } else if (workingWord[i].backgroundColor !== color["correct"] || workingWord[i].backgroundColor !== color["partial"]) {
                    // No Letter or word
                    workingWord[i].backgroundColor = color["incorrect"];
                }

                // Change the textColor to not be null
                workingWord[i].textColor = 1;
            }

            setGameBoard(updatedGameBoard)
            // Play Animation
            animationController.start("complete")

            // Wordle is a complete match
            if (matchCounter === currentWord.length) {
                updateMessage("The Word has been Found!")
                setTimeout(() => {
                    resetGame(BASE_POINT)
                }, 1000)
            } else {
                setCurrentRow(currentRow + 1);
            }
        }
    }

    // Update Message
    const updateMessage = (message) => {
        setMessage(message);
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 1000)
    }

    // Reset the Game
    const resetGame = (points = 0) => {
        // Set currentRow to default
        setCurrentRow(0);
        // Create a new board
        const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
        setGameBoard(tempGameBoard);
        // Reset Timer
        setTime(setting.timerAmount);

        // Getting new word
        const newWord = useFetchWord(setting.letterCount)

        // Default reset
        if (points === 0) {
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                    gameBoard: tempGameBoard,
                    currentScore: 0,
                }
            ))
        } else {
            // Update the score based upon the points
            const newScore = setting.currentScore + points;
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                    gameBoard: tempGameBoard,
                    currentScore: newScore,
                    highestScore: newScore > prev.highestScore ? newScore : prev.highestScore,
                }
            ))
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
        // Check if row is valid
        if (currentRow >= setting.guessAmount) {
            return;
        }

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

    // Animations
    const rowAnimation = {
        error: {
            x: [0, 2.5, -2.5, 0],
            transition: {
                duration: 0.15,
                ease: [0.45, 0, 0.55, 1],
                repeat: 2
            }
        },
    }

    const cellAnimation = {
        complete: (index) => ({
            y: [0, -5, 0],
            transition: {
                duration: 0.15,
                delay: index * 0.05,
                ease: [0.45, 0, 0.55, 1],
            }
        })
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
                            <p>{formatTime(time)}</p>
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
                                        {cell.content !== 0 ? <p>{cell.content}</p> : null}
                                    </motion.div>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </main>
                {/* <footer>
                    <div className="wordle__footer-left">
                        <button></button>
                        <button></button>
                    </div>
                    <div className="wordle__footer-right">
                        <button></button>
                        <button></button>
                    </div>
                </footer> */}
            </section>
        </PageTransition>
    )
}

export default Wordle