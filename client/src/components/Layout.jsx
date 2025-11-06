import { Outlet } from 'react-router';
import { NavbarCustom } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import '../App.css';

function Layout(props) {
    const user = props.user;
    const handleLogout = props.handleLogout;
    const setLoading = props.setLoading;
    const setError = props.setError;

    return (
        <div className="layout-container">
            <NavbarCustom user={user} handleLogout={handleLogout} setLoading={setLoading} setError={setError}/>
            <div className="app-outlet">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export { Layout }