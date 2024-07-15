const GameDisplay = ({ game }) => {
    return (
        <article className="gamedisplay__content-display">
            <div className="gamedisplay__image-container">
                <img
                    className="gamedisplay__image"
                    src={`/game-image/${game.name.toLowerCase()}.jpg`}
                    alt=""
                />
            </div>
            <aside className="gamedisplay__information-container">
                <h4 className="gamedisplay__title">{game.name}</h4>
                <p className="gamedisplay__description">{game.description}</p>
            </aside>
        </article>
    )
}

export default GameDisplay;