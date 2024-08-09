import { useRef } from "react"
import { motion } from "framer-motion"
import useCheckClickOutside from "../../../components/hooks/useCheckClickOutside"

const TutorialPage = ({
    color,
    welcomePage,
    updatePage,
    pageAnimation }) => {
    // ref used to close when not clicked inside
    const tutorialRef = useRef(null)

    const changePage = () => {
        updatePage("tutorial", false)
    }

    useCheckClickOutside(tutorialRef, changePage)

    return (
        <motion.article
            className="wordle-overlay__default"
            ref={tutorialRef}
            variants={pageAnimation}
            initial="init"
            animate="animate"
        >
            <h3 className="wordle-overlay__title">How To Play</h3>
            <h4 className="wordle-overlay__subtitle">Game Play</h4>
            <ul className="wordle-tutorial__list">
                <li><strong>Game: </strong>Guess the word within a set number of attempts. After each guess, the tile colors will change to indicate how close your guess is to the target word.</li>
                <li><strong>Hints: </strong>Hints will deduct points, and the number of available hints is related to the number of letters in each word.</li>
                <li><strong>Reveal Anwser: </strong>Revealing the answer will display the solution and deduct a larger number of points from your current score.</li>
                <li><strong>Timer: </strong>When the timer runs out, the game will end. You can adjust the timer in the settings.</li>
                <li><strong>Streaks: </strong>Streaks are achieved by guessing consecutive words correctly </li> 
                <li><strong>Bonsu Points: </strong>Bonus points are awarded based on your current streak. Using the reveal answer option will reset your streak.</li>
                <li><strong>Scoring: </strong>Points are awarded for each correct letter in the correct spot. Total points are based on the selected difficulty level.</li>
            </ul>
            <h4 className="wordle-overlay__subtitle">Examples</h4>
            {/* Examples */}
            <div className="wordle-tutorial__example-row">
                {["d", "e", "l", "t", "a"].map((letter, index) => (
                    <div
                        className="wordle-gameboard__cell"
                        key={"wordle-tutorial__example-row-1-letter-" + index}
                        style={{
                            backgroundColor: letter === "l" ? color["correct"] : null,
                            color: letter === "l" ? "var(--secondary-color)" : "var(--primary-color)"
                        }}
                    >
                        <span>{letter}</span>
                    </div>
                ))}
            </div>
            <p className="wordle-tutorial__example-text">The letter <strong>L</strong> is in the word and in the correct spot.</p>
            <div className="wordle-tutorial__example-row">
                {["s", "h", "a", "k", "e"].map((letter, index) => (
                    <div
                        className="wordle-gameboard__cell"
                        key={"wordle-tutorial__example-row-2-letter-" + index}
                        style={{
                            backgroundColor: letter === "e" ? color["partial"] : null,
                            color: letter === "e" ? "var(--secondary-color)" : "var(--primary-color)"
                        }}
                    >
                        <span>{letter}</span>
                    </div>
                ))}
            </div>
            <p className="wordle-tutorial__example-text">The letter <strong>E</strong> is in the word but not in the correct spot.</p>
            <div className="wordle-tutorial__example-row">
                {["r", "e", "b", "u", "s"].map((letter, index) => (
                    <div
                        className="wordle-gameboard__cell"
                        key={"wordle-tutorial__example-row-3-letter-" + index}
                        style={{
                            backgroundColor: letter === "r" ? color["incorrect"] : null,
                            color: letter === "r" ? "var(--secondary-color)" : "var(--primary-color)"
                        }}
                    >
                        <span>{letter}</span>
                    </div>
                ))}
            </div>
            <p className="wordle-tutorial__example-text"> The letter <strong>R</strong> is not in the word in any position.</p>

            <button
                className="wordle-overlay__button wordle-overlay__button-big"
                onClick={() => changePage()}
            >{welcomePage ? "Return" : "Resume"}</button>
        </motion.article>
    )
}

export default TutorialPage