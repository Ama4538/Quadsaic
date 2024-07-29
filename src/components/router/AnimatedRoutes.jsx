import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from "../../page/home/Home.jsx";
import Wordle from "../../page/wordle/Wordle.jsx";
import Error from "../../page/error/Error.jsx";
import WordSearch from "../../page/word-search/WordSearch.jsx";

const AnimatedRoutes = ({ 
    wordleSetting, 
    updateWordleSetting,
    wordSearchSetting,
    updateWordSearchSetting,
}) => {
    // Listens to url changes to play render
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.key}>
                <Route path="/" element={<Home />} />
                <Route path="/wordle" element={
                    <Wordle setting={wordleSetting} updateSetting={updateWordleSetting} />
                } />
                <Route path="/word-search" element={
                    <WordSearch setting={wordSearchSetting} updateSetting={updateWordSearchSetting} />
                } />
                <Route path="*" element={<Error />} />
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes;