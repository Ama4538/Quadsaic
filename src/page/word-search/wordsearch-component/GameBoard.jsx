import { useEffect, useRef, useState } from "react";

const color = ["#113f39", "#374732", "#5d4e2a", "#624127", "#5c2c20"]

const GameBoard = ({ gameBoard, list, updateSetting }) => {
    // Create a ref for all cell
    const cellRefs = useRef([]);

    const [mouseDown, setMouseDown] = useState(false)
    const [selectedWord, setSelectedWord] = useState("");
    const [selectedCell, setSelectedCell] = useState([]);

    // Test
    useEffect(() => {
        if (!mouseDown) {
            const matchingWord = list.find(element => element.word === selectedWord);
            let selectedColor = null;

            if (matchingWord) {
                matchingWord.found = true;
                selectedColor = color[Math.floor(Math.random() * color.length)]
            }

            // Handled the coloring if the word is found
            selectedCell.forEach(cell => {
                if (!cell.found && selectedColor !== null) {
                    cell.backgroundColor = selectedColor;
                    cell.foundColor = selectedColor;
                    cell.text = "var(--secondary-color)";
                    cell.found = true;
                } else if (cell.found && selectedColor !== null) {
                    cell.backgroundColor = selectedColor;
                    cell.foundColor = selectedColor;
                } else if (cell.foundColor !== null) {
                    cell.backgroundColor = cell.foundColor;
                } else {
                    cell.backgroundColor = null;
                    cell.text = null;
                }
            })

            // Update data
            setSelectedWord("")
            setSelectedCell([])
            updateSetting(prev => ({
                ...prev,
                wordsRequired: list,
            }))
        }

    }, [mouseDown])

    // UseEffect

    // Handle font size change
    useEffect(() => {
        const adjustFontSize = () => {
            cellRefs.current.forEach(cell => {
                const newFontSize = cell.getBoundingClientRect().width * 0.65;
                cell.style.fontSize = `${newFontSize}px`;
            });
        };

        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);

        return () => {
            window.removeEventListener('resize', adjustFontSize);
        };
    }, [gameBoard]);

    // Function

    const updateSelectedCell = (cell) => {
        cell.backgroundColor = "var(--primary-color)"
        cell.text = "var(--secondary-color)"

        setSelectedWord(prev => prev + cell.content);
        setSelectedCell(prev => [...prev, cell])
    }

    return (
        <div 
        className="wordsearch__gameboard" 
        onMouseLeave={() => {setMouseDown(false)}}
        >
            {gameBoard.map((row, rowNum) => (
                <div
                    className="wordsearch-gameboard__row"
                    key={"wordsearch__gameboard-row-" + rowNum}
                >
                    {row.map((cell, cellNum) => (
                        <div
                            className="wordsearch-gameboard__cell"
                            key={"wordsearch__gameboard-row-" + rowNum + "-cell-" + cellNum}
                            style={{
                                backgroundColor: cell.backgroundColor !== null ? cell.backgroundColor : null,
                                color: cell.text !== null ? cell.text : null,
                            }}
                            // Create a unqiue index for the cell ref
                            ref={element => cellRefs.current[rowNum * gameBoard[0].length + cellNum] = element}
                            onMouseUp={() => { setMouseDown(false) }}
                            onMouseDown={() => {
                                setMouseDown(true);
                                updateSelectedCell(cell)
                            }}
                            onMouseEnter={() => { mouseDown ? updateSelectedCell(cell) : null }}
                        >
                            {/* Render the cell text if their is content */}
                            {cell.content !== 0 ? <span>{cell.content}</span> : null}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard