const GameDisplay = ({ game }) => {
    return (
        <article className="gamedisplay__content-display">
            <h3 className="gamedisplay__content-name">{game.name}</h3>
            <div className="gamedisplay__image-container">
                <img
                    className="gamedisplay__image"
                    src={`/game-image/${game.name.toLowerCase()}.jpg`}
                    alt=""
                />
            </div>
        </article>
    )
}

export default GameDisplay;