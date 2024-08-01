import { useAnimation } from "framer-motion"

const WordSearchAnimation = () => {
    const animationController = useAnimation();
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
        pageAnimation
    };
};

export default WordSearchAnimation