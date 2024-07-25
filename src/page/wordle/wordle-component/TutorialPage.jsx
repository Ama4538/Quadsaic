const TutorialPage = ({color, welcomePage, updatePage}) => {
    return (
        <article className="wordle-overlay__default">
        <h3 className="wordle-overlay__title">How To Play</h3>
        <h4 className="wordle-overlay__subtitle">Game Play</h4>
        <ul className="wordle-tutorial__list">
            <li>Guess the Word Within a Set Number of Attempts</li>
            <li>Tile colors will change to indicate how close your guess is to the target word.</li>
            <li>Hints will deduct points, and the number of available hints is related to the number of letters in each word.</li>
            <li>Revealing the answer will display the solution and deduct a larger number of points from your current score.</li>
            <li>When the timer runs out, the game will end. You can adjust the timer in the settings.</li>
            <li>Points are awarded for each correct letter in the correct spot. Total points are based on the selected difficulty level.</li>
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
            onClick={() => updatePage("tutorial", false)}
        >{welcomePage ? "Return" : "Resume"}</button>
    </article>
    )
}

export default TutorialPage