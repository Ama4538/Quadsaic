import Nav from "../../components/nav/Nav"
import GameDisplay from "../../components/game-display/GameDisplay"

const Home = () => {

    // Array of all game object
    const gameDisplay = [
        {
            name: "Wordle",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Wordle",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Wordle",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Wordle",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        }
    ]

    return (
        <>
            <header className="home__header">
                <h1 className="home__header-title"> Quadsaic </h1>
                <h3 className="home__header-subtitle">Where Reimagination Meets Classics</h3>
            </header>
            <main className="home__main">
                <Nav />
                <div className="home-main__display-container">
                    <GameDisplay game={gameDisplay[0]} />
                </div>
            </main>
        </>
    )
}

export default Home