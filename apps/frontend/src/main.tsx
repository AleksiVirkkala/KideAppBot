import './utils/trpc';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TrpcWrapper from './components/TrpcWrapper';

import App from './components/App';
import './config/socket';
import './index.css';

// eslint-disable-next-line
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrpcWrapper>
      <App />
    </TrpcWrapper>
  </StrictMode>
);
