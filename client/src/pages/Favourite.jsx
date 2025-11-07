import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Form, Button } from "react-bootstrap";
import { getFavourites, getFrequents } from "../API/API.mjs";
import { ArticlesDM } from "../components/Articles";

import '../style/Favourite.css';


function FavouritesPage(props) {
    const { user, setSelectedArticle, setSelectedAuthorNickname } = props;
    const [articles, setArticles] = useState([]);
    const [frequentArticles, setFrequentArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchArticles = async () => {
            try {
                const myFavouriteArticles = await getFavourites();
                setArticles(myFavouriteArticles);
            } catch (err) {
                setError("Errore nel caricamento dei tuoi articoli preferiti");
            }
            setLoading(false);
        };
        if (user) fetchArticles();
    }, [user]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchFrequentArticles = async () => {
            try {
                const myFrequentArticles = await getFrequents();
                setFrequentArticles(myFrequentArticles);
            } catch (err) {
                setError("Errore nel caricamento dei tuoi articoli visualizzati di frequente");
            }
            setLoading(false);
        };
        if (user) fetchFrequentArticles();
    }, [user]);


    return (
        <Container className="my-favourites-articles-page">
            
            <div className="favourites-section">
                <h1 className="section-title">I miei articoli preferiti</h1>
                <hr style={{ borderTop: '3px solid #662E9B', margin: '2rem 0 4rem' }} />
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : articles.length === 0 ? (
                    <Alert variant="info" style={{ margin: "1rem 4rem 9rem" }}>
                        Non hai ancora articoli tra i preferiti.
                    </Alert>
                ) : (
                    <ArticlesDM 
                        articles={articles} 
                        setSelectedArticle={setSelectedArticle}
                        setSelectedAuthorNickname={setSelectedAuthorNickname}
                    />
                )}
            </div>

            <div className="frequents-section">
                <h1 className="section-title">Gli articoli che ho letto di più</h1>
                <hr style={{ borderTop: '3px solid #662E9B', margin: '0 0 4rem' }} />
                {loading ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : articles.length === 0 ? (
                    <Alert variant="info" style={{ margin: "1rem 4rem 9rem" }}>
                        Non hai ancora letto articoli.
                    </Alert>
                ) : (
                    <ArticlesDM 
                        articles={frequentArticles} 
                        setSelectedArticle={setSelectedArticle}
                        setSelectedAuthorNickname={setSelectedAuthorNickname}
                    />
                )}
            </div>
        </Container>
    );
}

export { FavouritesPage };


