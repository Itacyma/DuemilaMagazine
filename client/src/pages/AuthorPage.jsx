import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { getAllAuthors, getArticlesByAuthorId } from '../API/API.mjs';
import { ArticleDM } from '../components/ArticlePreview';
import '../style/AuthorPage.css';

function AuthorPage(props) {
    const { authorNickname } = props;
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const photoPlaceholder = "/profile-photo.jpg";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Prima recupera tutti gli autori per trovare l'id dal nickname
                const allAuthors = await getAllAuthors();
                const foundAuthor = allAuthors.find(a => a.nickname === authorNickname);
                
                if (!foundAuthor) {
                    setError('Autore non trovato');
                    setLoading(false);
                    return;
                }
                
                setAuthor(foundAuthor);
                
                // Recupera gli articoli dell'autore
                const authorArticles = await getArticlesByAuthorId(foundAuthor.id);
                setArticles(authorArticles);
            } catch (err) {
                console.error('Error loading author page:', err);
                setError('Errore nel caricamento dei dati dell\'autore');
            } finally {
                setLoading(false);
            }
        };

        if (authorNickname) {
            fetchData();
        }
    }, [authorNickname]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Caricamento...</p>
            </Container>
        );
    }

    if (error || !author) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error || 'Autore non trovato'}</Alert>
            </Container>
        );
    }

    return (
        <Container className="author-page">
            {/* Sezione informazioni autore in grande */}
            <div className="author-header-section">
                <Row className="align-items-center">
                    <Col md={4} className="text-center">
                        <img 
                            src={author.photo || photoPlaceholder}
                            alt={author.nickname || 'Autore'}
                            className="author-page-photo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = photoPlaceholder;
                            }}
                        />
                    </Col>
                    <Col md={8}>
                        <h1 className="author-page-nickname">{author.nickname} ({author.age})</h1>
                        <div className="author-page-presentation">
                            <p>{author.presentation}</p>
                        </div>
                        <div className="author-page-contacts">
                            {author.insta && (
                                <a 
                                    href={author.insta} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-contact-large btn-instagram-large"
                                >
                                    <i className="bi bi-instagram"></i> Instagram
                                </a>
                            )}
                            {author.email && (
                                <a 
                                    href={`mailto:${author.email}`}
                                    className="btn btn-contact-large btn-email-large"
                                >
                                    <i className="bi bi-envelope-fill"></i> Email
                                </a>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Sezione articoli */}
            <div className="author-articles-section">
                <h2 className="articles-section-title">Articoli di {author.nickname}</h2>
                <hr className="articles-divider" />
                {articles.length === 0 ? (
                    <Alert variant="info">Nessun articolo pubblicato da questo autore.</Alert>
                ) : (
                    <Row>
                        {articles.map(article => (
                            <Col key={article.id} md={6} lg={4} className="mb-4">
                                <ArticleDM 
                                    article={article}
                                    setSelectedArticle={props.setSelectedArticle}
                                    setSelectedAuthorNickname={props.setSelectedAuthorNickname}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Container>
    );
}

export { AuthorPage };
