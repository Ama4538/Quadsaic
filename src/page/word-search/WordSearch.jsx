// libraires
import { useEffect, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import GameBoard from "./wordsearch-component/GameBoard";

const WordSearch = ({ setting, updateSetting }) => {
    useEffect(() => {
        console.log(setting);
    }, [setting])

    // Default cell used to updated proporties
    const defaultCell = {
        content: 0,
        backgroundColor: null,
    }

    // State

    // Game State
    const [gameBoard, setGameBoard] = useState([]);

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false);

    // useEffect

    // Get the game board
    useEffect(() => {
        if ((setting.gameBoard).length === 0) {
            const tempGameBoard = Array(setting.gridSize).fill().map(() => Array(setting.gridSize).fill(defaultCell));

            setGameBoard(tempGameBoard);
            // Start up the game
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: tempGameBoard,
                }
            ))
        } else {
            setGameBoard(setting.gameBoard);  
        }

        setDataLoadingStatus(true);
    }, [setting.gridSize])



    return (
        <PageTransition>
            <Nav location={"Word Search"} />
            <main className="wordsearch">
                <header className="wordle__information-display">
                    <div className="wordle__information-format">
                        <p>Current Score</p>
                        <p>{setting.currentScore}</p>
                    </div>
                    <div className="wordle__information-format">
                        <p>Timer</p>
                        <p>{0}</p>
                    </div>
                    <div className="wordle__information-format">
                        <p>Highest Score</p>
                        <p>{setting.highestScore}</p>
                    </div>
                </header>

                <section className="wordsearch__content">
                    <GameBoard 
                        gameBoard={gameBoard}
                    />
                </section>

            </main>
        </PageTransition>
    )
}

export default WordSearch