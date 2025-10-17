import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppClean from './AppClean.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppClean />
  </StrictMode>
);
