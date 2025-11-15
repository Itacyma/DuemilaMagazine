import { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Event } from '../components/Event';
import { getEvents } from '../API/API.mjs';
import '../style/EventsPage.css';

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await getEvents();
                setEvents(response);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError(err.message || 'Errore nel caricamento degli eventi');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <Container className="events-page-loading">
                <Spinner animation="border" variant="primary" />
                <p>Caricamento eventi...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="events-page-error">
                <Alert variant="danger">
                    <Alert.Heading>Errore</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    return (
        <div className="events-page">
            <Container>
                <div className="events-page-header">
                    <h1 className="events-page-title">Eventi</h1>
                    <p className="events-page-subtitle">Scopri tutti gli eventi organizzati dalla nostra community</p>
                    <hr style={{ borderTop: '3px solid #662E9B', margin: '2rem 0 2rem' }} />
                </div>

                {events.length === 0 ? (
                    <Alert variant="info" className="events-empty-state">
                        <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
                        <h4>Nessun evento disponibile</h4>
                        <p>Al momento non ci sono eventi in programma. Torna presto per scoprire le novità!</p>
                    </Alert>
                ) : (
                    <div className="events-list">
                        {events.map((event) => (
                            <Event key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export { EventsPage };
