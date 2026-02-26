import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from '@/App';
import { HomeAssistantProvider } from '@/shared/providers/HomeAssistantProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const HA_HTTP_URL = import.meta.env.VITE_HA_HTTP_URL;
const HA_WS_URL = HA_HTTP_URL
  ? HA_HTTP_URL.replace(/^http/, 'ws') + '/api/websocket'
  : (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + `//${window.location.host}/api/websocket`;
const HA_TOKEN = import.meta.env.VITE_HA_TOKEN;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <HomeAssistantProvider haToken={HA_TOKEN} url={HA_WS_URL}>
      <App />
    </HomeAssistantProvider>
  </QueryClientProvider>
);
