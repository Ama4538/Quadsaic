import { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "../router/AnimatedRoutes"
import Loader from "../../page/loader/Loader";

function App() {
    // Data loader state
    const [dataLoaded, setDataLoaded] = useState(false);
    
    // Settings
    const [wordleSetting, setWordleSetting] = useState({});
    const [wordSearchSetting, setWordSearchSetting] = useState({
        gameBoard: [],
        gridSize: 15,
        currentScore: 0,
        highestScore: 0,
        wordsFound: [],
        wordsRequired: [],
    })

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

    useEffect(() => {
        const wordleSettingStorage = localStorage.getItem("wordleSettingStorage");

        // Checking and loading wordle setting data
        if (wordleSettingStorage !== null) {
            try {
                // Parse and set wordleSetting state
                const parseWordleSettingStorage = JSON.parse(wordleSettingStorage);
                setWordleSetting(parseWordleSettingStorage);

                // Update loaded state
                setDataLoaded(true);
            } catch (error) {
                console.error("Error parsing wordleSettingStorage:", error);
            }
        } else {
            // If no data exists in localStorage, initialize with default setting
            localStorage.setItem("wordleSettingStorage", JSON.stringify(defaultWordleSetting));
            setWordleSetting(defaultWordleSetting);
            setDataLoaded(true);
        }
    }, []);

    // Update wordle setting in storage
    useEffect(() => {
        if (dataLoaded) {
            localStorage.setItem("wordleSettingStorage", JSON.stringify(wordleSetting));
        }
    }, [wordleSetting])


    // Function to update settings
    const updateWordleSetting = (newSetting) => {
        setWordleSetting(newSetting)
    }

    const updateWordSearchSetting = (newSetting) => {
        setWordSearchSetting(newSetting)
    }

    return (
        dataLoaded
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
