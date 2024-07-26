import { motion } from "framer-motion"

const EndScreen = ({
    highScore,
    currentScore,
    word,
    wordCompleted,
    totalHintsUsed,
    totalRevealAnwserUsed,
    pointMultiplier,
    updatePage,
    resetGame,
    pageAnimation,
}) => {
    return (
        <motion.article
            className="wordle-overlay__small"
            variants={pageAnimation}
            initial="init"
            animate="animate"
        >
            <h3 className="wordle-overlay__title">{highScore === currentScore && highScore !== 0
                ? "New High Score!"
                : "Game Over"
            }</h3>
            <p className="wordle-overlay__welcome-message">That was a tough one! The word was <strong>{word}</strong>. Want to try again?</p>
            <div className="wordle-overly__endscreen-information">
                <div className="wordle__information-format">
                    <p>Current Score</p>
                    <p>{currentScore}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Highest Score</p>
                    <p>{currentScore}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Words completed</p>
                    <p>{wordCompleted}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Hints Used</p>
                    <p>{totalHintsUsed}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Reveal Used</p>
                    <p>{totalRevealAnwserUsed}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Point Multiplier</p>
                    <p>{pointMultiplier}x</p>
                </div>
            </div>
            <div className="wordle-welcome__button-container">
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => updatePage("setting", true)}
                > Setting </button>
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => {
                        updatePage("end", false)
                        resetGame()
                    }}
                > New Game </button>
            </div>
        </motion.article>
    )
}

export default EndScreen