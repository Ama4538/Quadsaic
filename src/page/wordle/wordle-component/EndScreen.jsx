import { motion } from "framer-motion"

const EndScreen = ({
    highestScore,
    currentScore,
    word,
    wordCompleted,
    totalHintsUsed,
    totalRevealAnwserUsed,
    pointMultiplier,
    currentStreak,
    highestStreak,
    streakBonus,
    updatePage,
    resetGame,
    pageAnimation,
}) => {
    return (
        <motion.article
            className="wordle-overlay__small wordle-overlay__small-big"
            variants={pageAnimation}
            initial="init"
            animate="animate"
        >
            <h3 className="wordle-overlay__title">{highestScore === currentScore && highestScore !== 0
                ? "New High Score!"
                : "Game Over"
            }</h3>
            <p className="wordle-overlay__welcome-message">That was a tough one! The word was "<strong>{word}</strong>" <br /> Want to try again?</p>
            <div className="wordle-overly__endscreen-information">
                <div className="wordle__information-format">
                    <p>Current Score</p>
                    <p>{currentScore}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Highest Score</p>
                    <p>{highestScore}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Words Completed</p>
                    <p>{wordCompleted}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Current Streak</p>
                    <p>{currentStreak}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Highest Streak</p>
                    <p>{highestStreak}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Streak Bonus</p>
                    <p>{streakBonus}</p>
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