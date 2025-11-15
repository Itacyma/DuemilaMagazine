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
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verifica che sia un'immagine
            if (!file.type.startsWith('image/')) {
                setError('Seleziona un file immagine valido');
                return;
            }
            // Verifica dimensione (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('L\'immagine non può superare 5MB');
                return;
            }
            setProfilePhoto(file);
            // Crea preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

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

        // Se è writer, valida campi aggiuntivi
        if (type === 'writer') {
            const nickname = formData.get('nickname');
            const age = formData.get('age');
            const presentation = formData.get('presentation');
            
            if (!nickname || !age || !presentation) {
                setError('Nickname, età e presentazione sono obbligatori per gli scrittori.');
                setPending(false);
                return;
            }
        }

        try {
            // Crea FormData per l'upload
            const uploadData = new FormData();
            uploadData.append('username', username);
            uploadData.append('name', name);
            uploadData.append('password', password);
            uploadData.append('type', type);
            
            if (type === 'writer') {
                uploadData.append('nickname', formData.get('nickname'));
                uploadData.append('age', formData.get('age'));
                uploadData.append('presentation', formData.get('presentation'));
                if (profilePhoto) {
                    uploadData.append('profilePhoto', profilePhoto);
                }
            }

            await register(uploadData);
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

            {/* Campi aggiuntivi per scrittori */}
            {userType === 'writer' && (
                <>
                    <InputGroup className="mb-3">
                        <FloatingLabel controlId="nickname" label="Nickname *">
                            <Form.Control type="text" name="nickname" required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <FloatingLabel controlId="age" label="Età *">
                            <Form.Control type="number" name="age" min="1" max="120" required />
                        </FloatingLabel>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <FloatingLabel controlId="presentation" label="Presentazione *">
                            <Form.Control 
                                as="textarea" 
                                name="presentation" 
                                style={{ height: '100px' }}
                                placeholder="Raccontaci qualcosa di te..."
                                required 
                            />
                        </FloatingLabel>
                    </InputGroup>
                    <div className="mb-3">
                        <Form.Label>Foto Profilo (opzionale)</Form.Label>
                        <Form.Control 
                            type="file" 
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        {photoPreview && (
                            <div className="mt-2 text-center">
                                <img 
                                    src={photoPreview} 
                                    alt="Preview" 
                                    style={{ 
                                        maxWidth: '150px', 
                                        maxHeight: '150px', 
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }} 
                                />
                            </div>
                        )}
                        <Form.Text className="text-muted">
                            Formato: JPG, PNG, GIF. Max 5MB.
                        </Form.Text>
                    </div>
                </>
            )}

            <Button type="submit" className="w-100 btn-outline-orange" disabled={pending}>
                {pending ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : 'Registrati'}
            </Button>
        </Form>
    );
}

function RegisterPage(props) {
    return (
        <div className="login-wrapper register-wrapper">
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
