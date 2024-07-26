import { useAnimation } from "framer-motion"

const WordleAnimations = () => {
    const animationController = useAnimation();
    const rowAnimation = {
        error: {
            x: [0, 2.5, -2.5, 0],
            transition: {
                duration: 0.15,
                ease: [0.45, 0, 0.55, 1],
                repeat: 2,
            },
        },
    };

    const cellAnimation = {
        complete: (index) => ({
            y: [0, -5, 0],
            transition: {
                duration: 0.15,
                delay: index * 0.05,
                ease: [0.45, 0, 0.55, 1],
            },
        }),
    };

    const pageAnimation = {
        init: {
            y: 80,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.50,
                ease: [0.215, 0.61, 0.355, 1],
            }
        },
    }

    return {
        animationController,
        rowAnimation,
        cellAnimation,
        pageAnimation
    };
};

export default WordleAnimations