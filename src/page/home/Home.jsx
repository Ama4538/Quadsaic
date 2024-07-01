import Nav from "../../components/nav/Nav"

const Home = () => {

    return (
        <>
            <header className="home__header">
                <h1 className="home__header-title"> Quadsaic </h1>
                <h3 className="home__header-subtitle">Where Reimagination Meets Classics</h3>
            </header>
            <main className="home__main">
              <Nav />
            </main>
        </>
    )
}

export default Home