import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { getMyAuthor } from '../API/API.mjs';
import '../style/ProfilePage.css';

function ProfilePage({ user }) {
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const photoPlaceholder = "/profile-photo.jpg";

    // Funzione per estrarre il nickname da un URL Instagram
    const extractInstagramUsername = (url) => {
        if (!url) return '';
        try {
            // Estrae il nome utente dall'URL Instagram
            const match = url.match(/instagram\.com\/([^/?]+)/);
            return match ? `@${match[1]}` : url;
        } catch (err) {
            return url;
        }
    };

    useEffect(() => {
        const fetchAuthorData = async () => {
            if (user && user.type === 'writer') {
                try {
                    console.log('Fetching author data for writer user:', user.id);
                    const authorData = await getMyAuthor();
                    console.log('Author data received:', authorData);
                    setAuthor(authorData);
                } catch (err) {
                    console.error('Error fetching author data:', err);
                    // Non mostrare errore se semplicemente non esiste ancora
                    setError('');
                } finally {
                    setLoading(false);
                }
            } else {
                console.log('User is not a writer, skipping author fetch');
                setLoading(false);
            }
        };

        if (user) {
            console.log('User object:', user);
            fetchAuthorData();
        }
    }, [user]);

    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">Devi effettuare il login per visualizzare il tuo profilo.</Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Caricamento profilo...</p>
            </Container>
        );
    }

    return (
        <Container className="profile-page">

            <h1 className="profile-title">Il Mio Profilo</h1>
            <hr style={{ borderTop: '3px solid #662E9B', margin: '0 0 4rem' }} />
            {/* Sezione Profilo Autore (solo se writer) */}
            {user.type === 'writer' && author && (
                <div className="profile-section">
                    <Card className="profile-card author-card">
                        <Card.Header className="profile-card-header">
                            <i className="bi bi-pen-fill me-2"></i>
                            Profilo Autore
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-4">
                                <Col md={4} className="d-flex align-items-center justify-content-center">
                                    <img 
                                        src={author.profile_photo ? `http://localhost:3001${author.profile_photo}` : photoPlaceholder}
                                        alt={author.nickname || 'Autore'}
                                        className="profile-author-photo"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = photoPlaceholder;
                                        }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-info-item">
                                                <label className="profile-label">Nickname</label>
                                                <div className="profile-value profile-nickname">{author.nickname}</div>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <div className="profile-info-item">
                                                <label className="profile-label">Età</label>
                                                <div className="profile-value">{author.age} anni</div>
                                            </div>
                                        </Col>
                                        {author.insta && (
                                            <Col md={6} className="mb-3">
                                                <div className="profile-info-item">
                                                    <label className="profile-label">Instagram</label>
                                                    <div className="profile-value">
                                                        <a href={author.insta} target="_blank" rel="noopener noreferrer" className="profile-link">
                                                            <i className="bi bi-instagram me-1"></i>
                                                            {extractInstagramUsername(author.insta)}
                                                        </a>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {author.email && (
                                            <Col md={6} className="mb-3">
                                                <div className="profile-info-item">
                                                    <label className="profile-label">Email Pubblica</label>
                                                    <div className="profile-value">
                                                        <a href={`mailto:${author.email}`} className="profile-link">
                                                            <i className="bi bi-envelope-fill me-1"></i>
                                                            {author.email}
                                                        </a>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="mb-3">
                                    <div className="profile-info-item">
                                        <label className="profile-label">Presentazione</label>
                                        <div className="profile-value profile-presentation">{author.presentation}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {/* Messaggio per writer senza profilo autore */}
            {user.type === 'writer' && !author && !loading && (
                <Alert variant="info">
                    <i className="bi bi-info-circle me-2"></i>
                    Il tuo profilo di scrittore non è ancora stato validato. Attendi qualche giorno o contatta l'amministratore per maggiori informazioni.
                </Alert>
            )}

            {/* Sezione Informazioni Utente */}
            <div className="profile-section">
                <Card className="profile-card">
                    <Card.Header className="profile-card-header">
                        <i className="bi bi-person-circle me-2"></i>
                        Informazioni Account
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <div className="profile-info-item">
                                    <label className="profile-label">Nome Completo</label>
                                    <div className="profile-value">{user.name}</div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="profile-info-item">
                                    <label className="profile-label">Email</label>
                                    <div className="profile-value">{user.username}</div>
                                </div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <div className="profile-info-item">
                                    <label className="profile-label">Tipo Account</label>
                                    <div className="profile-value">
                                        <Badge bg={user.type === 'writer' ? 'success' : user.type === 'admin' ? 'danger' : 'primary'}>
                                            {user.type === 'writer' ? 'Scrittore' : user.type === 'admin' ? 'Amministratore' : 'Lettore'}
                                        </Badge>
                                    </div>
                                </div>
                            </Col>
                            {user.game !== undefined && (
                                <Col md={6} className="mb-3">
                                    <div className="profile-info-item">
                                        <label className="profile-label">Gioco della settimana</label>
                                        <div className="profile-value">
                                            <Badge bg={user.game === 1 ? 'success' : 'danger'}>
                                                {user.game === 1 ? 'Completato' : 'Non completato'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
}

export { ProfilePage };