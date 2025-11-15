import { Carousel, Card, Badge } from 'react-bootstrap';
import '../style/Event.css';

function Event({ event }) {
    if (!event) return null;

    // Default images to use when no photo is provided
    const defaultImages = [
        '/default_images/default_event_image_3.jpg',
        '/default_images/default_event_image_2.jpg',
        '/default_images/default_event_image_1.jpg'
    ];

    // Parse photos: if photo is a string with comma-separated URLs, split it; otherwise use it as single photo
    // If no photo provided or empty, use default images
    const photos = event.photo && typeof event.photo === 'string' && event.photo.trim() !== ''
        ? (event.photo.includes(',')
            ? event.photo.split(',').map(p => p.trim())
            : [event.photo])
        : defaultImages;

    // Status badge variant mapping
    const statusVariants = {
        upcoming: 'primary',
        ongoing: 'success',
        completed: 'secondary',
        cancelled: 'danger'
    };

    return (
        <Card className="event-card">
            {/* Carousel for event photos */}
            <Carousel className="event-carousel" interval={4000} indicators={photos.length > 1} controls={photos.length > 1}>
                {photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                        <div className="event-carousel-img-wrapper">
                            <img
                                className="d-block w-100 event-carousel-img"
                                src={photo}
                                alt={`${event.title} - ${index + 1}`}
                            />
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Card.Body className="event-body">
                {/* Header: title, category, status */}
                <div className="event-header">
                    <Card.Title className="event-title">{event.title}</Card.Title>
                </div>

                {/* Extract */}
                {event.extract && (
                    <Card.Text className="event-extract">{event.extract}</Card.Text>
                )}

                {/* Date and location info - 2x2 grid */}
                <div className="event-info-grid">
                    <div className="event-info-item">
                        <i className="bi bi-calendar-event"></i>
                        <span>{event.date.format('DD MMMM YYYY - HH:mm')}</span>
                    </div>
                    <div className="event-info-item">
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>{event.location}</span>
                    </div>
                    <div className="event-info-item">
                        <i className="bi bi-signpost"></i>
                        <span>{event.address}</span>
                    </div>
                    <div className="event-info-item">
                        <i className="bi bi-people-fill"></i>
                        <span>{event.capacity ? `Capienza: ${event.capacity}` : 'Capienza libera'}</span>
                    </div>
                </div>

                {/* Description */}
                <Card.Text className="event-description">{event.description}</Card.Text>

                {/* Instagram button */}
                <a 
                    href="https://www.instagram.com/duemilamagazine?igsh=MW1kZzZjYXR6MTQ5bQ==" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="event-instagram-btn"
                >
                    <i className="bi bi-instagram"></i>
                    <span>Maggiori informazioni su Instagram</span>
                </a>
            </Card.Body>
        </Card>
    );
}

export { Event };
