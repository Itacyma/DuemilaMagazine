import { useState } from "react";
import { Container, Form, InputGroup, Button, Spinner, FloatingLabel, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import { register } from "../API/API.mjs";
import '../style/Login.css';

function RegisterForm(props) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [pending, setPending] = useState(false);
    const [userType, setUserType] = useState('reader'); 

    async function handleRegister(e) {
        e.preventDefault();
        setError(null);
        setPending(true);
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const username = formData.get('email');
        const password = formData.get('password');
        const confirm = formData.get('confirm');
        const type = userType;

        if (!username || !name || !password || !confirm) {
            setError('Tutti i campi sono obbligatori.');
            setPending(false);
            return;
        }
        if (password !== confirm) {
            setError('Le password non coincidono.');
            setPending(false);
            return;
        }

        try {
            await register({ username, name, password, type });
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Errore nella registrazione');
        }
        setPending(false);
    }

    return (
        <Form className="auth-form" onSubmit={handleRegister}>
            {error && <Alert variant="danger">{error}</Alert>}
            <InputGroup className="mb-3">
                <FloatingLabel controlId="name" label="Name">
                    <Form.Control type="text" name="name" required />
                </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
                <FloatingLabel controlId="email" label="Email">
                    <Form.Control type="email" name="email" required />
                </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
                <FloatingLabel controlId="password" label="Password">
                    <Form.Control type="password" name="password" required />
                </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
                <FloatingLabel controlId="confirm" label="Conferma Password">
                    <Form.Control type="password" name="confirm" required />
                </FloatingLabel>
            </InputGroup>
            <div className="mb-3">
                <div>
                    <Form.Check
                        inline
                        type="radio"
                        label="Lettore"
                        name="type"
                        id="type-reader"
                        value="reader"
                        checked={userType === 'reader'}
                        onChange={() => setUserType('reader')}
                    />
                    <Form.Check
                        inline
                        type="radio"
                        label="Scrittore"
                        name="type"
                        id="type-writer"
                        value="writer"
                        checked={userType === 'writer'}
                        onChange={() => setUserType('writer')}
                    />
                </div>
            </div>
            <Button type="submit" className="w-100 btn-outline-orange" disabled={pending}>
                {pending ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : 'Registrati'}
            </Button>
        </Form>
    );
}

function RegisterPage(props) {
    return (
        <div className="login-wrapper">
            <div className="login-content">
                <Container>
                    <h2 className="login-title mb-5">Registrazione</h2>
                    <RegisterForm />
                </Container>
            </div>
        </div>
    );
}


export { RegisterPage };
