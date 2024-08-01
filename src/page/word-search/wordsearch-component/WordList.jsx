const WordList = ({list, gridSize, wordsFound}) => {
    return (
        <div className="wordsearch__wordlist">
            <h4>Word List</h4>
            <ul
                style={{
                    gridTemplateColumns: `repeat(${gridSize === 10 ? 1 : (gridSize / 5) - 1}, 1fr)`
                }}
            >
                {list.map(element => (
                    <li 
                        key={"required-word-"+ element.word}
                        data-found = {wordsFound.includes(element.word)}    
                    >
                        {element.word}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WordList