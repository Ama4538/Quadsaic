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

    // Based on -50% to move to the next display
    const SLIDE_LENGTH = 50;

    // Array of all game object
    const gameDisplay = [
        {
            name: "Wordle",
            description: " Engage in our version of Wordle, where you test your skills by guessing the word within a set number of attempts, with tile colors indicating how close you are. Customize your experience by adjusting settings such as the number of letters, guesses, and timer duration. Choose to enable or disable hints, or reveal the answer at a cost. Points are awarded for each correct letter in the right spot, with a point multiplier that automatically adjusts based on your selected settings. Enjoy an immersive experience enhanced with adjustable sound effects."
        },
        {
            name: "Word Search",
            description: "Dive into our Word Search game where you challenge yourself to find words listed on the game board. Customize your play with adjustable timer durations and guess limits, and utilize the reveal answer feature to highlight a randomly selected word that hasn't been found yet, though it will cost you points and reset your streak. Build streaks by completing multiple game boards consecutively for bonus points, and enjoy a dynamic scoring system based on the number of letters in each founded words and the selected setting levels.",
        },
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