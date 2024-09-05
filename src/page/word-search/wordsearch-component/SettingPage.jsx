import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"
import DropDown from "./../../../components/dropdown/DropDown"
import useCheckClickOutside from "../../../components/hooks/useCheckClickOutside";

// Setting drop menu option
const possibleGridSize = [10, 15, 20, 25, 30];
const possibleGuessAmountMultiplier = [0.25, 0.50, 0.75, 1, 1.25, 1.50, 1.75, 2];
const possibleTimeAmount = [5, 10, 15, 20, 25, 30, 35]

// All possible points adjustments
const girdSizePointIncrease = {
    10: -0.05,
    15: 0,
    20: 0.10,
    25: 0.175,
    30: 0.25,
}
const guessAmountMultiplierPointIncrease = {
    0.25: 0.40,
    0.50: 0.20,
    0.75: 0.15,
    1: 0.10,
    1.25: 0.075,
    1.50: 0,
    1.75: -0.075,
    2: -0.12,
}
const timeAmountPointIncrease = {
    5: 0.50,
    10: 0.25,
    15: 0.10,
    20: 0,
    25: -0.05,
    30: -0.10,
    35: -0.175,
}

const SettingPage = ({
    updateSelectedSettings,
    gridSize,
    guessAmountMultiplier,
    enableGuessLimit,
    enableAnwserReveal,
    enableTimer,
    timeAmount,
    soundAmount,
    cancelSetting,
    applySetting,
    pointMultiplier,
    updatePointMultiplier,
    pageAnimation,
    enableStagePage
}) => {

    // Setting State
    const [changesMade, setChangesMade] = useState(false)

    // ref used to close when not clicked inside
    const settingRef = useRef(null)
    useCheckClickOutside(settingRef, cancelSetting)

    // // Auto adjust points based on settings
    useEffect(() => {
        updatePointMultiplier(adjustedPointMultiplier());
    }, [gridSize, guessAmountMultiplier, timeAmount, enableGuessLimit, enableAnwserReveal, enableTimer])

    // Handle point multiplier
    const adjustedPointMultiplier = () => {
        let newPointMultipler = 1;

        // Increase points if enable
        if (enableTimer) {
            const defaultTimerIncrease = 0.25;
            newPointMultipler = newPointMultipler + defaultTimerIncrease + timeAmountPointIncrease[timeAmount / 60];
        }

        if (enableGuessLimit) {
            const defaultEnableGuessIncrease = 0.15;
            newPointMultipler = newPointMultipler + defaultEnableGuessIncrease + guessAmountMultiplierPointIncrease[guessAmountMultiplier];
        }

        // Increase points if disable
        if (!enableAnwserReveal) {
            const defaultAnwerRevealIncrease = 0.05
            newPointMultipler = newPointMultipler + defaultAnwerRevealIncrease
        }

        newPointMultipler = newPointMultipler + girdSizePointIncrease[gridSize];
        return newPointMultipler.toString().length < 4 ? newPointMultipler.toFixed(1) : newPointMultipler.toFixed(2);
    }

    // Update ChangeMade 
    const updateChangesMade = (value) => {
        if (!changesMade) {
            setChangesMade(value)
        }
    }

    return (
        <motion.article
            className="wordle-overlay__default wordle-overlay__setting"
            ref={settingRef}
            variants={pageAnimation}
            initial="init"
            animate="animate"
        >
            <h3 className="wordle-overlay__title">Settings</h3>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Size of Grid</h4>
                    <p className="wordle-setting__description">Adjust the game board size</p>
                </div>
                <DropDown
                    content={possibleGridSize}
                    name={"gridSize"}
                    startingValue={gridSize}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
                />
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Guesses (Multiplier)</h4>
                    <p className="wordle-setting__description">Adjust the number of allow guesses relative to word list</p>
                </div>
                <DropDown
                    content={possibleGuessAmountMultiplier}
                    name={"guessAmountMultiplier"}
                    startingValue={guessAmountMultiplier}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
                    large={true}
                />
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Enable Guess Limit</h4>
                    <p className="wordle-setting__description">Enable or disable guess limit</p>
                </div>
                <button
                    className="wordle-setting__button"
                    data-active={enableGuessLimit}
                    style={{ backgroundColor: enableGuessLimit ? `#48552b` : "rgba(0, 0, 0, 0.25)" }}
                    onClick={() => {
                        updateSelectedSettings("enableGuessLimit", !enableGuessLimit)
                        updateChangesMade(true)
                    }}
                >
                    <span className="wordle-setting__switch"></span>
                </button>
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Reveal Anwser</h4>
                    <p className="wordle-setting__description">Enable or disable reveal answer option</p>
                </div>
                <button
                    className="wordle-setting__button"
                    data-active={enableAnwserReveal}
                    style={{ backgroundColor: enableAnwserReveal ? `#48552b` : "rgba(0, 0, 0, 0.25)" }}
                    onClick={() => {
                        updateSelectedSettings("enableAnwserReveal", !enableAnwserReveal)
                        updateChangesMade(true)
                    }}
                >
                    <span className="wordle-setting__switch"></span>
                </button>
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Timer</h4>
                    <p className="wordle-setting__description">Enable or disable the timer</p>
                </div>
                <button
                    className="wordle-setting__button"
                    data-active={enableTimer}
                    style={{ backgroundColor: enableTimer ? `#48552b` : "rgba(0, 0, 0, 0.25)" }}
                    onClick={() => {
                        updateSelectedSettings("enableTimer", !enableTimer)
                        updateChangesMade(true)
                    }}
                >
                    <span className="wordle-setting__switch"></span>
                </button>
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Show Completion Screen</h4>
                    <p className="wordle-setting__description">Enable or disable the page shown after completing each board</p>
                </div>
                <button
                    className="wordle-setting__button"
                    data-active={enableStagePage}
                    style={{ backgroundColor: enableStagePage ? `#48552b` : "rgba(0, 0, 0, 0.25)" }}
                    onClick={() => {
                        updateSelectedSettings("enableStagePage", !enableStagePage)
                        updateChangesMade(true)
                    }}
                >
                    <span className="wordle-setting__switch"></span>
                </button>
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Amount of Time</h4>
                    <p className="wordle-setting__description">Adjust the duration of the game in minutes</p>
                </div>
                <DropDown
                    content={possibleTimeAmount}
                    name={"timeAmount"}
                    startingValue={timeAmount / 60}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
                    sort={false}
                />
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Sound</h4>
                    <p className="wordle-setting__description">Adjust sound effects for actions</p>
                </div>
                <div className="wordle-setting__range-container">
                    <input
                        className="wordle-setting__range"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={soundAmount}
                        onChange={(event) => {
                            updateSelectedSettings("soundAmount", event.target.value)
                            updateChangesMade(true)
                        }}
                    />
                    <span>{Math.floor(soundAmount * 100)}</span>
                </div>
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Point Multiplier</h4>
                    <p className="wordle-setting__description">Automatically set based on selected settings (not adjustable).</p>
                </div>
                <span>{pointMultiplier}x</span>
            </div>

            <div className="wordle-welcome__button-container">
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => cancelSetting()}
                > Cancel </button>
                <button
                    className="wordle-overlay__button wordle-overlay__button-big"
                    onClick={() => { changesMade ? applySetting() : null }}
                    data-active={changesMade}
                > Apply </button>
            </div>
        </motion.article>
    )
}

export default SettingPage