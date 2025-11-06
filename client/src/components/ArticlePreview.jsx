import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Alert, Button, Container, Col, Row, Spinner, Accordion } from "react-bootstrap";
import { Article } from '../models/models.mjs'
import '../style/Article.css';
import { useNavigate } from "react-router";
import { incrementArticleVisuals } from "../API/API.mjs";

const SERVER_URL = "http://localhost:3001";

function ArticleDM(props) {
    const article = props.article;
    const setSelectedArticle = props.setSelectedArticle;
    const setSelectedAuthorNickname = props.setSelectedAuthorNickname;
    const navigate = useNavigate();
    
    const handleReadArticle = async () => {
        await incrementArticleVisuals(article.id);
        setSelectedArticle(article);
        navigate("/article");
    };

    const handleAuthorClick = () => {
        if (setSelectedAuthorNickname && article.nickname) {
            setSelectedAuthorNickname(article.nickname);
            navigate("/author");
        }
    };

    return (
        <Card className="article-card">
            {/* 
                <Card.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header><Card.Title>{article.title}</Card.Title></Accordion.Header>
                            <Accordion.Body>
                                {article.extract}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            */ }
            <Card.Body>
                <div>
                    <Card.Title>{article.title}</Card.Title>
                </div>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item className="category-section">
                    <span className="category-label">{article.category && article.category.toUpperCase()}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                    <i className="bi bi-pen"></i> <span 
                        onClick={handleAuthorClick}
                        style={{ cursor: 'pointer', textDecoration: 'underline', color: '#007bff' }}
                    >
                        {article.nickname}
                    </span> - {article.date && article.date.format ? article.date.format("DD/MM/YYYY") : article.date}
                </ListGroup.Item>
                
                <ListGroup.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ marginLeft: '32px' }}>
                            <i className="bi bi-eye"></i> {article.visuals ? article.visuals : 0}
                        </span>
                        <span>
                            <i className="bi bi-hand-thumbs-up"></i> {article.likes ? article.likes : 0}
                        </span>
                        <span style={{ marginRight: '32px' }}>
                            <i className="bi bi-chat-dots"></i> {article.comments ? article.comments : 0}
                        </span>
                    </div>
                </ListGroup.Item>

            </ListGroup>
            <Card.Body>
                <div className="article-actions-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <em style={{ marginBottom: "0.7rem", display: "block" }}>{article.extract}</em>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <i className="bi bi-bookmark-star article-icon"></i>
                        <Button
                            variant="success"
                            className="btn-read-article"
                            style={{ margin: "0 1rem" }}
                            onClick={handleReadArticle}
                        >
                            Leggi l'articolo
                        </Button>
                        <i className="bi bi-stopwatch article-icon"></i>
                        
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export { ArticleDM };