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
                <li>Search for the words listed in the word list within the game board.</li>
                <li>Each word you find will be highlighted in a random color and crossed off the list.</li>
                <li>When the timer runs out, the game will end. You can adjust the timer in the settings.</li>
                <li>Streaks are achieved by completing multiple game boards consecutively.</li>
                <li>Bonus points are awarded based on your current streak.</li>
                <li>Points are awarded for each letter in the found word. Total points are based on the selected difficulty level.</li>
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