import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from './api';

export function App() {
  const health = useQuery({ queryKey: ['health'], queryFn: fetchHealth, retry: false });

  let status = 'vérification en cours…';
  if (health.isError) status = 'API indisponible';
  else if (health.isSuccess) status = 'API disponible';

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="site-header">
        <p className="logo">MoneyTrack</p>
      </header>
      <main id="contenu" tabIndex={-1}>
        <h1>Votre budget, sans exploitation de vos données</h1>
        <p>Importez vos relevés, catégorisez vos dépenses et suivez votre reste à vivre.</p>
        <p role="status">État du service : {status}</p>
      </main>
    </>
  );
}
