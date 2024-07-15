import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Home from "../../page/home/Home.jsx";

const AnimatedRoutes = () => {
    // Listens to url changes to play render
    const location = useLocation();

    return (
        <AnimatePresence mode = "wait">
            <Routes location={location} key={location.key}>
                <Route path = "/" element = {<Home />}/>
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes;