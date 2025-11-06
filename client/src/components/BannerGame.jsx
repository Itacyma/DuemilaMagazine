import {Button, Alert} from 'react-bootstrap';
import { useNavigate } from "react-router";
import '../style/BannerGame.css'

function BannerGameDM(props) {
  const { user } = props;
  const navigate = useNavigate();

  return (
    <Alert variant="success" className="banner-alert" >
      {user ? (
        user.game === 0 ? (
          <>
            <Alert.Heading>
              Hey {user.name.split(" ")[0]}, non hai ancora fatto il quiz della settimana!
            </Alert.Heading>
            <p>
              Clicca sul pulsante qui sotto per iniziare a giocare, un nuovo minigioco ti attende...
            </p>
            <hr />
            <p className="mb-0">
              <Button variant="outline-success" onClick={() => navigate('/game')}>Vai al gioco</Button>
            </p>
          </>
        ) : (
          <>
            <Alert.Heading>Complimenti {user.name.split(" ")[0]}, hai già completato il quiz di questa settimana!</Alert.Heading>
            <hr />
            <p className="mb-0">
              <span>Torna la prossima settimana per una nuova sfida!</span>
            </p>
          </>
        )
      ) : (
        <>
          <Alert.Heading>Accedi per giocare al quiz della settimana!</Alert.Heading>
          <p>
            Effettua il login o crea un nuovo account per accedere ai giochi settimanali.
          </p>
          <hr />
          <p className="mb-0">
            <Button variant="outline-success" onClick={() => navigate('/login')}>Vai al login</Button>
          </p>
        </>
      )}
    </Alert>
  );
}

export {BannerGameDM};