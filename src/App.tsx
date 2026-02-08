import './App.css';
import Light from './components/Light';
import { useHomeAssistant } from './hooks/useHomeAssistant';
import { useLights } from './hooks/useLights';


export default function App() {
  const { status, error } = useHomeAssistant();
  const { lights } = useLights();

  return (
    <>
      <div className="App">
        <h1>Home Assistant Frontend</h1>
        <p>Status: {status}</p>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>

      <div>
        <h2>Lights</h2>
        {lights.map(light => <Light key={light.entity_id} light={light} />)}
      </div>
    </>
  );
}