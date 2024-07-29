// libraires
import { useEffect, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"

const WordSearch = ({ setting, updateSetting }) => {
    return (
        <PageTransition>
            <Nav location = {"Word Search"}/>
            
        </PageTransition>
    )
}

export default WordSearch