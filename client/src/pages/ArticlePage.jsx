import { useEffect, useState } from "react";
import { Alert, Button, Container, Col, Row, Spinner, Form, Toast } from "react-bootstrap";
import { useNavigate } from "react-router";
import { 
    incrementArticleLikes,
    changeLike,
    changeFavourite,
    isFavourite,
    isLiked,
    getCategories,
    updateArticle,
    checkArticleOwnership
} from "../API/API.mjs";

import Card from 'react-bootstrap/Card';
import '../style/ArticlePage.css';

function ArticlePage(props) {
    const { article, user } = props;
    const [favourite, setFavourite] = useState(null);
    const [liked, setLiked] = useState(null);
    const navigate = useNavigate();
    const [favLoading, setFavLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    
    // Edit mode states
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editExtract, setEditExtract] = useState('');
    const [editText, setEditText] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [extractError, setExtractError] = useState('');
    const [showAuthBanner, setShowAuthBanner] = useState(false);

  const handleLike = async () => {
    if (!article?.id) return;
    setLikeLoading(true);
    try {
        const res = await changeLike(article.id);
        if (typeof res === 'boolean') setLiked(res === true);
        else if (res && typeof res.isLiked !== 'undefined') setLiked(res.isLiked === true);
    } catch (err) {
        if (err.status === 401) navigate('/login');
        else alert(err.message || 'Errore nella gestione del like');
    } finally {
        setLikeLoading(false);
    }
  };

    const handleFavourite = async () => {
        if (!article?.id) return;
        setFavLoading(true);
        try {
            const res = await changeFavourite(article.id);
            // server may return boolean or object { isFavourite } or { status }
            if (typeof res === 'boolean') setFavourite(res === true);
            else if (res && typeof res.isFavourite !== 'undefined') setFavourite(res.isFavourite === true);
            else if (res && typeof res.status !== 'undefined') setFavourite(res.status === true);
        } catch (err) {
            if (err.status === 401) navigate('/login');
            else alert(err.message || 'Errore nella gestione dei preferiti');
        } finally {
            setFavLoading(false);
        }
    };

    useEffect(() => {
        const fetchFavourite = async () => {
            if (!article?.id) return;
            try {
                console.log("Articolo: " + article.author);
                const res = await isFavourite(article.id);
                setFavourite(res === true);
            } catch (err) {
                setFavourite(false);
            }
        };
        fetchFavourite();
    }, [article?.id]);

    useEffect(() => {
        const fetchLike = async () => {
            if (!article?.id) return;
            try {
                const res = await isLiked(article.id);
                setLiked(res === true);
            } catch (err) {
                setLiked(false);
            }
        };
        fetchLike();
    }, [article?.id]);

    useEffect(() => {
        const checkOwnership = async () => {
            if (!article?.id || !user) {
                console.log("checkOwnership: missing article or user", { articleId: article?.id, user });
                setIsOwner(false);
                return;
            }
            try {
                console.log("Checking ownership for article:", article.id);
                const res = await checkArticleOwnership(article.id);
                console.log("Ownership result:", res);
                setIsOwner(res === true);
            } catch (err) {
                console.error("Error checking ownership:", err);
                setIsOwner(false);
            }
        };
        checkOwnership();
    }, [article?.id, user]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleEditClick = () => {
        setEditTitle(article.title);
        setEditExtract(article.extract);
        setEditText(article.text);
        setEditCategory(article.categoryId); 
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setExtractError('');
    };

    const handleExtractChange = (e) => {
        const value = e.target.value;
        if (value.length > 330) {
            setExtractError('Il riassunto può avere al massimo 330 caratteri.');
        } else {
            setExtractError('');
        }
        setEditExtract(value.slice(0, 330));
    };

    const handleSaveEdit = async () => {
        if (editExtract.length > 330) {
            setExtractError('Il riassunto può avere al massimo 330 caratteri.');
            return;
        }
        try {
            await updateArticle(article.id, {
                title: editTitle,
                extract: editExtract,
                text: editText,
                category: editCategory // Invia l'ID della categoria
            });
            // Update local article object
            article.title = editTitle;
            article.extract = editExtract;
            article.text = editText;
            article.categoryId = editCategory;
            // Aggiorna anche il nome della categoria
            const selectedCat = categories.find(c => c.id === editCategory);
            if (selectedCat) article.category = selectedCat.name;
            setIsEditing(false);
            setExtractError('');
        } catch (err) {
            alert(err.message || 'Errore nel salvataggio delle modifiche');
        }
    };

  return (
    <div className="article-page-center" style={{ paddingBottom: 112 }}>
        <Card className="article-page-card">
            <Card.Body>
                {isEditing ? (
                    <Form.Group className="mb-3">
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                ) : (
                    <Card.Title>"{article?.title}" di {article?.nickname}</Card.Title>
                )}
            </Card.Body>
            
            {isEditing && (
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Riassunto</Form.Label>
                        <Form.Control
                            type="text"
                            value={editExtract}
                            onChange={handleExtractChange}
                            required
                            maxLength={330}
                        />
                        <div style={{ fontSize: "0.9em", color: "#dc3545" }}>
                            {extractError}
                        </div>
                        <div style={{ fontSize: "0.8em", color: "#888" }}>
                            {editExtract.length}/330 caratteri
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select
                            value={editCategory}
                            onChange={(e) => setEditCategory(Number(e.target.value))}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Card.Body>
            )}
            
            <Card.Body>
                {isEditing ? (
                    <Form.Group className="mb-3">
                        <Form.Label>Testo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            required
                        />
                    </Form.Group>
                ) : (
                    <div className="article-content">
                        {article?.text}
                    </div>
                )}
            </Card.Body>
            
            <Card.Body>
                <hr className="article-action-divider" />
                {isEditing ? (
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
                        <Button variant="success" onClick={handleSaveEdit}>
                            <i className="bi bi-check-circle"></i> Salva Modifiche
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            <i className="bi bi-x-circle"></i> Annulla
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Button
                            title="Torna indietro"
                            className="article-back-btn"
                            style={{ marginRight: "2rem" }}
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left-circle"></i>
                        </Button>
                        {user ? (<div className="article-action-buttons" style={isOwner ? { marginRight: "1rem" } : {}}>
                            {isOwner ? (
                                <Button 
                                    title="Modifica articolo" 
                                    variant="warning"
                                    onClick={handleEditClick}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                            ) : (
                                <>
                                    <Button 
                                        title={liked ? "Rimuovi Mi Piace" : "Metti Mi Piace all'articolo"}
                                        onClick={likeLoading ? null : handleLike}
                                        className={"like-btn" + (liked ? " active" : "")}
                                    >
                                        <i className={liked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up"}></i>
                                        {likeLoading && <Spinner animation="border" size="sm" />}
                                    </Button>
                                    <Button
                                        title={favourite ? "Rimuovi dai preferiti" : "Salva l'articolo tra i preferiti"}
                                        onClick={favLoading ? null : handleFavourite}
                                        className={"bookmark-btn" + (favourite ? " active" : "")}
                                    >
                                        <i className={favourite ? "bi bi-bookmark-star-fill" : "bi bi-bookmark-star"}></i>
                                        {favLoading && <Spinner animation="border" size="sm" />}
                                    </Button>
                                    <Button 
                                        title="Commenta l'articolo"
                                        className="comment-btn"
                                    >
                                        <i className="bi bi-chat-dots"></i>
                                    </Button>
                                </>
                            )}
                        </div>) : (
                        <>
                            {showAuthBanner && (
                                <div className="auth-toast-container">
                                    <Toast onClose={() => setShowAuthBanner(false)} show={showAuthBanner} className="toast-custom">
                                        <Toast.Header>
                                            <strong className="me-auto">Accesso richiesto</strong>
                                            <button type="button" className="toast-close-custom" aria-label="Close" onClick={() => setShowAuthBanner(false)}>&times;</button>
                                        </Toast.Header>
                                        <Toast.Body>
                                            <div className="toast-content">
                                                <div className="toast-message">
                                                    <div className="toast-title">Devi essere registrato</div>
                                                    <div className="toast-sub">Effettua il login o registrati per interagire con gli articoli.</div>
                                                </div>
                                                <div className="toast-actions">
                                                    <Button className="btn-cta-primary" onClick={() => { setShowAuthBanner(false); navigate('/login'); }}>Accedi</Button>
                                                    <Button className="btn-cta-outline" onClick={() => { setShowAuthBanner(false); navigate('/register'); }}>Registrati</Button>
                                                </div>
                                            </div>
                                        </Toast.Body>
                                    </Toast>
                                </div>
                            )}
                            <div className="article-action-buttons">
                                <Button
                                    title="Metti Mi Piace all'articolo"
                                    onClick={() => setShowAuthBanner(true)}
                                    className="like-btn"
                                >
                                    <i className="bi bi-hand-thumbs-up"></i>
                                </Button>
                                <Button
                                    title="Salva l'articolo tra i preferiti"
                                    onClick={() => setShowAuthBanner(true)}
                                    className="bookmark-btn"
                                >
                                    <i className="bi bi-bookmark-star"></i>
                                </Button>
                                <Button
                                    title="Commenta l'articolo"
                                    onClick={() => setShowAuthBanner(true)}
                                    className="comment-btn"
                                >
                                    <i className="bi bi-chat-dots"></i>
                                </Button>
                            </div>
                        </>)}
                    </div>
                )}
            </Card.Body>
        </Card>    
    </div> 
  );
}

export {ArticlePage};



