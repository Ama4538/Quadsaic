import { useEffect, useState } from "react"

const Nav = ({ location = null }) => {
    // State used to manage the menu status
    const [menuOpenStatus, setMenuOpenStatus] = useState(false)

    // Remove scrolling menu is open
    useEffect(() => {
        if (menuOpenStatus) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [menuOpenStatus])

    return (
        <>
            <nav className="nav">
                <h3 className="nav__title">Quadsaic</h3>
                <h2 className="nav__location">{location}</h2>
                <button
                    className="nav__menu-button"
                    onClick={() => { setMenuOpenStatus(!menuOpenStatus)}}
                ></button>
            </nav>
            <section
                className="nav__menu"
                data-open={menuOpenStatus}
            >
                <div className="nav-menu__button-container">
                    <button
                        className="nav__menu-button nav-menu__cancel"
                        onClick={() => { setMenuOpenStatus(!menuOpenStatus)}}
                    ></button>
                </div>
                <ul className="nav-menu__link-container">
                    <li>
                        <a className="nav-menu__link" href="">Wordle Reimagine </a>
                    </li>
                    <li>
                        <a className="nav-menu__link" href="">Word Search Enchanced</a>
                    </li>
                    <li>
                        <a className="nav-menu__link" href="">Sudoku Revamped</a>
                    </li>
                    <li>
                        <a className="nav-menu__link" href="">2048 Augmented</a>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default Nav