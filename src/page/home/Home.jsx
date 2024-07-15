import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "../../components/nav/Nav"
import GameDisplay from "../../components/game-display/GameDisplay"

const Home = () => {
    // State used to manage the current display
    const [currentDisplay, setCurrentDisplay] = useState(0);

    // Array of all game object
    const gameDisplay = [
        {
            name: "Wordle",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Word Search",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Sudoku",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "2048",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        }
    ]

    // Based on -25% to move to the next display
    const SLIDE_LENGTH = 25;

    const handleNextDisplay = (value) => {
        // Temp variable used to make calculation
        let currentSliderAmount = currentDisplay + (SLIDE_LENGTH * value)

        // Reset the length to the end if the start - 1 has been reach
        if (currentSliderAmount > 0) {
            currentSliderAmount = (gameDisplay.length - 1) * SLIDE_LENGTH * -1
            // Reset the length to the start if the end + 1 has been reach
        } else if (currentSliderAmount < (gameDisplay.length - 1) * SLIDE_LENGTH * -1) {
            currentSliderAmount = 0;
        }

        setCurrentDisplay(currentSliderAmount);
    }

    const sliderAnimation = {
        slide: {
            x: `${currentDisplay}%`,
            transition: {
                duration: 0.75,
                ease: [0.33, 1, 0.68, 1]
            }
        }
    }

    return (
        <>
            <header className="home__header">
                <h1 className="home__header-title"> Quadsaic </h1>
                <h3 className="home__header-subtitle">Where Reimagination Meets Classics</h3>
            </header>
            <main className="home__main">
                <Nav />

                <motion.section
                    className="home__display"
                >
                    <motion.div
                        className="home_display-inner"
                        variants={sliderAnimation}
                        animate="slide"
                    >
                        {gameDisplay.map((game, index) => (
                            <GameDisplay
                                game={game}
                                key={game + index + "homeDisplay"}
                            />
                        ))}
                    </motion.div>


                </motion.section>

                <div className="home__button-container">
                    <button
                        className="home__page-button"
                        onClick={() => { handleNextDisplay(1) }}
                    ></button>
                    <button
                        className="home__page-button"
                        onClick={() => { handleNextDisplay(-1) }}
                    ></button>
                </div>
            </main>
        </>
    )
}

export default Home