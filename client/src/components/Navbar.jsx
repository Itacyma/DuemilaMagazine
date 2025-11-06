import { useNavigate } from "react-router";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { useState } from 'react';
import '../style/Navbar.css';


function ButtonCustom(props) {
    const variant = props.variant;
    const handleLogout = props.handleLogout;
    const navigate = useNavigate();

    if (variant == "login") {
        return (
            <Button className="mx-3 w-auto" variant="outline-light" onClick={() => { navigate("/login"); }}>
                Login
            </Button>
        );
    }

    if (variant == "logout") {
        return (
            <Button className="mx-3 w-auto" variant="outline-light" onClick={() => {  handleLogout();}}>
                Logout
            </Button>
        );
    }

    return (
        <Button className="mx-3 w-auto" variant="outline-light">
            Error
        </Button>
    );
}


function NavbarCustom(props) {

    const { user, handleLogout, setLoading, setError } = props;
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShowMenu(false);
    const handleShow = () => setShowMenu(true);

    return (
        <>
            <Navbar className="navbar-custom-bg" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand
                        className="navbar-brand-custom"
                        onClick={() => { navigate("/"); }}
                    >
                        Duemila Magazine
                    </Navbar.Brand>
                    <Nav className="ms-auto d-flex align-items-center flex-row" style={{ gap: "0.5rem" }}>
                        {
                            !user ? (
                                <ButtonCustom variant="login" setError={setError} />
                            ) : (
                                <ButtonCustom variant="logout" handleLogout={handleLogout} />
                            )
                        }
                        <Button variant="outline-secondary" onClick={handleShow} className="ms-2">
                            <span style={{fontSize: '1.5rem'}}>&#9776;</span>
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Offcanvas show={showMenu} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link onClick={() => { navigate("/"); handleClose(); }}>Home</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/authors"); handleClose(); }}>I nostri scrittori</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/news"); handleClose(); }}>Annunci</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/events"); handleClose(); }}>Eventi</Nav.Link>
                        <div style={{height: '1rem'}} />

                        {user ? (
                            <>
                                {user.type != "reader" && <Nav.Link onClick={() => { navigate("/myarticles"); handleClose(); }}>I miei articoli</Nav.Link>}
                                <Nav.Link onClick={() => { navigate("/favourites"); handleClose(); }}>Preferiti</Nav.Link>
                                <Nav.Link onClick={() => { navigate("/saved"); handleClose(); }}>Salvati per dopo</Nav.Link>
                                <Nav.Link onClick={() => { handleLogout(); handleClose(); }}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link onClick={() => { navigate("/login"); handleClose(); }}>Login</Nav.Link>
                                <Nav.Link onClick={() => { navigate("/register"); handleClose(); }}>Registrati</Nav.Link>
                            </>
                        )}
                        <div style={{height: '1rem'}} />
                        <Nav.Link onClick={() => { navigate("/aboutus"); handleClose(); }}>Chi siamo</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/contacts"); handleClose(); }}>Contattaci</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export { NavbarCustom };
