// libraires
import { useEffect, useRef, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import GameBoard from "./sudoku-component/GameBoard";

const Sudoku = ({ setting, updateSetting }) => {
    // Default cell used to updated proporties
    const defaultCell = {
        content: 9,
    }

    useEffect(() => {
        console.log(setting);
    }, [setting])

    // State

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false)

    // UseEffect

    // Get the game board
    useEffect(() => {
        if ((setting.gameBoard).length === 0) {
            const InitialGameBoard = Array(setting.gridSize).fill().map(() => Array(setting.gridSize).fill().map(() => ({ ...defaultCell })));

            updateSetting(prev => ({
                ...prev,
                gameBoard: InitialGameBoard,
            }))
        }

        setDataLoadingStatus(true);
    }, [setting.gridSize])

    return (
        <PageTransition>
            <Nav location={"Sudoku"} />
            {
                dataLoadingStatus
                    ? <main className="sudoku">
                        {/* Information */}
                        <header className="wordle__information-display">
                            <div className="wordle__information-format">
                                <p>Current Score</p>
                                <p>{setting.currentScore}</p>
                            </div>
                            <div className="wordle__information-format">
                                <p>Highest Score</p>
                                <p>{setting.highestScore}</p>
                            </div>
                        </header>

                        <section className="sudoku__content">
                            <GameBoard
                                gameBoard={setting.gameBoard}
                            />
                        </section>
                        
                        <footer className="wordle__footer">
                            <div className="wordle__footer-left">
                                <button onClick={() => setSettingPage(true)}></button>
                                <button onClick={() => setTutorialPage(true)}></button>
                            </div>
                            <div className="wordle__footer-right">
                                <button
                                    className="wordle-footer__hints"
                                    onClick={(event) => {
                                        if (setting.enableAnwserReveal && !isButtonDisabled) {
                                            event.target.blur()
                                            updateRevealAnwser(true)

                                            if (setting.wordsFound.length === setting.wordsRequired.length - 1) {
                                                setIsButtonDisabled(true)

                                                setTimeout(() => {
                                                    setIsButtonDisabled(false);
                                                }, 750);
                                            }
                                        }
                                    }}
                                    data-active={setting.enableAnwserReveal && !isButtonDisabled}
                                >Reveal Answer</button>

                                <button
                                    className="wordle-footer__hints"
                                    onClick={() => {
                                        updatePage("end", true)
                                    }}
                                >Give Up</button>
                            </div>
                        </footer>
                    </main>
                    : null
            }
        </PageTransition>
    )
}

export default Sudoku