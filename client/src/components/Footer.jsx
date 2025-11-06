import { Container, Navbar } from "react-bootstrap";
import '../style/Footer.css';

function Footer () {
    return(
        <Navbar className="footer-navbar" expand="lg" variant="dark">
            <Container className="footer-container">
                <span className="footer-text">
                    Copyright © 2025
                </span>
                <span className="footer-text">
                    Made by Claudio Martini
                </span>
            </Container>
        </Navbar>
    );
}

export { Footer };