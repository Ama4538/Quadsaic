import { motion } from "framer-motion"

const WelcomePage = ({
    hasGameInProgress,
    currentRow,
    guessAmount,
    updatePage,
    resetGame,
    pageAnimation
}) => {

    return (
        <motion.article
            className="wordle-overlay__small"
            variants={pageAnimation}
            initial = "init"
            animate = "animate"
        >
            <h3 className="wordle-overlay__title">{hasGameInProgress ? "Welcome Back" : "Wordle"}</h3>
            <p className="wordle-overlay__welcome-message">{hasGameInProgress ? `You've made ${currentRow} of ${guessAmount} guess. Keep trying, you're on the right track!` : "Guess the hidden word within a limited number of attempts"}</p>
            <div className="wordle-welcome__button-container">
                <button
                    className="wordle-overlay__button"
                    onClick={() => updatePage("setting", true)}
                >Setting</button>
                <button
                    className="wordle-overlay__button"
                    onClick={() => updatePage("tutorial", true)}
                >How to Play</button>
            </div>
            <div className="wordle-welcome__button-container">
                {hasGameInProgress
                    ? <>
                        <button
                            className="wordle-overlay__button wordle-overlay__button-big"
                            onClick={() => {
                                updatePage("welcome", false)
                                resetGame()
                            }}
                        > New Game </button>
                        <button
                            className="wordle-overlay__button wordle-overlay__button-big"
                            onClick={() => {
                                updatePage("welcome", false)
                            }}
                        > Resume </button>
                    </>
                    : <button
                        className="wordle-overlay__button wordle-overlay__button-big"
                        onClick={() => {
                            updatePage("welcome", false)
                        }}
                    > Start Game</button>}
            </div>
        </motion.article>
    )
}

export default WelcomePage