import { motion } from "framer-motion"

const PageTransition = ({ children }) => {
    // Amount of column
    const COLUMN_AMOUNT = 7;

    // Column Animation
    const expandColumn = {
        init: {
            top: 0
        },
        // Allow us to use the index to stagger animation
        animate: (index) => ({
            top: "100vh",
            transition: {
                duration: 0.30,
                delay: index * 0.05,
                ease: [0.215, 0.61, 0.355, 1],
            },
            transitionEnd: {
                height: "0",
                top: "0"
            }
        }),
        exit: (index) => ({
            height: "100vh",
            transition: {
                duration: 0.30,
                delay: index * 0.05,
                ease: [0.215, 0.61, 0.355, 1],
            }
        })
    }

    // Overlay Animation
    const overlayAnimation = {
        init: {
            opacity: 0.75,
        },
        animate: {
            opacity: 0,
        },
        exit: {
            opacity: 0.75,
        }
    }

    return (
        <div className="pagetransition">
            {/* Overlay */}
            <motion.div
                className="pagetransition__background"
                variants={overlayAnimation}
                initial="init"
                animate="animate"
                exit="exit"
            ></motion.div>
            {/* Column holder */}
            <div className="pagetransition__container">
                {/* Generate columns */}
                {[...Array(COLUMN_AMOUNT)].map((__, index) => (
                    <motion.div
                        className="pagetransition__column"
                        key={"pageTransition" + index}
                        variants={expandColumn}
                        initial="init"
                        animate="animate"
                        exit="exit"
                        // Allow uses to delay without stagger children, so our exit can play
                        custom = {index}
                    ></motion.div>
                ))}
            </div>
            {/* Returns the children */}
            {children}
        </div>
    )
}

export default PageTransition;