import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion"
import correctSound from "/sound/correct.mp3"
import errorSound from "/sound/error.mp3"
import submitSound from "/sound/submit.mp3"
import hintSound from "/sound/hint.mp3"
import revealSound from "/sound/reveal.mp3"
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import useFetchWord from "../../components/hooks/useFetchWord";
import DropDown from "../../components/dropdown/DropDown";

const Wordle = ({ setting, updateSetting }) => {
    useEffect(() => {
        console.log(setting);
    }, [setting.currentWord])

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        textColor: null,
    }

    // States

    // Overlay Management
    const [overlayStatus, setOverlayStatus] = useState(true);
    const [welcomePage, setWelcomePage] = useState(true);
    const [settingPage, setSettingPage] = useState(false);
    const [tutorialPage, setTutorialPage] = useState(false);

    // Game State
    const [currentRow, setCurrentRow] = useState(0)
    const [gameBoard, setGameBoard] = useState([]);
    const [hasGameInProgress, setHasGameInProgress] = useState(false);

    // Message
    const [message, setMessage] = useState("")
    const [showMessage, setShowMessage] = useState(false)

    // Timer
    const [currentTime, setCurrentTime] = useState(0)

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false);

    // Data
    const [letterAmount, setLetterAmount] = useState(0)
    const [guessAmount, setGuessAmount] = useState(0)
    const [enableHints, setEnableHints] = useState(false)
    const [enableAnwserReveal, setEnableAnwserReveal] = useState(false)
    const [enableTimer, setEnableTimer] = useState(false)
    const [timeAmount, setTimeAmount] = useState(0)
    const [soundAmount, setSoundAmount] = useState(0)

    // Variables

    // Ref to timeout timer
    const timeoutRef = useRef(null);

    // Animations
    const animationController = useAnimation()
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

    // Point System
    const BASE_POINT = 100;
    const totalPoints = BASE_POINT;
    const hintAmount = Math.floor(setting.letterCount / 2);

    // Colors
    const color = {
        correct: "#48552b",
        partial: "#a9903e",
        incorrect: "#3b3e41",
        reveal: "#781626",
    }

    // Setting drop menu option
    const possibleLetterAmount = [4, 5, 6, 7, 8, 9];
    const possibleGuessAmount = [3, 4, 5, 6, 7, 8];

    // Audio
    const CorrectAudio = new Audio(correctSound);
    const errorAudio = new Audio(errorSound);
    const submitAudio = new Audio(submitSound);
    const hintAudio = new Audio(hintSound);
    const revealAudio = new Audio(revealSound);
    CorrectAudio.volume = soundAmount;
    errorAudio.volume = soundAmount;
    submitAudio.volume = soundAmount;
    hintAudio.volume = soundAmount
    revealAudio.volume = soundAmount

    // Key Board
    const keyBoardDisplay = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["Enter", "z", "x", "c", "v", "b", "n", "m", "Delete"]
    ]

    // UseEffect

    // Get the game board
    useEffect(() => {
        if (setting.gameBoard.length === 0) {
            const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
            const newWord = useFetchWord(setting.letterCount)

            setGameBoard(tempGameBoard);
            // Start up the game
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                    gameBoard: tempGameBoard,
                    currentLine: new Array(setting.letterCount).fill({ ...defaultCell }),
                    lettersFound: new Array(setting.letterCount).fill(null),
                    hintAmount: hintAmount,
                }
            ))
        } else {
            setGameBoard(setting.gameBoard);
            for (let i = 0; i < setting.gameBoard.length; i++) {
                // Check if the first cell in the row is unfilled (assuming 0 means unfilled)
                if (setting.gameBoard[i].some(cell => cell.content === 0)) {
                    setCurrentRow(i);
                    break;
                }
            }
        }
        setDataLoadingStatus(true);
    }, [])

    // Progress Checker
    useEffect(() => {
        if (dataLoadingStatus) {
            setHasGameInProgress(currentRow !== 0 || !gameBoard[currentRow].every(cell => cell.content === 0));
            setEnableAnwserReveal(setting.enableAnwserReveal);
            setEnableHints(setting.enableHints);
            setEnableTimer(setting.enableTimer);
            setTimeAmount(setting.timerAmount);
            setCurrentTime(setting.timerAmount);
            setLetterAmount(setting.letterAmount);
            setGuessAmount(setting.guessAmount);
            setSoundAmount(setting.soundAmount);
        }
    }, [dataLoadingStatus])

    // Key Handler
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

        if (!overlayStatus) {
            // Checking for user key press
            window.addEventListener("keydown", handleKeyPress)
        }

        // Clean on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameBoard, currentRow, overlayStatus])

    // Timer
    useEffect(() => {
        let timeInterval = null;
        if (!overlayStatus) {
            if (enableTimer && currentTime > 0) {
                timeInterval = setInterval(() => {
                    setCurrentTime(prev => prev - 1)
                }, 1000)
            } else if (currentTime <= 0) {
                clearInterval(timeInterval)
                resetGame()
            }
        }

        return () => clearInterval(timeInterval)
    }, [enableTimer, currentTime, overlayStatus])

    // Page Manager
    useEffect(() => {
        setOverlayStatus(welcomePage || tutorialPage || settingPage);
    }, [welcomePage, tutorialPage, settingPage])

    // Functions

    // Start the game
    const startGame = (reset = false) => {
        // Turn off all pages
        setWelcomePage(!welcomePage);
        setWelcomePage(false);

        if (reset) {
            resetGame();
        }
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
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: updatedGameBoard,
                }
            ))
        }
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

    // Reset the Game
    const resetGame = (resetPoints = true, points = 0) => {
        setCurrentRow(0);

        // Creating a new board
        const tempGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
        setGameBoard(tempGameBoard);

        // Reset Timer
        setCurrentTime(setting.timerAmount);

        // Manage found words
        const completedWords = setting.completedWords;
        completedWords.push(setting.currentWord);

        // Get new and unqie word
        let newWord;
        do {
            newWord = useFetchWord(setting.letterCount);
        } while (completedWords.includes(newWord));

        const newScore = setting.currentScore + points

        // reset required information
        updateSetting(prev => (
            {
                ...prev,
                currentWord: newWord,
                gameBoard: tempGameBoard,
                completedWords: resetPoints ? [] : completedWords,
                lettersAttempt: [],
                lettersFound: new Array(setting.letterCount).fill(null),
                currentScore: resetPoints ? 0 : newScore,
                highestScore: newScore >= prev.highestScore ? newScore : prev.highestScore,
                hintAmount: hintAmount,
            }
        ))
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

    const showHint = (event) => {
        // Prevent focusable (enter key putting calling the hint button again)
        event.target.blur();

        // Hints disabled
        if (!enableHints) {
            errorAudio.play();
            updateMessage("Hints has been disabled")
            return
        }

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
        const pointsToRemove = Math.floor(totalPoints / (setting.letterCount * 1.75));
        const pointsLost = setting.currentScore > pointsToRemove ? pointsToRemove : (setting.currentScore * 1);

        // Find a random letter that hasnt been attempted
        do {
            hintLetter.content = currentWord[Math.floor(Math.random() * currentWord.length)]
        } while ((setting.lettersFound).includes(hintLetter.content) || newLettersAttempt.some(cell => cell.content === hintLetter.content))

        newLettersAttempt.push(hintLetter)
        updateSetting(prev => (
            {
                ...prev,
                lettersAttempt: newLettersAttempt,
                currentScore: prev.currentScore - pointsLost,
                hintAmount: prev.hintAmount - 1,
            }
        ))

        hintAudio.play();
    }

    // reveal the anwser
    const revealAnwser = (event) => {
        // Prevent focusable (enter key putting calling the button again)
        event.target.blur();

        // Hints disabled
        if (!enableAnwserReveal) {
            errorAudio.play();
            updateMessage("Reveal has been disabled")
            return
        }

        // Creating a copy of the game board
        const updatedGameBoard = gameBoard.map(row =>
            row.map(cell => ({ ...cell }))
        );
        const updateRow = updatedGameBoard[currentRow]
        const currentWord = setting.currentWord.split("")

        // Update all leteter in the row
        for (let i = 0; i < currentWord.length; i++) {
            updateRow[i].content = currentWord[i];
            updateRow[i].backgroundColor = color["reveal"];
            updateRow[i].textColor = 1;
        }

        // Play Animation
        animationController.start("complete")
        setGameBoard(updatedGameBoard);
        const pointsToRemove = Math.floor((totalPoints / 2.50))
        const pointsLost = setting.currentScore > pointsToRemove ? (pointsToRemove * -1) : (setting.currentScore * -1);

        updateMessage("The Word Has Been Revealed")

        // Reset the game and remove points
        setTimeout(() => {
            resetGame(false, pointsLost)
        }, 1000)

        revealAudio.play();
    }

    // Update Message
    const updateMessage = (message) => {
        setMessage(message);
        setShowMessage(true);

        // Reset the timer if pressed again
        if (timeoutRef.current) {
            clearTimeout(timeoutRef)
        }

        timeoutRef.current = setTimeout(() => {
            setShowMessage(false);
        }, 1000)
    }

    //format the time
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    return (
        <PageTransition>
            <Nav location={"wordle"} />
            {dataLoadingStatus
                ? <section className="wordle">
                    {
                        overlayStatus
                            ? <div className="wordle__overlay">
                                {/* Generate the page when they are active */}
                                {welcomePage
                                    ? <article className="wordle-overlay__welcome">
                                        <h3 className="wordle-overlay__title">{hasGameInProgress ? "Welcome Back" : "Wordle"}</h3>
                                        <p className="wordle-overlay__welcome-message">{hasGameInProgress ? `You've made ${currentRow} of ${setting.guessAmount} guess. Keep trying, you're on the right track!` : "Guess the hidden word within a limited number of attempts"}</p>
                                        <div className="wordle-welcome__button-container">
                                            <button
                                                className="wordle-overlay__button"
                                                onClick={() => setSettingPage(true)}
                                            >Setting</button>
                                            <button
                                                className="wordle-overlay__button"
                                                onClick={() => setTutorialPage(true)}
                                            >How to Play</button>
                                        </div>
                                        <div className="wordle-welcome__button-container">
                                            {hasGameInProgress
                                                ? <>
                                                    <button
                                                        className="wordle-overlay__button wordle-overlay__button-big"
                                                        onClick={() => startGame(true)}
                                                    > New Game </button>
                                                    <button
                                                        className="wordle-overlay__button wordle-overlay__button-big"
                                                        onClick={() => startGame()}
                                                    > Resume </button>
                                                </>
                                                : <button
                                                    className="wordle-overlay__button wordle-overlay__button-big"
                                                    onClick={() => startGame()}
                                                > Start Game</button>}
                                        </div>
                                    </article>
                                    : null}
                                {tutorialPage
                                    ? <article className="wordle-overlay__default">
                                        <h3 className="wordle-overlay__title">How To Play</h3>
                                        <h4 className="wordle-overlay__subtitle">Game Play</h4>
                                        <ul className="wordle-tutorial__list">
                                            <li>Guess the Word Within a Set Number of Attempts</li>
                                            <li>Tile colors will change to indicate how close your guess is to the target word.</li>
                                            <li>Hints will deduct points, and the number of available hints is related to the number of letters in each word.</li>
                                            <li>Revealing the answer will display the solution and deduct a larger number of points from your current score.</li>
                                            <li>When the timer runs out, the game will end. You can adjust the timer in the settings.</li>
                                            <li>Points are awarded for each correct letter in the correct spot. Total points are based on the selected difficulty level.</li>
                                        </ul>
                                        <h4 className="wordle-overlay__subtitle">Examples</h4>
                                        {/* Examples */}
                                        <div className="wordle-tutorial__example-row">
                                            {["d", "e", "l", "t", "a"].map((letter, index) => (
                                                <div
                                                    className="wordle-gameboard__cell"
                                                    key={"wordle-tutorial__example-row-1-letter-" + index}
                                                    style={{
                                                        backgroundColor: letter === "l" ? color["correct"] : null,
                                                        color: letter === "l" ? "var(--secondary-color)" : "var(--primary-color)"
                                                    }}
                                                >
                                                    <span>{letter}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="wordle-tutorial__example-text">The letter <strong>L</strong> is in the word and in the correct spot.</p>
                                        <div className="wordle-tutorial__example-row">
                                            {["s", "h", "a", "k", "e"].map((letter, index) => (
                                                <div
                                                    className="wordle-gameboard__cell"
                                                    key={"wordle-tutorial__example-row-2-letter-" + index}
                                                    style={{
                                                        backgroundColor: letter === "e" ? color["partial"] : null,
                                                        color: letter === "e" ? "var(--secondary-color)" : "var(--primary-color)"
                                                    }}
                                                >
                                                    <span>{letter}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="wordle-tutorial__example-text">The letter <strong>E</strong> is in the word but not in the correct spot.</p>
                                        <div className="wordle-tutorial__example-row">
                                            {["r", "e", "b", "u", "s"].map((letter, index) => (
                                                <div
                                                    className="wordle-gameboard__cell"
                                                    key={"wordle-tutorial__example-row-3-letter-" + index}
                                                    style={{
                                                        backgroundColor: letter === "r" ? color["incorrect"] : null,
                                                        color: letter === "r" ? "var(--secondary-color)" : "var(--primary-color)"
                                                    }}
                                                >
                                                    <span>{letter}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="wordle-tutorial__example-text"> The letter <strong>R</strong> is not in the word in any position.</p>

                                        <button
                                            className="wordle-overlay__button wordle-overlay__button-big"
                                            onClick={() => setTutorialPage(false)}
                                        >{welcomePage ? "Return" : "Resume"}</button>
                                    </article>
                                    : null}
                                {settingPage
                                    ? <article className="wordle-overlay__default wordle-overlay__setting">
                                        <h3 className="wordle-overlay__title">Settings</h3>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Number of Letters</h4>
                                                <p className="wordle-setting__description">Adjust the number of letters</p>
                                            </div>
                                            <DropDown content={possibleLetterAmount} name = {"lettercount"}/>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Number of Guesses</h4>
                                                <p className="wordle-setting__description">Adjust the number of guesses</p>
                                            </div>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Hints</h4>
                                                <p className="wordle-setting__description">Enable or disable hints</p>
                                            </div>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Reveal Anwser</h4>
                                                <p className="wordle-setting__description">Enable or disable reveal answer option</p>
                                            </div>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Timer</h4>
                                                <p className="wordle-setting__description">Enable or disable the timer</p>
                                            </div>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Amount of Time</h4>
                                                <p className="wordle-setting__description">Adjust the amount of time</p>
                                            </div>
                                        </div>
                                        <div className="wordle-overlay__setting-module">
                                            <div className="wordle-setting__text">
                                                <h4 className="wordle-setting__title">Sound</h4>
                                                <p className="wordle-setting__description">Adjust sound effects for actions</p>
                                            </div>
                                        </div>

                                        <div className="wordle-welcome__button-container">
                                            <button
                                                className="wordle-overlay__button wordle-overlay__button-big"
                                                onClick={() => setSettingPage(false)}
                                            > Cancel </button>
                                            <button
                                                className="wordle-overlay__button wordle-overlay__button-big"
                                                onClick={() => setSettingPage(false)}
                                            > Apply </button>
                                        </div>
                                    </article>
                                    : null}
                            </div>
                            : null
                    }


                    {/* Display the information */}
                    <header className="wordle__information-display">
                        <div className="wordle__information-format">
                            <p>Current Score</p>
                            <p>{setting.currentScore}</p>
                        </div>
                        {setting.enableTimer ?
                            <div className="wordle__information-format">
                                <p>Timer</p>
                                <p>{formatTime(currentTime)}</p>
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
                                            {cell.content !== 0 ? <span>{cell.content}</span> : null}
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
                            <button onClick={() => setSettingPage(true)}></button>
                            <button onClick={() => setTutorialPage(true)}></button>
                        </div>
                        <div className="wordle__footer-right">
                            <div className="wordle-footer__button-container">
                                <button
                                    className="wordle-footer__hints"
                                    onClick={(event) => showHint(event)}
                                >Show Hint</button>
                                <p className="wordle-footer__hints-message">{enableHints ? `Hints Remaining: ${setting.hintAmount}` : "Disabled"}</p>
                            </div>


                            <div className="wordle-footer__button-container">
                                <button
                                    className="wordle-footer__hints"
                                    onClick={(event) => revealAnwser(event)}
                                >Reveal Answer</button>
                                {!enableAnwserReveal
                                    ? <p className="wordle-footer__hints-message">Disabled</p>
                                    : null}
                            </div>
                        </div>
                    </footer>
                </section>
                : null}
        </PageTransition>
    )
}

export default Wordle