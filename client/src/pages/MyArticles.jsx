import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Form, Button } from "react-bootstrap";
import { getOwnArticles, createArticle, getCategories } from "../API/API.mjs";
import { ArticlesDM } from "../components/Articles";

import '../style/MyArticles.css';


function MyArticlesPage(props) {
    const { user, setSelectedArticle, setSelectedAuthorNickname } = props;
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newTitle, setNewTitle] = useState('');
    const [newExtract, setNewExtract] = useState('');
    const [newText, setNewText] = useState('');
    const [newCategory, setNewCategory] = useState('altro');
    const [showForm, setShowForm] = useState(false);
    const [extractError, setExtractError] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchArticles = async () => {
            try {
                const myArticles = await getOwnArticles();
                setArticles(myArticles);
            } catch (err) {
                setError("Errore nel caricamento dei tuoi articoli");
            }
            setLoading(false);
        };
        if (user) fetchArticles();
    }, [user]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchCategories = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (err) {
                setError("Errore nel caricamento delle categorie");
            }
            setLoading(false);
        };
        if(user) fetchCategories();
    }, [user]);

    const handleExtractChange = (e) => {
        const value = e.target.value;
        if (value.length > 330) {
            setExtractError('Il riassunto può avere al massimo 330 caratteri.');
        } else {
            setExtractError('');
        }
        setNewExtract(value.slice(0, 330));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newExtract.length > 330) {
            setExtractError('Il riassunto può avere al massimo 330 caratteri.');
            return;
        }
        try {
            await createArticle({
                title: newTitle,
                extract: newExtract,
                text: newText,
                category: newCategory
            });
            setNewTitle('');
            setNewExtract('');
            setNewText('');
            setNewCategory('etica');
            setShowForm(false);
            setExtractError('');
            const myArticles = await getOwnArticles();
            setArticles(myArticles);
        } catch (err) {
            alert("Errore nel salvataggio dell'articolo");
        }
    };

    return (
        <Container className="my-articles-page">
            
            <div className="write-article-form-section">
                <Button
                    variant="success"
                    size="lg"
                    className="write-article-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "CHIUDI" : "SCRIVI UN NUOVO ARTICOLO"}
                </Button>
            </div>
            {showForm && (
                <div className="form-container-wrapper">
                    <Form onSubmit={handleSubmit} className="mb-4">
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formExtract">
                            <Form.Label>Riassunto</Form.Label>
                            <Form.Control
                                type="text"
                                value={newExtract}
                                onChange={handleExtractChange}
                                required
                                maxLength={330}
                            />
                            <div style={{ fontSize: "0.9em", color: "#dc3545" }}>
                                {extractError}
                            </div>
                            <div style={{ fontSize: "0.8em", color: "#888" }}>
                                {newExtract.length}/330 caratteri
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formText">
                            <Form.Label>Testo</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={newText}
                                onChange={e => setNewText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategory">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                required
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="form-action-buttons">
                            <Button variant="success" type="submit">
                                Pubblica
                            </Button>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={() => {
                                    setNewTitle('');
                                    setNewExtract('');
                                    setNewText('');
                                    setNewCategory('etica');
                                    setShowForm(false);
                                }}
                            >
                                Annulla
                            </Button>
                        </div>
                    </Form>
                </div>
            )}

            <hr style={{ borderTop: '3px solid #662E9B', margin: '3rem 0' }} />

            <h1 className="section-title">I miei articoli</h1>
            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : articles.length === 0 ? (
                <Alert variant="info" style={{ margin: "1rem 4rem 9rem" }}>
                    Non hai ancora pubblicato articoli.
                </Alert>
            ) : (
                <ArticlesDM 
                    articles={articles} 
                    setSelectedArticle={setSelectedArticle}
                    setSelectedAuthorNickname={setSelectedAuthorNickname}
                />
            )}
        </Container>
    );
}

export { MyArticlesPage };


