import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { HomeAssistantProvider } from './providers/HomeAssistantProvider';

const HA_WS_URL = import.meta.env.VITE_HA_WS_URL;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

createRoot(document.getElementById('root')!).render(
  <HomeAssistantProvider haToken={HA_TOKEN} url={HA_WS_URL}>
    <App />
  </HomeAssistantProvider>
);
