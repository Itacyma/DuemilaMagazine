import { useNavigate } from "react-router";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { getMyAuthor } from '../API/API.mjs';
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
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();

    const handleClose = () => setShowMenu(false);
    const handleShow = () => setShowMenu(true);

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            // Reset photo when user changes or logs out
            setProfilePhoto(null);
            
            if (user && user.type === 'writer') {
                try {
                    const author = await getMyAuthor();
                    if (author && author.profile_photo) {
                        setProfilePhoto(`http://localhost:3001${author.profile_photo}`);
                    }
                } catch (err) {
                    console.error('Error fetching profile photo:', err);
                }
            }
        };

        fetchProfilePhoto();
    }, [user]);

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

                        {user && (
                            <div 
                                className="navbar-profile-icon"
                                onClick={() => navigate("/profile")}
                            >
                                {profilePhoto ? (
                                    <img 
                                        src={profilePhoto} 
                                        alt="Profile" 
                                        className="navbar-profile-photo"
                                    />
                                ) : (
                                    <i className="bi bi-person-circle"></i>
                                )}
                            </div>
                        )}

                        <Button variant="outline-light" onClick={handleShow} className="ms-2">
                            <span style={{fontSize: '1.5rem'}}>&#9776;</span>
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Offcanvas show={showMenu} onHide={handleClose} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="offcanvas-title-custom">Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link onClick={() => { navigate("/"); handleClose(); }}>Home</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/authors"); handleClose(); }}>I nostri scrittori</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/news"); handleClose(); }}>Notifiche</Nav.Link>
                        <Nav.Link onClick={() => { navigate("/events"); handleClose(); }}>Eventi</Nav.Link>
                        <div style={{height: '1rem'}} />

                        {user ? (
                            <>
                                <Nav.Link onClick={() => { navigate("/profile"); handleClose(); }}>Profilo</Nav.Link>
                                {user.type != "reader" && <Nav.Link onClick={() => { navigate("/myarticles"); handleClose(); }}>I miei articoli</Nav.Link>}
                                <Nav.Link onClick={() => { navigate("/favourites"); handleClose(); }}>Preferiti</Nav.Link>
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
