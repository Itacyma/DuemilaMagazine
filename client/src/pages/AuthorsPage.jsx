import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import { getAllAuthors } from "../API/API.mjs";
import { AuthorPreview } from "../components/AuthorPreview";
import '../style/AuthorsPage.css';

function AuthorsPage(props) {
    const { setSelectedAuthorNickname } = props;
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const allAuthors = await getAllAuthors();
                setAuthors(allAuthors);
            } catch (err) {
                setError("Errore nel caricamento degli autori");
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    return (
        <Container className="authors-page">
            <h1 className="section-title">I Nostri Autori</h1>
            <hr style={{ borderTop: '3px solid #662E9B', margin: '0 0 4rem' }} />
            
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : authors.length === 0 ? (
                <Alert variant="info">Nessun autore disponibile al momento.</Alert>
            ) : (
                <>
                    <div className="row d-flex justify-content-center authors-list-row">
                        {(showAll ? authors : authors.slice(0, 6)).map((author) => (
                            <div className="col-12 col-md-4 mb-5 d-flex justify-content-center" key={author.id}>
                                <AuthorPreview 
                                    author={author}
                                    setSelectedAuthorNickname={setSelectedAuthorNickname}
                                />
                            </div>
                        ))}
                    </div>
                    {!showAll && authors.length > 6 && (
                        <div className="d-flex justify-content-center mb-4">
                            <Button 
                                variant="primary" 
                                className="btn-show-more-authors" 
                                onClick={() => setShowAll(true)}
                            >
                                Mostra tutti gli autori
                            </Button>
                        </div>
                    )}
                    {showAll && authors.length > 6 && (
                        <div className="d-flex justify-content-center mb-4">
                            <Button 
                                variant="primary" 
                                className="btn-show-more-authors" 
                                onClick={() => setShowAll(false)}
                            >
                                Mostra meno
                            </Button>
                        </div>
                    )}
                </>
            )}
        </Container>
    );
}

export { AuthorsPage };
