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

    const example = [
        ["w", "u1", "d", "j", "t","d"],
        ["o", "p1", "x", "n", "a","f"],
        ["u", "o1", "p", "x", "f","h"],
        ["c", "n4", "u4", "l4", "l4","u"],
        ["m", "d", "o", "m", "c","t"],
        ["b", "r", "v", "l", "o","p"],
    ]

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
                <li><strong>Game: </strong>Search for the words listed in the word list within the game board. Words can appear in any direction: horizontally, vertically, or diagonally.</li>
                <li><strong>Words: </strong>As you find each word, it will be highlighted in a random color and crossed off the list.</li>
                <li><strong>Timer: </strong>The game will end when the timer runs out. You can adjust the timer duration in the settings.</li>
                <li><strong>Streak: </strong>Complete multiple game boards consecutively to build streaks. Bonus points are awarded based on your current streak.</li>
                <li><strong>Reveal Answer: </strong>You can use the reveal answer feature to highlighting in red a randomly selected word that hasn't been found yet. However, using this feature will reduce your points and reset your streak..</li>
                <li><strong>Guess Limit: </strong>The guess limit restricts the number of guesses you can make, based on the current word list. Each guess counts if you select three or more letters. You can adjust the guess limit in the settings.</li>
                <li><strong>Scoring: </strong>Points are awarded based on the number of letters in each found word, and the total score depends on the selected difficulty level.</li>
            </ul>
            <h4 className="wordle-overlay__subtitle">Examples</h4>
            {/* Examples */}

            <div className="wordle-tutorial__example-row-highlight">
                {["R", "a", "n", "d", "o", "m"].map((letter) => (
                    <div
                        className="wordle-gameboard__cell"
                        key={"WordSearch-tutorial__example-highlight-letter-" + letter}
                    >
                        <span>{letter}</span>
                    </div>
                ))}
            </div>
            <p className="wordle-tutorial__example-text"><strong>Random</strong> is currently being selected</p>
            
            <div className="wordsearch-tutorial__container">
                {example.map((row, rowNum) => (
                    <div
                        className="wordle-tutorial__example-row"
                        key={"WordSearch-tutorial__example-row-" + rowNum}
                    >
                        {row.map((cell, cellNum) => (
                            <div
                                className="wordle-gameboard__cell"
                                key={"WordSearch-tutorial__example-row-" + rowNum + "-letter-" + cellNum}
                                style={{
                                    backgroundColor: cell.length === 2 ? color[parseInt(cell.charAt(1))] : null,
                                    color: cell.length === 2 ? "var(--secondary-color)" : "var(--primary-color)"
                                }}
                            >
                                <span>{cell.length === 2 ? cell.charAt(0) : cell}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <p className="wordle-tutorial__example-text">Both <strong>Upon</strong> and <strong>Null</strong> are on the word list</p>

            <button
                className="wordle-overlay__button wordle-overlay__button-big"
                onClick={() => changePage()}
            >{welcomePage ? "Return" : "Resume"}</button>
        </motion.article >
    )
}

export default TutorialPage