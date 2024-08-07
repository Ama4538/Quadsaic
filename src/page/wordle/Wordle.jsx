// libraires
import { useEffect, useRef, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import WelcomePage from "./wordle-component/WelcomePage";
import TutorialPage from "./wordle-component/TutorialPage";
import SettingPage from "./wordle-component/SettingPage";
import EndScreen from "./wordle-component/EndScreen";
import GameBoard from "./wordle-component/GameBoard";
import KeyBoard from "./wordle-component/KeyBoard";
import Timer from "../../components/timer/Timer";
import Loader from "../loader/Loader"

// Variables
import WordleAnimations from "./wordle-component/WordleAnimations"

// Hooks
import useFetchWord from "../../components/hooks/useFetchWord";
import useOverlayManagement from "../../components/hooks/useOverlayManagement";

// Sound
import correctSound from "/sound/correct.mp3"
import errorSound from "/sound/error.mp3"
import submitSound from "/sound/submit.mp3"
import hintSound from "/sound/hint.mp3"
import revealSound from "/sound/reveal.mp3"
import endSound from "/sound/end.mp3"

// Constants
const BASE_POINT = 125;

// Colors
const color = {
    correct: "#48552b",
    partial: "#a9903e",
    incorrect: "#3b3e41",
    reveal: "#781626",
}

const Wordle = ({ setting, updateSetting }) => {
    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        textColor: null,
    }

    // States

    // Game State
    const [currentRow, setCurrentRow] = useState(0)
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
    const [pointMultiplier, setPointMultiplier] = useState(1);
    const [totalPoints, setTotalPoints] = useState(0);

    // Overlay
    const {
        overlayStatus,
        welcomePage,
        settingPage,
        tutorialPage,
        endPage,
        setWelcomePage,
        setSettingPage,
        setTutorialPage,
        setEndPage,
    } = useOverlayManagement();

    // Variables

    // Ref to timeout timer
    const timeoutRef = useRef(null);

    // Audio
    const correctAudio = new Audio(correctSound);
    const errorAudio = new Audio(errorSound);
    const submitAudio = new Audio(submitSound);
    const hintAudio = new Audio(hintSound);
    const revealAudio = new Audio(revealSound);
    const endAudio = new Audio(endSound);

    correctAudio.volume = setting.soundAmount;
    errorAudio.volume = setting.soundAmount;
    submitAudio.volume = setting.soundAmount;
    hintAudio.volume = setting.soundAmount;
    revealAudio.volume = setting.soundAmount;
    endAudio.volume = setting.soundAmount;

    // Animations
    const {
        animationController,
        rowAnimation,
        cellAnimation,
        pageAnimation
    } = WordleAnimations()

    // UseEffect

    // Get the game board
    useEffect(() => {
        if (
            (setting.gameBoard).length === 0
            || (setting.gameBoard).length !== setting.guessAmount
            || (setting.letterCount) !== (setting.gameBoard)[0].length
        ) {
            const initialGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));
            const newWord = useFetchWord(setting.letterCount)
            // Start up the game
            updateSetting(prev => (
                {
                    ...prev,
                    currentWord: newWord,
                    gameBoard: initialGameBoard,
                    lettersFound: new Array(setting.letterCount).fill(null),
                    hintAmount: Math.floor(setting.letterCount / 2),
                }
            ))
        } else {
            let gameEnd = true;
            for (let i = 0; i < setting.gameBoard.length; i++) {
                // Check if the first cell in the row is unfilled (assuming 0 means unfilled)
                if (setting.gameBoard[i].some(cell => cell.content === 0)) {
                    gameEnd = false;
                    setCurrentRow(i);
                    break;
                }
            }

            // Check if game was refresh at end screen
            if (gameEnd || setting.end) {
                resetGame();
            }
        }

        setDataLoadingStatus(true);
    }, [setting.letterCount, setting.guessAmount])

    // Progress Checker
    useEffect(() => {
        if (dataLoadingStatus) {
            setHasGameInProgress(currentRow !== 0 || !(setting.gameBoard)[currentRow].every(cell => cell.content === 0) || setting.currentScore !== 0);
            // Update our data
            setEnableAnwserReveal(setting.enableAnwserReveal);
            setEnableHints(setting.enableHints);
            setEnableTimer(setting.enableTimer);
            setTimeAmount(setting.timerAmount);
            setCurrentTime(setting.timerAmount);
            setLetterAmount(setting.letterCount);
            setGuessAmount(setting.guessAmount);
            setSoundAmount(setting.soundAmount);
            setPointMultiplier(setting.pointMultiplier);
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
    }, [(setting.gameBoard), currentRow, overlayStatus])

    // Point System
    useEffect(() => {
        // Update total popints based on streak multiplier from current streak
        const streakBonusMultiplier = (1 + (setting.currentStreak * 0.02));
        const newTotal = Math.round(BASE_POINT * setting.pointMultiplier * streakBonusMultiplier)
        setTotalPoints(newTotal);
    }, [setting.currentStreak, setting.pointMultiplier])

    // Functions

    // Handled lettter press
    const updateLetter = (letter) => {
        // Check if row is valid
        if (currentRow >= setting.guessAmount) {
            return;
        }

        // Deep copying gameboard to update
        const updatedGameBoard = (setting.gameBoard).map(row =>
            row.map(cell => ({ ...cell }))
        );
        const updateRow = updatedGameBoard[currentRow]
        const workingLetterIndex = updateRow.findIndex(cell => cell.content === 0);

        // Seeing if the spot is valid and updating
        if (workingLetterIndex > -1) {
            updateRow[workingLetterIndex].content = letter;
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
        const updatedGameBoard = [...(setting.gameBoard)];
        const updateRow = updatedGameBoard[currentRow]
        let workingLetterIndex = updateRow.findIndex(cell => cell.content === 0);

        // Updating the current letter index
        if (workingLetterIndex === 0) {
            // At the start
            return;
        } else if (workingLetterIndex === -1) {
            // At the end
            workingLetterIndex = (setting.gameBoard)[currentRow].length - 1;
        } else {
            // At the middle
            workingLetterIndex = workingLetterIndex - 1;
        }

        updateRow[workingLetterIndex].content = 0;
        updateSetting(prev => (
            {
                ...prev,
                gameBoard: updatedGameBoard,
            }
        ))
    }

    // Handle next line 
    const nextLine = () => {
        // Out of Guess
        if (currentRow >= setting.guessAmount - 1) {
            updateMessage("Game Over")
            setTimeout(() => {
                updatePage("end", true)
            }, 1000)
        }

        // Creating a copy of the game board
        const updatedGameBoard = [...(setting.gameBoard)];

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
                correctAudio.play();
                updateMessage("The Word has been Found!")
                setTimeout(() => {
                    resetGame(false, pointsGained)
                }, 1000)
            } else {
                // Update the game
                submitAudio.play();
                const newScore = Math.round(setting.currentScore + pointsGained);
                setCurrentRow(currentRow + 1);
                updateSetting(prev => (
                    {
                        ...prev,
                        gameBoard: updatedGameBoard,
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
    const resetGame = (resetPoints = true, points = 0, featureUsed = "") => {
        // Update row
        setCurrentRow(0);

        // Creating a new board
        const newGameBoard = Array(setting.guessAmount).fill().map(() => Array(setting.letterCount).fill(defaultCell));

        // Reset Timer
        updateCurrentTime(setting.timerAmount);

        // Manage found words
        const completedWords = setting.completedWords;
        completedWords.push(setting.currentWord);

        // Get new and unqiue word
        let newWord;
        do {
            newWord = useFetchWord(setting.letterCount);
        } while (completedWords.includes(newWord));

        const newScore = Math.round(setting.currentScore + points)

        // Update our total reveal used
        const newTotalRevealAnwserUsed = featureUsed === 'reveal' ? setting.totalRevealAnwserUsed + 1 : setting.totalRevealAnwserUsed;
        // Streaks
        const newCurrentStreak = featureUsed === 'reveal' ? 0 : setting.currentStreak + 1;
        const newHighestStreak = newCurrentStreak >= setting.highestStreak ? newCurrentStreak : setting.highestStreak;
        const newStreakBonus = featureUsed === 'reveal' ? setting.streakBonusPoint : setting.streakBonusPoint + Math.round(totalPoints - (BASE_POINT * setting.pointMultiplier));


        // reset required information
        updateSetting(prev => (
            {
                ...prev,
                currentWord: newWord,
                gameBoard: newGameBoard,
                completedWords: resetPoints ? [] : completedWords,
                lettersAttempt: [],
                lettersFound: new Array(setting.letterCount).fill(null),
                currentScore: resetPoints ? 0 : newScore,
                highestScore: newScore >= prev.highestScore ? newScore : prev.highestScore,
                hintAmount: Math.floor(setting.letterCount / 2),
                totalHintsUsed: resetPoints ? 0 : prev.totalHintsUsed,
                totalRevealAnwserUsed: resetPoints ? 0 : newTotalRevealAnwserUsed,
                currentStreak: resetPoints ? 0 : newCurrentStreak,
                highestStreak: resetPoints ? 0 : newHighestStreak,
                streakBonusPoint: resetPoints ? 0 : newStreakBonus,
                end: resetPoints ? true : false,
            }
        ))
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
        // Prevent focusable (enter key  calling the hint button again)
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
        const pointsToRemove = totalPoints / (setting.letterCount * 1.50);
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
                currentScore: Math.round(prev.currentScore - pointsLost),
                hintAmount: prev.hintAmount - 1,
                totalHintsUsed: prev.totalHintsUsed + 1,
            }
        ))

        hintAudio.play();
    }

    // reveal the anwser
    const revealAnwser = (event) => {
        // Prevent focusable (enter key  calling the button again)
        event.target.blur();

        // Creating a copy of the game board
        const updatedGameBoard = (setting.gameBoard).map(row =>
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
        updateSetting(prev => (
            {
                ...prev,
                gameBoard: updatedGameBoard,
            }
        ))
        const pointsToRemove = totalPoints / 2
        const pointsLost = setting.currentScore > pointsToRemove ? (pointsToRemove * -1) : (setting.currentScore * -1);

        updateMessage("The Word Has Been Revealed")

        // Reset the game and remove points
        setTimeout(() => {
            resetGame(false, pointsLost, "reveal")
        }, 1000)

        revealAudio.play();
    }

    // Update the current overly page
    const updatePage = (page, value) => {
        switch (page) {
            case "welcome":
                setWelcomePage(value)
                break;
            case "setting":
                setSettingPage(value);
                break;
            case "tutorial":
                setTutorialPage(value);
                break;
            case "end":
                if (value) {
                    endAudio.play()
                }
                setEndPage(value);
                break;
            default:
                break;
        }
    }

    // Setting dropdown menu update
    const updateSelectedSettings = (property, value) => {
        switch (property) {
            case "letterAmount":
                setLetterAmount(value);
                break;
            case "guessAmount":
                setGuessAmount(value);
                break;
            case "timeAmount":
                setTimeAmount(value * 60);
                break;
            case "enableHints":
                setEnableHints(value);
                break;
            case "enableAnwserReveal":
                setEnableAnwserReveal(value);
                break;
            case "enableTimer":
                setEnableTimer(value);
                break;
            case "soundAmount":
                const testAudio = new Audio(correctSound);
                testAudio.volume = value;
                testAudio.play();
                setSoundAmount(value)
                break;
            default:
                break;
        }
    }

    // Apply setting changes
    const applySetting = () => {
        setSettingPage(false);
        resetGame();
        updateCurrentTime(timeAmount);
        updateSetting(prev => (
            {
                ...prev,
                letterCount: letterAmount,
                guessAmount: guessAmount,
                enableAnwserReveal: enableAnwserReveal,
                enableHints: enableHints,
                enableTimer: enableTimer,
                soundAmount: soundAmount,
                timerAmount: timeAmount,
                pointMultiplier: pointMultiplier
            }
        ))

        if (endPage) {
            updatePage("end", false)
        }
    }

    // Cancel setting change
    const cancelSetting = () => {
        setSettingPage(false);
        setEnableAnwserReveal(setting.enableAnwserReveal);
        setEnableHints(setting.enableHints);
        setEnableTimer(setting.enableTimer);
        setTimeAmount(setting.timerAmount);
        setLetterAmount(setting.letterCount);
        setGuessAmount(setting.guessAmount);
        setSoundAmount(setting.soundAmount);
        setPointMultiplier(setting.pointMultiplier)
    }

    // Update the current point multiplier
    const updatePointMultiplier = (value) => {
        setPointMultiplier(value);
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

    // Update the current time
    const updateCurrentTime = (value) => {
        setCurrentTime(value)
    }

    return (
        <PageTransition>
            <Nav location={"wordle"} />
            <main className="wordle">
                {dataLoadingStatus
                    ? <>
                        {
                            overlayStatus
                                ? <div className="wordle__overlay">
                                    {/* Generate the page when they are active */}
                                    {welcomePage
                                        ? <WelcomePage
                                            hasGameInProgress={hasGameInProgress}
                                            currentRow={currentRow}
                                            guessAmount={setting.guessAmount}
                                            updatePage={updatePage}
                                            resetGame={resetGame}
                                            pageAnimation={pageAnimation}
                                        />
                                        : null}
                                    {endPage
                                        ? <EndScreen
                                            highestScore={setting.highestScore}
                                            currentScore={setting.currentScore}
                                            word={setting.currentWord}
                                            wordCompleted={(setting.completedWords).length}
                                            totalHintsUsed={setting.totalHintsUsed}
                                            totalRevealAnwserUsed={setting.totalRevealAnwserUsed}
                                            pointMultiplier={setting.pointMultiplier}
                                            currentStreak={setting.currentStreak}
                                            highestStreak={setting.highestStreak}
                                            streakBonus={setting.streakBonusPoint}
                                            updatePage={updatePage}
                                            resetGame={resetGame}
                                            pageAnimation={pageAnimation}
                                        />
                                        : null}
                                    {tutorialPage
                                        ? <TutorialPage
                                            color={color}
                                            welcomePage={welcomePage}
                                            updatePage={updatePage}
                                            pageAnimation={pageAnimation}
                                        />
                                        : null}
                                    {settingPage
                                        ? <SettingPage
                                            color={color}
                                            updateSelectedSettings={updateSelectedSettings}
                                            letterAmount={letterAmount}
                                            guessAmount={guessAmount}
                                            enableHints={enableHints}
                                            enableAnwserReveal={enableAnwserReveal}
                                            enableTimer={enableTimer}
                                            timeAmount={timeAmount}
                                            soundAmount={soundAmount}
                                            cancelSetting={cancelSetting}
                                            applySetting={applySetting}
                                            pointMultiplier={pointMultiplier}
                                            updatePointMultiplier={updatePointMultiplier}
                                            pageAnimation={pageAnimation}
                                        />
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
                            <div className="wordle__information-format">
                                <p>Streak</p>
                                <p>{setting.currentStreak}</p>
                            </div>
                            {setting.enableTimer ?
                                <div className="wordle__information-format">
                                    <p>Timer</p>
                                    <Timer
                                        overlayStatus={overlayStatus}
                                        enableTimer={enableTimer}
                                        currentTime={currentTime}
                                        updateCurrentTime={updateCurrentTime}
                                        updatePage={updatePage}
                                        updateMessage={updateMessage}
                                    />
                                </div>
                                : null
                            }
                            <div className="wordle__information-format">
                                <p>Highest Score</p>
                                <p>{setting.highestScore}</p>
                            </div>
                        </header>

                        <section className="wordle__content">
                            {/* Game Board */}
                            <GameBoard
                                gameBoard={setting.gameBoard}
                                message={message}
                                showMessage={showMessage}
                                currentRow={currentRow}
                                rowAnimation={rowAnimation}
                                cellAnimation={cellAnimation}
                                animationController={animationController}
                            />

                            {/* Keyboard */}
                            <KeyBoard
                                lettersAttempt={setting.lettersAttempt}
                                nextLine={nextLine}
                                removeLetter={removeLetter}
                                updateLetter={updateLetter}
                            />

                        </section>
                        <footer className="wordle__footer">
                            <div className="wordle__footer-left">
                                <button onClick={() => setSettingPage(true)}></button>
                                <button onClick={() => setTutorialPage(true)}></button>
                            </div>
                            <div className="wordle__footer-right">
                                <div className="wordle-footer__button-container">
                                    <button
                                        className="wordle-footer__hints"
                                        onClick={(event) => { setting.enableHints ? showHint(event) : null }}
                                        data-active={setting.enableHints}
                                    >Show Hint</button>
                                    <p className="wordle-footer__hints-message">{setting.enableHints ? `Hints Remaining: ${setting.hintAmount}` : "Disabled"}</p>
                                </div>

                                <button
                                    className="wordle-footer__hints"
                                    onClick={(event) => { setting.enableAnwserReveal ? revealAnwser(event) : null }}
                                    data-active={setting.enableAnwserReveal}
                                >Reveal Answer</button>

                                <button
                                    className="wordle-footer__hints"
                                    onClick={() => {
                                        updatePage("end", true)
                                        updateSetting(prev => ({
                                            ...prev,
                                            end: true,
                                        }))
                                    }}
                                >Give Up</button>
                            </div>
                        </footer>
                    </>
                    : <Loader />}
            </main>
        </PageTransition>
    )
}

export default Wordle