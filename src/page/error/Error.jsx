import { Link } from "react-router-dom";
import Nav from "../../components/nav/Nav"
import PageTransition from "../../components/page-transition/PageTransition";

const Error = () => {
    return (
        <PageTransition>
            <Nav />
            <section className="error">
                <h2>Oop! We couldn't find this page</h2>
                <h3>It might have moved or no longer exists. Let's get you back on track</h3>
                <Link
                    className="gamedisplay__link"
                    to={"/"}
                >Return Home</Link>
            </section>
        </PageTransition>
    )
}

export default Error