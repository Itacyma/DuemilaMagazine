import { Outlet } from 'react-router';
import { NavbarCustom } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

function Layout(props) {
    const user = props.user;
    const handleLogout = props.handleLogout;
    const setLoading = props.setLoading;
    const setError = props.setError;

    return (
        <>
            <NavbarCustom user={user} handleLogout={handleLogout} setLoading={setLoading} setError={setError}/>
            <Outlet />
            <Footer />
        </>
    )
}

export { Layout }