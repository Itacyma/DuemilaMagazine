import { useState, useMemo } from 'react';
import { ArticleDM } from './ArticlePreview';
import { Container, Button } from 'react-bootstrap';

function ArticlesDM(props) {
    const articles = props.articles || [];
    const setSelectedArticle = props.setSelectedArticle;
    const setSelectedAuthorNickname = props.setSelectedAuthorNickname;
    const orderCriteria = props.orderCriteria || 'date';
    const [showAll, setShowAll] = useState(false);

    // Usa useMemo per generare una sola volta l'ordine casuale
    const sortedArticles = useMemo(() => {
        let sorted = [...articles];
        if (orderCriteria === 'random') {
            for (let i = sorted.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
            }
        } else if (orderCriteria === 'date') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (orderCriteria === 'likes') {
            sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (orderCriteria === 'visuals') {
            sorted.sort((a, b) => (b.visuals || 0) - (a.visuals || 0));
        }
        return sorted;
    }, [articles, orderCriteria]);

    return (
        <div className="articles-page">
            <Container>
                <div className="row d-flex justify-content-center articles-list-row">
                    {(showAll ? sortedArticles : sortedArticles.slice(0,3)).map((article) => (
                        <div className="col-12 col-md-4 mb-5 d-flex justify-content-center" key={article.id}>
                            <ArticleDM 
                                article={article} 
                                setSelectedArticle={setSelectedArticle}
                                setSelectedAuthorNickname={setSelectedAuthorNickname}
                            />
                        </div>
                    ))}
                </div>
                {!showAll && sortedArticles.length > 3 && (
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="btn-show-articles" onClick={() => setShowAll(true)}>
                            Mostra di più
                        </Button>
                    </div>
                )}
                {showAll && sortedArticles.length > 3 && (
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" className="btn-show-articles" onClick={() => setShowAll(false)}>
                            Mostra di meno
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
}

export {ArticlesDM};