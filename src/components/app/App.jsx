import { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "../router/AnimatedRoutes"
import Loader from "../../page/loader/Loader";

function App() {
    // Data loader state
    const [wordleDataLoaded, setWordleDataLoaded] = useState(false);
    const [wordSearchDataLoaded, setWordSearchDataLoaded] = useState(false);

    // Settings
    const [wordleSetting, setWordleSetting] = useState({});
    const [wordSearchSetting, setWordSearchSetting] = useState({})

    // Vairables

    const defaultWordleSetting = {
        currentWord: "",
        gameBoard: [],
        completedWords: [],
        lettersAttempt: [],
        lettersFound: [],
        end: false,
        enableTimer: false,
        timerAmount: 180,
        currentScore: 0,
        highestScore: 0,
        guessAmount: 6,
        letterCount: 5,
        enableHints: true,
        hintAmount: 0,
        totalHintsUsed: 0,
        enableAnwserReveal: true,
        totalRevealAnwserUsed: 0,
        soundAmount: 0.50,
        pointMultiplier: 1,
        currentStreak: 0,
        highestStreak: 0,
        streakBonusPoint: 0,
    }

    const defaultWordSearchSetting = {
        gameBoard: [],
        gridSize: 15,
        currentScore: 0,
        highestScore: 0,
        wordsFound: [],
        wordsRequired: [],
        totalWordsFound: 0,
        streakBonusPoint: 0,
        currentStreak: 0,
        highestStreak: 0,
        enableTimer: false,
        timerAmount: 900,
        enableAnwserReveal: true,
        enableGuessLimit: false,
        totalRevealAnwserUsed: 0,
        guessAmountMultiplier: 1.50,
        guessAmount: 0,
        guessUsed: 0,
        soundAmount: 0.50,
        pointMultiplier: 1,
        end: false,
    }

    // Get data from localStorage
    useEffect(() => {
        const wordleSettingStorage = localStorage.getItem("wordleSettingStorage");
        const wordSearchSettingStorage = localStorage.getItem("wordSearchSettingStorage");

        // Checking and loading wordle setting data
        if (wordleSettingStorage !== null) {
            try {
                // Parse and set wordleSetting state
                const parseWordleSettingStorage = JSON.parse(wordleSettingStorage);
                setWordleSetting(parseWordleSettingStorage);

                // Update loaded state
                setWordleDataLoaded(true);
            } catch (error) {
                console.error("Error parsing wordleSettingStorage:", error);
            }
        } else {
            // If no data exists in localStorage, initialize with default setting
            localStorage.setItem("wordleSettingStorage", JSON.stringify(defaultWordleSetting));
            setWordleSetting(defaultWordleSetting);
            setWordleDataLoaded(true);
        }

        // Checking and loading word search setting data
        if (wordSearchSettingStorage !== null) {
            try {
                const parseWordSearchSettingStorage = JSON.parse(wordSearchSettingStorage);
                setWordSearchSetting(parseWordSearchSettingStorage);
                setWordSearchDataLoaded(true);
            } catch (error) {
                console.error("Error parsing wordSearchSettingStorage:", error);
            }
        } else {
            // If no data exists in localStorage, initialize with default setting
            localStorage.setItem("wordSearchSettingStorage", JSON.stringify(defaultWordSearchSetting));
            setWordSearchSetting(defaultWordSearchSetting); 
            setWordSearchDataLoaded(true);
        }

    }, []);

    // Update wordle setting in storage
    useEffect(() => {
        if (wordleDataLoaded) {
            localStorage.setItem("wordleSettingStorage", JSON.stringify(wordleSetting));
        }
    }, [wordleSetting, wordleDataLoaded])

    // Update word search setting in storage
    useEffect(() => {
        if (wordSearchDataLoaded) {
            localStorage.setItem("wordSearchSettingStorage", JSON.stringify(wordSearchSetting));
        }
    }, [wordSearchSetting, wordSearchDataLoaded])

    // Function to update settings
    const updateWordleSetting = (newSetting) => {
        setWordleSetting(newSetting)
    }

    const updateWordSearchSetting = (newSetting) => {
        setWordSearchSetting(newSetting)
    }

    return (
        wordSearchDataLoaded && wordleDataLoaded
            ? (
                <BrowserRouter>
                    <AnimatedRoutes
                        wordleSetting={wordleSetting}
                        updateWordleSetting={updateWordleSetting}
                        wordSearchSetting={wordSearchSetting}
                        updateWordSearchSetting={updateWordSearchSetting}
                    />
                </BrowserRouter>
            ) : (
                <Loader />
            )
    )
}

export default App
