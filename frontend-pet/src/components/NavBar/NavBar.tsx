import { Link, Outlet } from "react-router";
import OCILogo from '/oci-logo-horizontal-color.svg';
import './navbar.css'

function NavBar(){
    return (
        <div id="grid-root">
            <div id="nav-window">
                <header id="oci-header">
                    <h1>Leitor de Gabaritos</h1>
                    <img src={OCILogo} alt="" />
                </header>
                <nav id="navbar">
                    <div id="nav-gabaritos-div">
                        <h2>Leitura de gabaritos:</h2>
                        <Link to={''}><div className="nav-button"><p>Página inicial</p></div></Link>
                    </div>
                    <div id="nav-visual-div">
                        <h2>Visualizar no banco de dados:</h2>
                        <Link to={'leituras'}><div className="nav-button"><p>Leituras</p></div></Link>
                        <Link to={'alunos'}><div className="nav-button"><p>Alunos</p></div></Link>
                        <Link to={'provas'}><div className="nav-button"><p>Provas</p></div></Link>
                    </div>
                </nav>
            </div>
            <Outlet/>
        </div>
    )
}

export default NavBar;