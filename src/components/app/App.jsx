import { useState, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "../router/AnimatedRoutes"
import Loader from "../../page/loader/Loader";

function App() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [wordleSetting, setWordleSetting] = useState({});

    const defaultWordleSetting = {
        currentWord: "",
        gameBoard: [],
        completedWords: [],
        lettersAttempt: [],
        lettersFound: [],
        start: false,
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

    const updateWordleSetting = (newSetting) => {
        setWordleSetting(newSetting)
    }

    return (
        dataLoaded
            ? (
                <BrowserRouter>
                    <AnimatedRoutes
                        wordleSetting={wordleSetting}
                        updateWordleSetting={updateWordleSetting}
                    />
                </BrowserRouter>
            ) : (
                <Loader />
            )
    )
}

export default App
