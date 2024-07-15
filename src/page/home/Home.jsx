import { useState } from "react";
import { motion } from "framer-motion";
import Nav from "../../components/nav/Nav"
import GameDisplay from "../../components/game-display/GameDisplay"
import PageTransition from "../../components/page-transition/PageTransition";

const Home = () => {
    // State used to manage the current display
    const [currentDisplay, setCurrentDisplay] = useState(0);

    // TitleArray
    const title = "Quadsaic";
    const titleArray = title.split("")

    // Based on -25% to move to the next display
    const SLIDE_LENGTH = 25;

    // Array of all game object
    const gameDisplay = [
        {
            name: "Wordle",
            description: " Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Word Search",
            description: " Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "Sudoku",
            description: " Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        },
        {
            name: "2048",
            description: " Eget felis eget nunc lobortis mattis aliquam. Sit amet facilisis magna etiam. Id leo in vitae turpis. Eu lobortis elementum nibh tellus molestie nunc non. Est velit egestas dui id ornare arcu odio ut. Morbi blandit cursus risus at ultrices mi tempus. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Interdum velit laoreet id donec ultrices tincidunt. Feugiat pretium nibh ipsum consequat nisl vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada."
        }
    ]

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

    return (
        <PageTransition>
            <header className="home__header">
                <motion.div
                    className="home__header-title-container"
                    variants={{
                        init: {
                            opacity: 0,
                        },
                        animate: {
                            opacity: 1,
                            transition: {
                                delay: 0.15,
                                duration: 1.25,
                                delayChildren: 0.15,
                                staggerChildren: 0.05,
                                ease: [0.33, 1, 0.68, 1],
                            }
                        }
                    }}
                    initial="init"
                    animate="animate"
                >
                    {titleArray.map((letter, index) => (
                        <motion.span
                            className="home__header-title"
                            key={letter + index + "hometitle"}
                            variants={{
                                init: {
                                    opacity: 0,
                                },
                                animate: {
                                    opacity: 1,
                                    transition: {
                                        duration: 0.75,
                                        ease: [0.33, 1, 0.68, 1],
                                    }
                                }
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.div>
                <div className="home__header-subtitle-container">
                    <motion.h3
                        className="home__header-subtitle"
                        initial={{
                            y: 60,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 0.75,
                            transition: {
                                delay: 0.65,
                                duration: 1,
                                ease: [0.33, 1, 0.68, 1],
                            }
                        }}
                    >Where Reimagination Meets Classics</motion.h3>
                </div>
            </header>
            <main className="home__main">
                <Nav />
                <motion.section
                    className="home__display"
                >
                    <motion.div
                        className="home_display-inner"
                        animate={{
                            x: `${currentDisplay}%`,
                            transition: {
                                duration: 0.75,
                                ease: [0.33, 1, 0.68, 1]
                            }
                        }}
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
        </PageTransition>
    )
}

export default Home