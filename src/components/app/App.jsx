import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "../router/AnimatedRoutes"
import { useState } from "react"

function App() {
    const [wordleSetting, setWordleSetting] = useState({
        currentWord: "",
        gameBoard: [],
        completedWords: [],
        lettersAttempt: [],
        lettersFound: [],
        start: false,
        enableTimer: true,
        timerAmount: 180,
        currentScore: 0,
        highestScore: 0,
        guessAmount: 6,
        letterCount: 5,
        enableHints: true,
        hintAmount: 0,
        enableAnwserReveal: true,
        soundAmount: 0.50,
    });

    // Taken from local strage/update when need, Later.

    const updateWordleSetting = (newSetting) => {
        setWordleSetting(newSetting)
    }

    return (
        <BrowserRouter>
            <AnimatedRoutes
                wordleSetting={wordleSetting}
                updateWordleSetting={updateWordleSetting}
            />
        </BrowserRouter>
    )
}

export default App
