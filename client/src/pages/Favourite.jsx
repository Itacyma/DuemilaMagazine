import { useEffect, useState } from "react";
import { Container, Spinner, Alert, Form, Button } from "react-bootstrap";
import { getOwnArticles, createArticle, getCategories, getFavourites } from "../API/API.mjs";
import { ArticlesDM } from "../components/Articles";

import '../style/Favourite.css';


function FavouritesPage(props) {
    const { user, setSelectedArticle, setSelectedAuthorNickname } = props;
    const [articles, setArticles] = useState([]);
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


    return (
        <Container className="my-favourites-articles-page">
            

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
        </Container>
    );
}

export { FavouritesPage };


