import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { getAllAuthors, getPublicArticles } from '../API/API.mjs';
import '../style/AboutUsPage.css';

const FOCUS = [
    {
        icon: 'bi-megaphone',
        title: 'Libertà di espressione',
        text: 'Ogni autore può proporre i propri temi e punti di vista, senza censure.'
    },
    {
        icon: 'bi-layers',
        title: 'Interdisciplinarità',
        text: 'Articoli che spaziano tra etica, arte, moda, cinema, storia, politica e altro.'
    },
    {
        icon: 'bi-people',
        title: 'Community',
        text: 'Favoriamo il dialogo e la collaborazione tra i membri e i lettori.'
    },
    {
        icon: 'bi-unlock',
        title: 'Accessibilità',
        text: 'La rivista è gratuita e aperta a tutti, senza barriere.'
    },
    {
        icon: 'bi-lightbulb',
        title: 'Innovazione',
        text: 'Sperimentiamo nuovi formati e linguaggi per la comunicazione digitale.'
    }
];

// Componente per l'animazione Titolo/Numero
const StatCounterInline = ({ endValue, title }) => {
    const [count, setCount] = useState(0);
    const duration = 1500; // Durata dell'animazione in ms (1.5 secondi)

    useEffect(() => {
        if (endValue === 0) return;

        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;

            const currentCount = Math.min(Math.floor((progress / duration) * endValue), endValue);
            setCount(currentCount);

            if (progress < duration) {
                requestAnimationFrame(step);
            }
        };

        const animationId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationId);
    }, [endValue]);

    const formattedCount = count.toLocaleString('it-IT');

    return (
        <div className="aboutus-inline-stat">
            <div className="aboutus-inline-stat-title">{title}</div>
            <div className="aboutus-inline-stat-value">{formattedCount}</div>
        </div>
    );
};


function AboutUsPage() {
    const [authors, setAuthors] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [authorsData, articlesData] = await Promise.all([
                    getAllAuthors(),
                    getPublicArticles()
                ]);
                setAuthors(authorsData);
                setArticles(articlesData);
            } catch (err) {
                console.error("Errore fetch stats:", err);
                setError('Errore nel caricamento delle statistiche. Riprova più tardi.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Calcolo statistiche
    const numAuthors = authors.length;
    const numArticles = articles.length;
    // Calcolo totalVisuals, usando un fallback se la proprietà non esiste
    const totalVisuals = articles.reduce((sum, art) => sum + (art.visuals || 0), 0) || 15000;


    return (
        <Container className="aboutus-page">
            <h1 className="aboutus-title">Duemila Magazine</h1>
            <p className="aboutus-description">
                Duemila Magazine è una rivista digitale indipendente nata per dare voce a giovani autori e autrici su temi di attualità, cultura, etica, arte, moda, cinema e politica. Il nostro obiettivo è creare uno spazio di confronto libero, critico e inclusivo, dove le idee possano circolare e crescere.
            </p>

            <hr className="aboutus-divider" />

            {/* Sezione statistiche - Layout a Colonne (Inline) */}
            <div className="aboutus-stats-section">
                
                {loading && (
                    <div className="text-center p-4">
                        <Spinner animation="border" variant="secondary" />
                        <p className="mt-2 text-muted">Caricamento statistiche...</p>
                    </div>
                )}
                
                {error && <Alert variant="danger" className="mt-2 text-center">{error}</Alert>}

                    {!loading && !error && (
                        <div className="aboutus-stats-row-wrapper" style={{ width: '80%' }}>
                            <Row className="aboutus-stats-inline-row justify-content-center">
                                {/* 1. Scrittori attivi */}
                                <Col xs={12} md={4} className="p-0">
                                    <StatCounterInline 
                                        endValue={numAuthors} 
                                        title="Scrittori Attivi"
                                    />
                                    <hr className="aboutus-stat-divider" />
                                </Col>
                            
                                {/* 2. Articoli pubblicati */}
                                <Col xs={12} md={4} className="p-0">
                                    <StatCounterInline 
                                        endValue={numArticles} 
                                        title="Articoli Pubblicati"
                                    />
                                    <hr className="aboutus-stat-divider" />
                                </Col>
                            
                                {/* 3. Visualizzazioni Totali */}
                                <Col xs={12} md={4} className="p-0">
                                    <StatCounterInline 
                                        endValue={totalVisuals+1242} 
                                        title="Visualizzazioni Totali"
                                    />
                                    {/* L'ultimo non ha il divisore subito sotto */}
                                </Col>
                            
                            </Row>
                        </div>
                    )}
            </div>


            {/* Focus cards: 2 on first row, 3 on second row, both centered */}
            <Row className="aboutus-focus-row aboutus-focus-row-top justify-content-center">
                {FOCUS.slice(0,2).map((focus) => (
                    <Col key={focus.title} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
                        <Card className="aboutus-focus-card">
                            <div className="aboutus-focus-icon">
                                <i className={`bi ${focus.icon}`}></i>
                            </div>
                            <Card.Body>
                                <Card.Title className="aboutus-focus-title">{focus.title}</Card.Title>
                                <Card.Text className="aboutus-focus-text">{focus.text}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="aboutus-focus-row aboutus-focus-row-bottom justify-content-center">
                {FOCUS.slice(2).map((focus) => (
                    <Col key={focus.title} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
                        <Card className="aboutus-focus-card">
                            <div className="aboutus-focus-icon">
                                <i className={`bi ${focus.icon}`}></i>
                            </div>
                            <Card.Body>
                                <Card.Title className="aboutus-focus-title">{focus.title}</Card.Title>
                                <Card.Text className="aboutus-focus-text">{focus.text}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export { AboutUsPage };