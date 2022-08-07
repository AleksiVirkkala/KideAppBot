import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './config/socket';
import './index.css';


// eslint-disable-next-line
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
