const KeyBoard = ({
    lettersAttempt,
    nextLine,
    removeLetter,
    updateLetter
}) => {
    // Handle Display KeyBoard Input 
    const handleDisplayKeyBoard = (letter, event) => {
        // Prevent focusable (enter key putting another letter)
        event.target.blur();

        // Condition for which button is pressed
        if (letter === "Enter") {
            nextLine();
        } else if (letter === "Delete") {
            removeLetter();
        } else {
            updateLetter(letter);
        }
    }

    // KeyBoard array
    const keyBoardDisplay = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["Enter", "z", "x", "c", "v", "b", "n", "m", "Delete"]
    ]

    return (
        <div className="wordle__keyboard">
            {/* Generating keyboard based on 2D array */}
            {keyBoardDisplay.map((row, rowNum) => (
                <div
                    className="wordle-keyboard__row"
                    key={"wordle-keyboard__row-" + rowNum}
                >
                    {row.map((letter, letterNum) => (
                        <div
                            className="wordle-keyboard__letter"
                            key={"wordle__gameboard-row-" + rowNum + "-letter-" + letterNum}
                        >
                            <button
                                className={letter.length > 1 ? "wordle-keyboard__button wordle-keyboard__button-big" : "wordle-keyboard__button"}
                                onClick={(event) => {
                                    handleDisplayKeyBoard(letter, event)
                                }}
                                style={{
                                    backgroundColor: (lettersAttempt).some(cell => cell.content === letter)
                                        ? (lettersAttempt)[(lettersAttempt).findIndex(cell => cell.content === letter)].backgroundColor
                                        : null,
                                    color: (lettersAttempt).some(cell => cell.content === letter)
                                        ? "var(--secondary-color)"
                                        : "var(--primary-color)",
                                }}
                            >
                                {letter}</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default KeyBoard