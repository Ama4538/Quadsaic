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

    // State

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false)

    // UseEffect

    // Generate the game board
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

    // Funcations
    
    // Check every block to see if its valid
    const checkAllBlocks = (gameBoard) => {
        const currentGameBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))

        // Going through every block
        for (let i = 0; i < currentGameBoard.length; i++) {
            const currentBlock = currentGameBoard[i];
            // Sorting the current block based on content
            currentBlock.sort((a, b) => a.content - b.content);

            // Checking if current block contains 1 - currentBlock.length, where each value is unqiue
            for (let j = 0; j < currentBlock.length; j++) {
                if (currentBlock[j].content !== (j + 1)) {
                    return false;
                }
            }
        }

        // Default return value
        return true;
    }

    // Check every row to see if its valid
    const checkAllRows = (gameBoard) => {
        const increaseAmount = Math.sqrt(gameBoard.length);

        // Loop through the grid in blocks of increaseAmount
        for (let blockRow = 0; blockRow < gameBoard.length; blockRow += increaseAmount) {
            // For each block of increaseAmount arrays, extract increaseAmount rows (each row having gameBoard.length elements)
            for (let i = 0; i < increaseAmount; i++) {
                const row = [];
                for (let j = 0; j < increaseAmount; j++) {
                    row.push(...gameBoard[blockRow + j].slice(i * increaseAmount, i * increaseAmount + increaseAmount));
                }

                // Sorting the rows
                row.sort((a, b) => a.content - b.content)

                // Checking if the row is valid
                for (let k = 0; k < row.length; k++) {
                    if (row[k].content !== k + 1) {
                        return false;
                    }
                }
            }
        }

        // Default return value
        return true;
    }

    // Check every column to see if its valid
    const checkAllColumns = (gameBoard) => {
        const currentGameBoard = gameBoard.map(row => row.map(cell => ({ ...cell })))
        const increaseAmount = Math.sqrt(gameBoard.length);

        // Going to each columns block
        for (let blockColumn = 0; blockColumn < increaseAmount; blockColumn++) {
            // Going through each column in each column block
            for (let i = 0; i < increaseAmount; i++) {
                // The current column
                let column = [];

                // Going through each row of the current columns block
                for (let j = 0; j < increaseAmount; j++) {
                    // Going through each row of the current chunk
                    for (let k = 0; k < increaseAmount; k++) {
                        column.push(currentGameBoard[blockColumn + (j * increaseAmount)][(k * increaseAmount) + i])
                    }
                }

                // Sorting
                column.sort((a, b) => a.content - b.content);

                // Checking if the column is valid
                for (let j = 0; j < column.length; j++) {
                    if (column[j].content !== j + 1) {
                        console.log(column);
                        return false;
                    }
                }
            }
        }

        // Default return
        return true;
    }

    // Test Area
    useEffect(() => {

    }, [])



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

// column 1 is [5, 6,9,8,7,4,9,5,2] and column 2 is [3,7,1,5,6,2,6,3,8] .... 