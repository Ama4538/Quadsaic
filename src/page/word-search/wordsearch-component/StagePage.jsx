import { motion } from "framer-motion"

const StagePage = ({
    updatePage,
    pageAnimation,
    enableTimer,
    remainingTime,
    wordAmount,
    resetGame,
    stagePoint,
    stageStreakBonus,
    stageRevealUsed,
    stageGuessUsed,
    submitAudio,
}) => {
    
    //format the time
    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    submitAudio.play();

    return (
        <motion.article
            className="wordle-overlay__small overlay__stage-page"
            variants={pageAnimation}
            initial="init"
            animate="animate"
        >
            <h3 className="wordle-overlay__title">Congratulations!</h3>
            <p className="wordle-overlay__welcome-message">{enableTimer ? `You've found ${wordAmount} with ${formatTime(remainingTime)} remaining!` : `You've successfully  found all ${wordAmount} words from the list!`}</p>

            <div className="wordle-overly__stage-information">
                <div className="wordle__information-format">
                    <p>Total Stage Points</p>
                    <p>{stagePoint}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Stage Reveal Used</p>
                    <p>{stageRevealUsed}</p>
                </div>
                <div className="wordle__information-format">
                    <p>Streak Bonus Points</p>
                    <p>{stageStreakBonus}</p>
                </div>

                <div className="wordle__information-format">
                    <p>Attempted Guess</p>
                    <p>{stageGuessUsed}</p>
                </div>
            </div>
            <div className="wordle-welcome__button-container">
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => {
                        updatePage("end", true)
                        updatePage("stage", false)
                    }}
                > End Game </button>
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => {
                        updatePage("stage", false)
                        resetGame(false, "", true)
                    }}
                > Continue </button>
            </div>

        </motion.article >
    )
}

export default StagePage