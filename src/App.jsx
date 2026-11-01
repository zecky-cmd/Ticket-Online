import OnlineScreen from './screen/OnlineScreen';

/**
 * Composant Racine de l'Application
 * 
 * Orchestrateur principal : affiche l'écran en ligne (OnlineScreen).
 * Permet l'ajout aisé d'un routeur multi-pages (ex: react-router)
 * ou d'écrans futurs (TrackingScreen, AdminScreen...).
 */
export default function App(props) {
  return <OnlineScreen {...props} />;
}
