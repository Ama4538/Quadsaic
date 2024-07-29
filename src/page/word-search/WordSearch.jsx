// libraires
import { useEffect, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"
import GameBoard from "./wordsearch-component/GameBoard";

// Hooks
import useFetchWord from "../../components/hooks/useFetchWord";

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
    const [initializeGameBoard, setInitializeGameBoard] = useState(false);

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(false);

    // useEffect

    // Get the game board
    useEffect(() => {
        if ((setting.gameBoard).length === 0) {
            const InitialGameBoard = Array(setting.gridSize).fill().map(() => Array(setting.gridSize).fill(defaultCell));
            const newWordsRequired = generateWordSet(setting.gridSize)
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: InitialGameBoard,
                    wordsRequired: newWordsRequired,
                }
            ))
            setInitializeGameBoard(true)
        }

        setDataLoadingStatus(true);
    }, [setting.gridSize])

    // initialize the gameboard with anwsers
    useEffect(() => {
        if (dataLoadingStatus && initializeGameBoard) {
            // Making a copy of game board and required words
            const updatedGameBoard = (setting.gameBoard).map(row =>
                row.map(cell => ({ ...cell }))
            );
            let newWordsRequired = [...(setting.wordsRequired)];
            const wordsToRemove = [];

            // Adding each required words into the board
            for (let i = 0; i < newWordsRequired.length; i++) {
                // Remove the word if it cannot fit
                if (!placeWord(newWordsRequired[i], updatedGameBoard)) {
                    wordsToRemove.push(newWordsRequired[i].word)
                }
            }

            // Check if there is words to remove
            if (wordsToRemove.length !== 0) {
                newWordsRequired = newWordsRequired.filter(element => !wordsToRemove.includes(element.word))
            }

            // Update information
            updateSetting(prev => (
                {
                    ...prev,
                    gameBoard: updatedGameBoard,
                    wordsRequired: newWordsRequired,
                }
            ))
            setInitializeGameBoard(false);
        }
    }, [dataLoadingStatus, initializeGameBoard])

    // Functions

    // Get the new required words
    const generateWordSet = (gridSize) => {
        const totalCell = gridSize * gridSize;
        // Generate enough words to fill at most 45% of the game board
        let cellSpace = totalCell * 0.45;
        let allPossibleLetterCount = [];
        const wordSet = [];

        while (cellSpace > 3) {
            // Generate random amount of x letters words
            if (cellSpace >= 7) {
                allPossibleLetterCount = [4, 5, 6, 7]
            } else if (cellSpace === 6) {
                allPossibleLetterCount = [4, 5, 6]
            } else if (cellSpace === 5) {
                allPossibleLetterCount = [4, 5]
            } else {
                allPossibleLetterCount = [4]
            }

            // Get word randomly
            const newWord = useFetchWord(allPossibleLetterCount[Math.floor(Math.random() * allPossibleLetterCount.length)])

            // Making sure each word is unqiue
            if (!wordSet.includes(currentWord => currentWord.word === newWord)) {
                cellSpace = cellSpace - newWord.length
                wordSet.push({
                    word: newWord,
                    x: null,
                    y: null,
                    direction: null,
                })
            }
        }

        // Sort by word
        return wordSet.sort((a, b) => {
            if (a.word < b.word) {
                return -1;
            } else if (a.word > b.word) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    // Place the word into the board
    const placeWord = (currentWord, updatedGameBoard) => {
        // Variables
        const wordArray = (currentWord.word).split("")
        let placed = false;
        let attempts = 0;

        // REMOVE
        const tempColors = ["#CF1259", "#DD7596", "#B7C3F3", "#4F6272", "#404E5C"]

        // Find random location and place the word
        do {
            // Cannot place after 10 attempts
            if (attempts === 10) {
                return false
            }

            // Getting positions
            let randomX = Math.floor(Math.random() * (setting.gameBoard).length);
            let randomY = Math.floor(Math.random() * (setting.gameBoard).length);

            if (updatedGameBoard[randomY][randomX].content === 0) {
                // Find all possible direction the word can be placed
                const direction = [];
                if (randomY - wordArray.length > 0) {
                    direction.push("up")
                }
                if (randomY + wordArray.length < updatedGameBoard.length) {
                    direction.push("down")
                }
                if (randomX - wordArray.length > 0) {
                    direction.push("left")
                }
                if (randomX + wordArray.length < updatedGameBoard.length) {
                    direction.push("right")
                }
                if (direction.length <= 0) {
                    continue;
                }

                // Add the word in a random direction
                const placement = direction[Math.floor(Math.random() * direction.length)]
                let canPlace = true;
                // REMOVE
                const currentColor = tempColors[Math.floor(Math.random() * tempColors.length)]

                // Manage each possible directions
                if (placement === "up") {
                    // Checking if the spot is empty and does have a letter overlap
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY - i][randomX].content !== 0 && updatedGameBoard[randomY - i][randomX].content !== wordArray[(wordArray.length - 1) - i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY - i][randomX].content = wordArray[(wordArray.length - 1) - i];
                            updatedGameBoard[randomY - i][randomX].backgroundColor = currentColor;
                        }
                    }
                } else if (placement === "down") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY + i][randomX].content !== 0 && updatedGameBoard[randomY + i][randomX].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY + i][randomX].content = wordArray[i];
                            updatedGameBoard[randomY + i][randomX].backgroundColor = currentColor;
                        }
                    }
                } else if (placement === "left") {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY][randomX - i].content !== 0 && updatedGameBoard[randomY][randomX - i].content !== wordArray[(wordArray.length - 1) - i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY][randomX - i].content = wordArray[(wordArray.length - 1) - i];
                            updatedGameBoard[randomY][randomX - i].backgroundColor = currentColor;
                        }
                    }
                } else {
                    for (let i = 0; i < wordArray.length; i++) {
                        if (updatedGameBoard[randomY][randomX + i].content !== 0 && updatedGameBoard[randomY][randomX + i].content !== wordArray[i]) {
                            canPlace = false;
                            break;
                        }
                    }
                    if (canPlace) {
                        for (let i = 0; i < wordArray.length; i++) {
                            updatedGameBoard[randomY][randomX + i].content = wordArray[i];
                            updatedGameBoard[randomY][randomX + i].backgroundColor = currentColor;
                        }
                    }
                }

                // Update information
                if (canPlace) {
                    currentWord.x = randomX;
                    currentWord.y = randomY;
                    currentWord.direction = placement;
                    placed = true;
                }

                attempts++;
            }
        } while (!placed)

        // Word was sucessfully placed
        return true;
    }

    return (
        <PageTransition>
            <Nav location={"Word Search"} />
            {dataLoadingStatus
                ? <main className="wordsearch">
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
                            gameBoard={setting.gameBoard}
                        />
                    </section>
                </main>
                : null
            }
        </PageTransition>
    )
}

export default WordSearch