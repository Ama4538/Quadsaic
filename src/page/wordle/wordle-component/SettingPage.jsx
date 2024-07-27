import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"
import DropDown from "./../../../components/dropdown/DropDown"
import useCheckClickOutside from "../../../components/hooks/useCheckClickOutside";

const SettingPage = ({
    color,
    updateSelectedSettings,
    letterAmount,
    guessAmount,
    enableHints,
    enableAnwserReveal,
    enableTimer,
    timeAmount,
    soundAmount,
    cancelSetting,
    applySetting,
    pointMultiplier,
    updatePointMultiplier,
    pageAnimation
}) => {

    // Setting State
    const [changesMade, setChangesMade] = useState(false)

    // ref used to close when not clicked inside
    const settingRef = useRef(null)
    useCheckClickOutside(settingRef, cancelSetting)

    // Setting drop menu option
    const possibleLetterAmount = [4, 5, 6, 7];
    const possibleGuessAmount = [3, 4, 5, 6, 7, 8, 9, 10];
    const possibleTimeAmount = [1, 2, 3, 5, 7]

    // Auto adjust points based on settings
    useEffect(() => {
        updatePointMultiplier(adjustedPointMultiplier());
    }, [letterAmount, guessAmount, timeAmount, enableHints, enableAnwserReveal, enableTimer])

    // Handle point multiplier
    const adjustedPointMultiplier = () => {
        let newPointMultipler = 1;
        // All possible points adjustments
        const letterPointIncrease = {
            4: -0.10,
            5: 0,
            6: 0.20,
            7: 0.45
        }
        const guessPointIncrease = {
            3: 0.50,
            4: 0.25,
            5: 0.10,
            6: 0,
            7: -0.05,
            8: -0.10,
            9: -0.15,
            10: -0.20,
        }
        const timeAmountPointIncrease = {
            1: 0.25,
            2: 0.10,
            3: 0,
            5: -0.10,
            7: -0.15,
        }
        // Increase points if enable
        if (enableTimer) {
            const defaultTimerIncrease = 0.25;
            newPointMultipler = newPointMultipler + defaultTimerIncrease + timeAmountPointIncrease[timeAmount / 60];
        }
        // Increase points if disable
        if (!enableHints) {
            const defaultHintIncrease = 0.15;
            newPointMultipler = newPointMultipler + defaultHintIncrease;
        }
        if (!enableAnwserReveal) {
            const defaultAnwerRevealIncrease = 0.05
            newPointMultipler = newPointMultipler + defaultAnwerRevealIncrease
        }

        newPointMultipler = newPointMultipler + letterPointIncrease[letterAmount] + guessPointIncrease[guessAmount]
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
                    <h4 className="wordle-setting__title">Number of Letters</h4>
                    <p className="wordle-setting__description">Adjust the number of letters</p>
                </div>
                <DropDown
                    content={possibleLetterAmount}
                    name={"letterAmount"}
                    startingValue={letterAmount}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
                />
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Number of Guesses</h4>
                    <p className="wordle-setting__description">Adjust the number of guesses</p>
                </div>
                <DropDown
                    content={possibleGuessAmount}
                    name={"guessAmount"}
                    startingValue={guessAmount}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
                    sort = {false}
                />
            </div>
            <div className="wordle-overlay__setting-module">
                <div className="wordle-setting__text">
                    <h4 className="wordle-setting__title">Hints</h4>
                    <p className="wordle-setting__description">Enable or disable hints</p>
                </div>
                <button
                    className="wordle-setting__button"
                    data-active={enableHints}
                    style={{ backgroundColor: enableHints ? `${color["correct"]}` : "rgba(0, 0, 0, 0.25)" }}
                    onClick={() => {
                        updateSelectedSettings("enableHints", !enableHints)
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
                    style={{ backgroundColor: enableAnwserReveal ? `${color["correct"]}` : "rgba(0, 0, 0, 0.25)" }}
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
                    style={{ backgroundColor: enableTimer ? `${color["correct"]}` : "rgba(0, 0, 0, 0.25)" }}
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
                    <h4 className="wordle-setting__title">Amount of Time</h4>
                    <p className="wordle-setting__description">Adjust the duration of the game in minutes</p>
                </div>
                <DropDown
                    content={possibleTimeAmount}
                    name={"timeAmount"}
                    startingValue={timeAmount / 60}
                    setSelected={updateSelectedSettings}
                    updateChangesMade={updateChangesMade}
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