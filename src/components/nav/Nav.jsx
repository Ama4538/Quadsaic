import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

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
                <Link
                    className="nav__title"
                    to="/"
                >Quadsaic</Link>
                <h2 className="nav__location">{location}</h2>
                <button
                    className="nav__menu-button"
                    onClick={() => { setMenuOpenStatus(!menuOpenStatus) }}
                ></button>
            </nav>
            <section
                className="nav__menu"
                data-open={menuOpenStatus}
            >
                <div className="nav-menu__button-container">
                    <button
                        className="nav__menu-button nav-menu__cancel"
                        onClick={() => { setMenuOpenStatus(!menuOpenStatus) }}
                    ></button>
                </div>
                <ul className="nav-menu__link-container">
                    <li>
                        <Link
                            className="nav-menu__link"
                            to="wordle"
                        >Wordle </Link>
                    </li>
                    <li>
                        <Link
                            className="nav-menu__link"
                            to="word-search"
                        >Word Search</Link>
                    </li>
                    <li>
                        <Link
                            className="nav-menu__link"
                            to="sudoku"
                        >Sudoku</Link>
                    </li>
                    <li>
                        <Link
                            className="nav-menu__link"
                            to="2048"
                        >2048</Link>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default Nav