import { Link } from "react-router-dom";

const GameDisplay = ({ game }) => {
    // Reformated name for file and url
    const gameName = game.name.toLowerCase().replace(" ", "-");

    return (
        <article className="gamedisplay__content-display">
            <Link
                to={gameName}
                className="gamedisplay__image-container"
            >
                <img
                    className="gamedisplay__image"
                    src={`/game-image/${gameName}.jpg`}
                    alt=""
                />
            </Link>
            <aside className="gamedisplay__information-container">
                <h4 className="gamedisplay__title">{game.name}</h4>
                <p className="gamedisplay__description">{game.description}</p>
                <Link
                    className="gamedisplay__link"
                    to={gameName}
                >Play Game</Link>
            </aside>
        </article>
    )
}

export default GameDisplay;