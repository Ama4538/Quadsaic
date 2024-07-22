import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion"
import correctSound from "/sound/correct.mp3"
import errorSound from "/sound/error.mp3"
import submitSound from "/sound/submit.mp3"
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import useFetchWord from "../../components/hooks/useFetchWord";

const Wordle = ({ setting, updateSetting }) => {
    useEffect(() => {
        console.log(setting);
    }, [setting])

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        textColor: null,
    }

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
    const totalPoints = BASE_POINT;
    const hintPointRemoval = Math.floor(totalPoints / (setting.letterCount * 1.5));
    const hintAmount = Math.floor(setting.letterCount / 2);

    // Colors used based on criteria
    const color = {
        correct: "#48552b",
        partial: "#a9903e",
        incorrect: "#3b3e41",
    }

    // Audio
    const errorAudio = new Audio(errorSound);
    const submitAudio = new Audio(submitSound);
    const CorrectAudio = new Audio(correctSound);
    errorAudio.volume = 0.50;
    submitAudio.volume = 0.50;
    CorrectAudio.volume = 0.50;

    // Key Board
    const keyBoardDisplay = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["Enter", "z", "x", "c", "v", "b", "n", "m", "Delete"]
    ]

    // Get the game board on mount
    useEffect(() => {
        if (setting.gameBoard === null) {
            const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
            const newWord = useFetchWord(setting.letterCount)

            setGameBoard(tempGameBoard);
            // Start up the game
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                    gameBoard: tempGameBoard,
                    lettersFound: new Array(setting.letterCount).fill(null),
                    hintAmount: hintAmount,
                }
            ))
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
            errorAudio.play();
            updateMessage("Not enough letters entered")

            // Play animation
            animationController.start("error")
            return;
        } else {
            const currentWord = (setting.currentWord).toLowerCase().split("");
            const workingWord = updatedGameBoard[currentRow];
            let lettersAttempt = setting.lettersAttempt;
            let lettersFound = setting.lettersFound;
            let matchCounter = 0;
            let pointsGained = 0;

            // Going through both word
            for (let i = 0; i < currentWord.length; i++) {
                if ((workingWord[i].content).toLowerCase() === currentWord[i]) {
                    // Checking if the letter is in the right spot
                    workingWord[i].backgroundColor = color["correct"];
                    // Add to the lettersfound array if unqiue
                    if (lettersFound[i] === null) {
                        pointsGained = pointsGained + (totalPoints / setting.letterCount);
                        lettersFound[i] = workingWord[i].content;
                    }

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

                // Check if letter is inside
                lettersAttempt = addToInputLetter(workingWord[i], lettersAttempt);
            }

            // Play Animation
            animationController.start("complete")

            // Wordle is a complete match
            if (matchCounter === currentWord.length) {
                CorrectAudio.play();
                updateMessage("The Word has been Found!")
                setTimeout(() => {
                    resetGame(false, pointsGained)
                }, 1000)
            } else {
                // Update the game
                submitAudio.play();
                const newScore = setting.currentScore + pointsGained;
                setGameBoard(updatedGameBoard);
                setCurrentRow(currentRow + 1);
                updateSetting(prev => (
                    {
                        ...prev,
                        gameBoard: gameBoard,
                        lettersAttempt: lettersAttempt,
                        lettersFound: lettersFound,
                        currentScore: newScore,
                        highestScore: newScore >= prev.highestScore ? newScore : prev.highestScore,
                    }
                ))
            }
        }
    }

    // Add letter to array to show all attempted inputs
    const addToInputLetter = (cell, lettersAttempt) => {
        // Check if letter is inside
        const present = lettersAttempt.some(element => element.content === cell.content)
        const index = lettersAttempt.findIndex(element => element.content === cell.content)

        // Added if letter is not in the array
        if (!present) {
            lettersAttempt.push({ ...cell });
        } else if (cell.backgroundColor === color["correct"] && lettersAttempt[index].backgroundColor !== color["correct"]) {
            lettersAttempt[index].backgroundColor = color["correct"];
        }

        return lettersAttempt;
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
    const resetGame = (resetPoints = true, points = 0) => {
        setCurrentRow(0);

        // Creating a new board
        const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
        setGameBoard(tempGameBoard);

        // Reset Timer
        setTime(setting.timerAmount);
        const newWord = useFetchWord(setting.letterCount)
        const newScore = setting.currentScore + points

        // reset required information
        updateSetting(prev => (
            {
                ...prev,
                currentWord: newWord,
                gameBoard: tempGameBoard,
                lettersAttempt: [],
                lettersFound: new Array(setting.letterCount).fill(null),
                currentScore: resetPoints ? 0 : newScore,
                highestScore: newScore >= prev.highestScore ? newScore : prev.highestScore,
                hintAmount: hintAmount,
            }
        ))
    }

    // Handled removal of letter
    const removeLetter = () => {
        // Creating a copy of the game board
        const updatedGameBoard = [...gameBoard];
        const updateRow = updatedGameBoard[currentRow]
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

        // Deep copying gameboard to update
        const updatedGameBoard = gameBoard.map(row =>
            row.map(cell => ({ ...cell }))
        );
        const updateRow = updatedGameBoard[currentRow]
        const workingLetterIndex = updateRow.findIndex(cell => cell.content === 0);

        // Seeing if the spot is valid and updating
        if (workingLetterIndex > -1) {
            updateRow[workingLetterIndex].content = letter;
            setGameBoard(updatedGameBoard)
        }
    }

    // Handle Display KeyBoard Input 
    const handleDisplayKeyBoard = (letter, event) => {
        // Prevent focusable (enter key putting another letter)
        event.target.blur();

        // Condition for which button is pressed
        if (letter === "Enter") {
            nextLine();
        } else if (letter === "Delete") {
            removeLetter();
        } else {
            updateLetter(letter);
        }
    }

    const showHint = (event) => {
        // Prevent focusable (enter key putting calling the hint button again)
        event.target.blur();

        // Check if there is any remaining hints
        if (setting.hintAmount <= 0) {
            errorAudio.play();
            updateMessage("No More Hints Available")
            return
        }

        const currentWord = (setting.currentWord).toLowerCase().split("");
        const newLettersAttempt = [...setting.lettersAttempt];
        // Check if all currentWord's letter is already attempted
        const allPresent = currentWord.every(letter => newLettersAttempt.some(cell => cell.content === letter))

        if (allPresent) {
            errorAudio.play();
            updateMessage("All Correct Letters Attempted")
            return;
        }

        let hintLetter = { ...defaultCell, backgroundColor: color["partial"], textColor: 1 };

        // Find a random letter that hasnt been attempted
        do {
            hintLetter.content = currentWord[Math.floor(Math.random() * currentWord.length)]
        } while ((setting.lettersFound).includes(hintLetter.content) || newLettersAttempt.some(cell => cell.content === hintLetter.content))
        
        newLettersAttempt.push(hintLetter)
        updateSetting(prev => (
            {
                ...prev,
                lettersAttempt: newLettersAttempt,
                currentScore: prev.currentScore - hintPointRemoval,
                hintAmount: prev.hintAmount - 1,
            }
        ))

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

                    {/* Keyboard */}
                    <div className="wordle__keyboard">
                        {/* Generating keyboard based on 2D array */}
                        {keyBoardDisplay.map((row, rowNum) => (
                            <div
                                className="wordle-keyboard__row"
                                key={"wordle-keyboard__row-" + rowNum}
                            >
                                {row.map((letter, letterNum) => (
                                    <div
                                        className="wordle-keyboard__letter"
                                        key={"wordle__gameboard-row-" + rowNum + "-letter-" + letterNum}
                                    >
                                        <button
                                            className={letter.length > 1 ? "wordle-keyboard__button wordle-keyboard__button-big" : "wordle-keyboard__button"}
                                            onClick={(event) => {
                                                handleDisplayKeyBoard(letter, event)
                                            }}
                                            style={{
                                                backgroundColor: (setting.lettersAttempt).some(cell => cell.content === letter)
                                                    ? (setting.lettersAttempt)[(setting.lettersAttempt).findIndex(cell => cell.content === letter)].backgroundColor
                                                    : null,
                                                color: (setting.lettersAttempt).some(cell => cell.content === letter)
                                                    ? "var(--secondary-color)"
                                                    : "var(--primary-color)",
                                            }}
                                        >
                                            {letter}</button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                </main>
                <footer className="wordle__footer">
                    <div className="wordle__footer-left">
                        <button></button>
                        <button></button>
                    </div>
                    <div className="wordle__footer-right">
                        <button
                            onClick={(event) => showHint(event)}
                        >Show Hint</button>
                        <button>Reveal Answer</button>
                    </div>
                </footer>
            </section>
        </PageTransition>
    )
}

export default Wordle