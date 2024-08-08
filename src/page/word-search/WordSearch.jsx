// libraires
import { useEffect, useRef, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import GameBoard from "./wordsearch-component/GameBoard";
import WordList from "./wordsearch-component/WordList";
import WelcomePage from "./wordsearch-component/WelcomePage";
import Timer from "../../components/timer/Timer";
import TutorialPage from "./wordsearch-component/TutorialPage";
import SettingPage from "./wordsearch-component/SettingPage";
import EndScreen from "./wordsearch-component/EndScreen";

// Variables
import WordSearchAnimation from "./wordsearch-component/WordSearchAnimation";

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

const POINTS_PER_LETTER = 3;
const color = ["#664d00", "#6e2a0c", "#691312", "#5d0933", "#3e304c", "#1d424e", "#12403c", "#475200"];

const WordSearch = ({ setting, updateSetting }) => {
    // useEffect(() => {
    //     console.log(setting);
    // }, [setting])

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
        foundColor: null,
        text: null,
        found: false,
        x: null,
        y: null,
    }

    // State

    // Game State
    const [initializeGameBoard, setInitializeGameBoard] = useState(false);
    const [hasGameInProgress, setHasGameInProgress] = useState(false);

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false);

    // status
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [settingsApplied, setSettingsApplied] = useState(false);

    // Message
    const [message, setMessage] = useState("EMPTY")
    const [showMessage, setShowMessage] = useState(false)

    // Timer
    const [currentTime, setCurrentTime] = useState(0)

    // Data
    const [gridSize, setGrid] = useState(0)
    const [enableTimer, setEnableTimer] = useState(false)
    const [timeAmount, setTimeAmount] = useState(0)
    const [soundAmount, setSoundAmount] = useState(0)
    const [pointMultiplier, setPointMultiplier] = useState(1);
    const [enableAnwserReveal, setEnableAnwserReveal] = useState(false);
    const [enableGuessLimit, setEnableGuessLimit] = useState(false);
    const [guessAmountMultiplier, setGuessAmountMultiplier] = useState(1);
    const [totalPoints, setTotalPoints] = useState(0);
    const [revealAnwser, setRevealAnwser] = useState(false);

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

    // Variable

    // Ref to timeout timer
    const timeoutRef = useRef(null);

    // Audio
    const correctAudio = new Audio(correctSound);
    const submitAudio = new Audio(submitSound);
    const hintAudio = new Audio(hintSound);
    const revealAudio = new Audio(revealSound);
    const endAudio = new Audio(endSound);
    const errorAudio = new Audio(errorSound);

    correctAudio.volume = setting.soundAmount;
    submitAudio.volume = setting.soundAmount;
    hintAudio.volume = setting.soundAmount;
    revealAudio.volume = setting.soundAmount;
    endAudio.volume = setting.soundAmount;
    errorAudio.volume = setting.soundAmount;

    // Animations
    const {
        animationController,
        pageAnimation
    } = WordSearchAnimation()

    // useEffect

    // Get the game board
    useEffect(() => {
        if ((setting.gameBoard).length === 0) {
            const InitialGameBoard = Array(setting.gridSize).fill().map(() => Array(setting.gridSize).fill(defaultCell));
            const newWordsRequired = generateWordSet(setting.gridSize)
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: InitialGameBoard,
                    wordsRequired: newWordsRequired,
                }
            ))
            setInitializeGameBoard(true)
        }
        
        // Check if game was refresh at end screen
        if (setting.end) {
            resetGame()
        }

        setDataLoadingStatus(true);
    }, [setting.gridSize])

    // initialize the gameboard with anwsers and check for progress
    useEffect(() => {
        if (dataLoadingStatus) {
            setHasGameInProgress(setting.currentScore !== 0 || setting.currentStreak !== 0)
            setGrid(setting.gridSize)
            setEnableTimer(setting.enableTimer)
            setTimeAmount(setting.timerAmount)
            setCurrentTime(setting.timerAmount)
            setSoundAmount(setting.soundAmount)
            setPointMultiplier(setting.pointMultiplier)
            setEnableAnwserReveal(setting.enableAnwserReveal)
            setEnableGuessLimit(setting.enableGuessLimit)
            setGuessAmountMultiplier(setting.guessAmountMultiplier)
        }

        if (dataLoadingStatus && initializeGameBoard) {
            // Making a copy of game board and required words
            const updatedGameBoard = (setting.gameBoard).map(row =>
                row.map(cell => ({ ...cell }))
            );
            let newWordsRequired = [...setting.wordsRequired];
            const wordsToRemove = [];

            // Adding each required words into the board
            for (let i = 0; i < newWordsRequired.length; i++) {
                // Remove the word if it cannot fit
                if (!placeWord(newWordsRequired[i], updatedGameBoard)) {
                    wordsToRemove.push(newWordsRequired[i].word)
                }
            }
            // Check if there is words to remove
            if (wordsToRemove.length !== 0) {
                newWordsRequired = newWordsRequired.filter(element => !wordsToRemove.includes(element.word))
            }

            // Fill in the remaining spaces
            updatedGameBoard.forEach(row => {
                row.forEach(cell => {
                    if (cell.content === 0) {
                        // Generating random letter with ascii
                        cell.content = String.fromCharCode(Math.floor(Math.random() * (24) + 97))
                    }
                });
            });

            // Update information
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: updatedGameBoard,
                    wordsRequired: newWordsRequired,
                    guessAmount: Math.round(newWordsRequired.length * guessAmountMultiplier)
                }
            ))
            setInitializeGameBoard(false);
        }
    }, [dataLoadingStatus, initializeGameBoard, setting.gridSize])

    // Point System
    useEffect(() => {
        // Update total popints based on streak multiplier from current streak
        const streakBonusMultiplier = (1 + (setting.currentStreak * 0.125));
        const newTotal = Math.round(POINTS_PER_LETTER * setting.pointMultiplier * streakBonusMultiplier)
        setTotalPoints(newTotal)
    }, [setting.currentStreak, setting.pointMultiplier])

    // Functions

    const resetGame = (resetPoints = true, featureUsed = "") => {
        const InitialGameBoard = Array(setting.gridSize).fill().map(() => Array(setting.gridSize).fill(defaultCell));
        const newWordsRequired = generateWordSet(setting.gridSize)

        // Streaks
        const newCurrentStreak = featureUsed === 'reveal' ? 0 : setting.currentStreak + 1;
        const newHighestStreak = newCurrentStreak >= setting.highestStreak ? newCurrentStreak : setting.highestStreak;

        let timeoutTime = 0;

        // Adding message
        if (!resetPoints) {
            updateMessage("Great job! You've found all the words!")
            timeoutTime = 750
        }

        console.log("reset");
        

        setTimeout(() => {
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: InitialGameBoard,
                    wordsRequired: newWordsRequired,
                    wordsFound: [],
                    currentStreak: resetPoints ? 0 : newCurrentStreak,
                    currentScore: resetPoints ? 0 : prev.currentScore,
                    highestStreak: resetPoints ? 0 : newHighestStreak,
                    totalWordsFound: resetPoints ? 0 : prev.totalWordsFound,
                    streakBonusPoint: resetPoints ? 0 : prev.streakBonusPoint,
                    guessUsed: resetPoints ? 0 : prev.guessUsed,
                    totalRevealAnwserUsed: resetPoints ? 0 : prev.totalRevealAnwserUsed,
                    end: false,
                }
            ))
            setInitializeGameBoard(true)
        }, timeoutTime)

    }

    // Get the new required words
    const generateWordSet = (gridSize) => {
        const totalCell = gridSize * gridSize;
        // Generate enough words to fill at most 50% of the game board
        let cellSpace = totalCell * 0.50;
        let allPossibleLetterCount = [];
        const wordSet = [];

        while (cellSpace > 3) {
            // Generate random amount of x letters words
            if (cellSpace >= 7) {
                allPossibleLetterCount = [4, 5, 6, 7]
            } else if (cellSpace === 6) {
                allPossibleLetterCount = [4, 5, 6]
            } else if (cellSpace === 5) {
                allPossibleLetterCount = [4, 5]
            } else {
                allPossibleLetterCount = [4]
            }

            // Get word randomly
            const newWord = useFetchWord(allPossibleLetterCount[Math.floor(Math.random() * allPossibleLetterCount.length)])

            // Making sure each word is unqiue
            if (!wordSet.some(currentWord => currentWord.word === newWord)) {
                cellSpace = cellSpace - newWord.length
                wordSet.push({
                    word: newWord,
                    found: false,
                    x: null,
                    y: null,
                    direction: null,
                })
            }
        }

        // Sort by word
        return wordSet.sort((a, b) => {
            if (a.word < b.word) {
                return -1;
            } else if (a.word > b.word) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    // Place the word into the board
    const placeWord = (currentWord, updatedGameBoard) => {
        // Variables
        const wordArray = (currentWord.word).split("")
        let placed = false;
        let attempts = 0;

        // Find random location and place the word
        do {
            // Cannot place after 10 attempts
            if (attempts === 15) {
                return false
            }

            // Getting positions
            let randomX = Math.floor(Math.random() * (setting.gameBoard).length);
            let randomY = Math.floor(Math.random() * (setting.gameBoard).length);

            if (updatedGameBoard[randomY][randomX].content === 0) {
                // Find all possible direction the word can be placed
                let direction = [];
                let possibleDiagonals = ["up-right", "up-left", "down-right", "down-left"]

                if (randomY - wordArray.length > 0) {
                    direction.push("up")
                }
                if (randomY + wordArray.length < updatedGameBoard.length) {
                    direction.push("down")
                }
                if (randomX - wordArray.length > 0) {
                    direction.push("left")
                }
                if (randomX + wordArray.length < updatedGameBoard.length) {
                    direction.push("right")
                }

                for (let i = 0; i < wordArray.length; i++) {
                    if (randomX + i >= updatedGameBoard.length || randomY - i < 0) {
                        possibleDiagonals = possibleDiagonals.filter(element => element != "up-right")
                    }
                    if (randomX - i < 0 || randomY - i < 0) {
                        possibleDiagonals = possibleDiagonals.filter(element => element != "up-left")
                    }
                    if (randomX + i >= updatedGameBoard.length || randomY + i >= updatedGameBoard.length) {
                        possibleDiagonals = possibleDiagonals.filter(element => element != "down-right")
                    }
                    if (randomX - i < 0 || randomY + i >= updatedGameBoard.length) {
                        possibleDiagonals = possibleDiagonals.filter(element => element != "down-left")
                    }
                }

                direction = direction.concat(possibleDiagonals)

                if (direction.length <= 0) {
                    continue;
                }

                const placement = direction[Math.floor(Math.random() * direction.length)]
                let canPlace = true;

                // Manage each possible directions
                if (placement === "up") {
                    // Checking if the spot is empty and does have a letter overlap
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY - i][randomX].content !== 0 && updatedGameBoard[randomY - i][randomX].content !== wordArray[(wordArray.length - 1) - i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY - i][randomX].content = wordArray[(wordArray.length - 1) - i];
                        }
                    }
                } else if (placement === "down") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY + i][randomX].content !== 0 && updatedGameBoard[randomY + i][randomX].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY + i][randomX].content = wordArray[i];
                        }
                    }
                } else if (placement === "left") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY][randomX - i].content !== 0 && updatedGameBoard[randomY][randomX - i].content !== wordArray[(wordArray.length - 1) - i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY][randomX - i].content = wordArray[(wordArray.length - 1) - i];
                        }
                    }
                } else if (placement === "right") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY][randomX + i].content !== 0 && updatedGameBoard[randomY][randomX + i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY][randomX + i].content = wordArray[i];
                        }
                    }
                } else if (placement === "up-right") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY - i][randomX + i].content !== 0 && updatedGameBoard[randomY - i][randomX + i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY - i][randomX + i].content = wordArray[i];
                        }
                    }
                } else if (placement === "up-left") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY - i][randomX - i].content !== 0 && updatedGameBoard[randomY - i][randomX - i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY - i][randomX - i].content = wordArray[(wordArray.length - 1) - i];
                        }
                    }
                } else if (placement === "down-right") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY + i][randomX + i].content !== 0 && updatedGameBoard[randomY + i][randomX + i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY + i][randomX + i].content = wordArray[i];
                        }
                    }
                } else if (placement === "down-left") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY + i][randomX - i].content !== 0 && updatedGameBoard[randomY + i][randomX - i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY + i][randomX - i].content = wordArray[(wordArray.length - 1) - i];
                        }
                    }
                }

                // Update information
                if (canPlace) {
                    placed = true;
                    currentWord.x = randomX;
                    currentWord.y = randomY;
                    currentWord.direction = placement;
                }

                attempts++;
            }
        } while (!placed)

        // Word was sucessfully placed
        return true;
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
                updateSetting(prev => ({
                    ...prev,
                    end: true,
                }))
                break;
            default:
                break;
        }
    }

    // Setting dropdown menu update
    const updateSelectedSettings = (property, value) => {
        switch (property) {
            case "gridSize":
                setGrid(value)
                break;
            case "guessAmountMultiplier":
                setGuessAmountMultiplier(value);
                break;
            case "timeAmount":
                setTimeAmount(value * 60);
                break;
            case "enableGuessLimit":
                setEnableGuessLimit(value)
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
        updateCurrentTime(timeAmount);
        updateSetting(prev => (
            {
                ...prev,
                gridSize: gridSize,
                guessAmount: Math.round(prev.wordsRequired.length * guessAmountMultiplier),
                guessAmountMultiplier: guessAmountMultiplier,
                enableAnwserReveal: enableAnwserReveal,
                enableGuessLimit: enableGuessLimit,
                enableTimer: enableTimer,
                soundAmount: soundAmount,
                timerAmount: timeAmount,
                pointMultiplier: pointMultiplier
            }
        ))
        setSettingsApplied(true);

        if (endPage) {
            updatePage("end", false)
        }
    }

    // Use a useEffect to reset the game after the settings have been updated
    useEffect(() => {
        if (settingsApplied) {
            resetGame();  
            setSettingsApplied(false);
        }
    }, [settingsApplied]);

    // Cancel setting change
    const cancelSetting = () => {
        setSettingPage(false);
        setEnableAnwserReveal(setting.enableAnwserReveal);
        setGrid(setting.gridSize);
        setEnableTimer(setting.enableTimer);
        setTimeAmount(setting.timerAmount);
        setGuessAmountMultiplier(setting.guessAmountMultiplier);
        setSoundAmount(setting.soundAmount);
        setEnableGuessLimit(setting.enableGuessLimit)
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
        }, 750)
    }

    // Update the current time
    const updateCurrentTime = (value) => {
        setCurrentTime(value)
    }

    // Update reveal anwser status
    const updateRevealAnwser = (value) => {
        setRevealAnwser(value)
    }

    // handle guess amount
    const updateGuessAmount = () => {
        let newGuessAmount = setting.guessAmount - 1

        if (newGuessAmount <= 0 && enableGuessLimit) {
            updatePage("end", true)
        } else {
            errorAudio.play();
        }

        updateSetting(prev => (
            {
                ...prev,
                guessUsed: prev.guessUsed + 1,
                guessAmount: enableGuessLimit ? newGuessAmount : prev.guessAmount,
            }
        ))
    }

    return (
        <PageTransition>
            <Nav location={"Word Search"} />
            {dataLoadingStatus
                ?
                <main className="wordsearch">
                    <div
                        className="wordle__message"
                        data-message={showMessage ? true : false}
                    >
                        <p>{message}</p>
                    </div>
                    {
                        overlayStatus
                            ? <div className="wordle__overlay">
                                {/* Generate the page when they are active */}
                                {welcomePage
                                    ? <WelcomePage
                                        updatePage={updatePage}
                                        pageAnimation={pageAnimation}
                                        hasGameInProgress={hasGameInProgress}
                                        amountOfWordsFound={(setting.wordsFound).length}
                                        amountOfWords={(setting.wordsRequired).length}
                                        resetGame={resetGame}
                                    />
                                    : null}
                                {endPage
                                    ? <EndScreen
                                        highestScore={setting.highestScore}
                                        currentScore={setting.currentScore}
                                        wordCompleted={setting.totalWordsFound}
                                        totalRevealAnwserUsed={setting.totalRevealAnwserUsed}
                                        pointMultiplier={setting.pointMultiplier}
                                        currentStreak={setting.currentStreak}
                                        highestStreak={setting.highestStreak}
                                        streakBonus={setting.streakBonusPoint}
                                        guessAmount={setting.guessUsed}
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
                                        updateSelectedSettings={updateSelectedSettings}
                                        gridSize={gridSize}
                                        guessAmountMultiplier={guessAmountMultiplier}
                                        enableGuessLimit={enableGuessLimit}
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


                    <header className="wordle__information-display">
                        <div className="wordle__information-format">
                            <p>Current Score</p>
                            <p>{setting.currentScore}</p>
                        </div>
                        <div className="wordle__information-format">
                            <p>Streak</p>
                            <p>{setting.currentStreak}</p>
                        </div>
                        {setting.enableGuessLimit
                            ? <div className="wordle__information-format">
                                <p>Guesses</p>
                                <p>{setting.guessAmount}</p>
                            </div>
                            : null}
                        {setting.enableTimer
                            ? <div className="wordle__information-format">
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

                    <section className="wordsearch__content">
                        <WordList
                            gridSize={setting.gridSize}
                            list={setting.wordsRequired}
                            wordsFound={setting.wordsFound}
                        />
                        <GameBoard
                            color={color}
                            gameBoard={setting.gameBoard}
                            list={setting.wordsRequired}
                            updateSetting={updateSetting}
                            wordsFound={setting.wordsFound}
                            points={totalPoints}
                            resetGame={resetGame}
                            correctAudio={correctAudio}
                            submitAudio={submitAudio}
                            hintAudio={hintAudio}
                            revealAnwser={revealAnwser}
                            updateRevealAnwser={updateRevealAnwser}
                            revealAudio={revealAudio}
                            streakBonusPoint={setting.streakBonusPoint}
                            pointMultiplier={setting.pointMultiplier}
                            POINTS_PER_LETTER={POINTS_PER_LETTER}
                            updateGuessAmount={updateGuessAmount}
                            end = {setting.end}
                            totalWordsFound = {setting.totalWordsFound}
                        />
                    </section>
                    <footer className="wordle__footer">
                        <div className="wordle__footer-left">
                            <button onClick={() => setSettingPage(true)}></button>
                            <button onClick={() => setTutorialPage(true)}></button>
                        </div>
                        <div className="wordle__footer-right">

                            <button
                                className="wordle-footer__hints"
                                onClick={(event) => {
                                    if (setting.enableAnwserReveal && !isButtonDisabled) {
                                        event.target.blur()
                                        setIsButtonDisabled(true);
                                        updateRevealAnwser(true)

                                        setTimeout(() => {
                                            setIsButtonDisabled(false);
                                        }, 750);
                                    }
                                }}
                                data-active={setting.enableAnwserReveal && !isButtonDisabled}
                            >Reveal Answer</button>

                            <button
                                className="wordle-footer__hints"
                                onClick={() => {
                                    updatePage("end", true)
                                }}
                            >Give Up</button>
                        </div>
                    </footer>
                </main>

                : null
            }
        </PageTransition>
    )
}

export default WordSearch