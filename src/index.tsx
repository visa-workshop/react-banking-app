import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { initSentry } from './sentry';

// Initialize Sentry error tracking
initSentry();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
