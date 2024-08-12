// libraires
import { useEffect, useRef, useState } from "react";

// Components
import PageTransition from "../../components/page-transition/PageTransition"
import Nav from "../../components/nav/Nav"

const Sudoku = ({setting, updateSetting}) => {

    // State

    // Loading Status
    const [dataLoadingStatus, setDataLoadingStatus] = useState(true)

    return (
        <PageTransition>
            <Nav location = {"Sudoku"} />
            {
                dataLoadingStatus 
                ? <main className="sudoku">
                    {/* Information */}
                    <header className="wordle__information-display">
                        <div className="wordle__information-format">
                            <p>Current Score</p>
                            <p>{setting.currentScore}</p>
                        </div>
                        <div className="wordle__information-format">
                            <p>Highest Score</p>
                            <p>{setting.highestScore}</p>
                        </div>
                    </header>
                </main> 
                : null
            }
        </PageTransition>
    )
}

export default Sudoku