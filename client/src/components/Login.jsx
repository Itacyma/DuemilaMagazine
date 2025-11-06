import { useActionState } from "react"
import { Container, Form, InputGroup, Button, Spinner, FloatingLabel, Alert } from "react-bootstrap";
import '../style/Login.css';


function AuthForm(props) {

    const handleLogin = props.handleLogin;

    async function loginActionHandler(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: true };
        }
    }

    const [loginState, loginAction, loginPending] = useActionState(loginActionHandler);

    return (
        <>
            {loginState && loginState.error && (
                <Alert variant="warning">
                    Error in logging in. Please check your credentials and try again.
                </Alert>
            )}
            <Form className="auth-form" action={loginAction}>
                <InputGroup className="mb-3">
                    <FloatingLabel controlId="username" label="Username">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            required
                        />
                    </FloatingLabel>
                </InputGroup>
                <InputGroup className="mb-3">
                    <FloatingLabel controlId="password" label="Password">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                        />
                    </FloatingLabel>
                </InputGroup>
                <Button type="submit" className="w-100 btn-outline-orange" disabled={loginPending}>
                    {loginPending ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                    ) : (
                        "Log In"
                    )}
                </Button>
            </Form>
            <div className="mt-3 text-center">
                Non hai un account? <a href="/register" className="register-link">Registrati</a>
            </div>
        </>
    );
}

function LoginPage(props) {
    const user = props.user;
    const handleLogin = props.handleLogin;

    if (user) {
        return (
            <div className="login-wrapper">
                <div className="login-content">
                    <Container>
                        <h2 className="login-title">Already Logged</h2>
                    </Container>
                </div>
            </div>
        );
    }

    return(
        <div className="login-wrapper">
        <div className="login-content">
        <Container>
            <h2 className="login-title mb-5">Log In</h2>
            <AuthForm handleLogin={handleLogin}/>
        </Container>
        </div>
        </div>
    )
}

export { LoginPage };
