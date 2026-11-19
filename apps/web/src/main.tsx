import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// Écoconception : pas de rafraîchissement automatique au retour sur l'onglet,
// données considérées comme fraîches pendant 1 minute.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 60_000 },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément #root introuvable');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
