import { BrowserRouter } from "react-router-dom"
import AnimatedRoutes from "../router/AnimatedRoutes"
import { useState } from "react"

function App() {
    const [wordleSetting, setWordleSetting] = useState({
        currentWord: "",
        gameBoard: null,
        start: false,
        timer: false,
        timerAmount: 300,
        currentScore: 0,
        highestScore: 0,
        guessAmount: 6,
        letterCount: 5,
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
