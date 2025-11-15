import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router';
import '../style/AuthorPreview.css';

function AuthorPreview(props) {
    const { author, setSelectedAuthorNickname } = props;
    const navigate = useNavigate();
    
    // TODO: Sostituire con author.photoUrl quando disponibile nel DB
    const photoPlaceholder = "/profile-photo.jpg";

    const handleViewAuthor = () => {
        if (setSelectedAuthorNickname && author.nickname) {
            setSelectedAuthorNickname(author.nickname);
            navigate('/author');
        }
    };

    return (
        <Card className="author-card">
            <Card.Body className="author-header">
                <Card.Title className="author-name">
                    {author.nickname || `Autore #${author.id}`}
                </Card.Title>
            </Card.Body>

            {/* Foto autore */}
            <div className="author-photo-container">
                <img 
                    src={author.profile_photo ? `http://localhost:3001${author.profile_photo}` : photoPlaceholder} 
                    className="author-photo"
                />
            </div>

            {/* Presentazione */}
            <Card.Body>
                <div className="author-presentation">
                    <p>{author.presentation}</p>
                </div>

                {/* Pulsanti contatto con pulsante centrale */}
                <div className="author-buttons-row">
                    {author.insta && (
                        <a 
                            href={author.insta} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-contact btn-instagram"
                        >
                            <i className="bi bi-instagram"></i>
                        </a>
                    )}
                    
                    <Button 
                        variant="primary" 
                        className="btn-view-author"
                        onClick={handleViewAuthor}
                    >
                        <i className="bi bi-person-fill"></i> Visita il profilo
                    </Button>
                    
                    {author.email && (
                        <a 
                            href={`mailto:${author.email}`}
                            className="btn btn-contact btn-email"
                        >
                            <i className="bi bi-envelope-fill"></i>
                        </a>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

export { AuthorPreview };
