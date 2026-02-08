import './App.css';
import { useHomeAssistant } from './hooks/useHomeAssistant';


function App() {
  const { status, error } = useHomeAssistant();
}

export default App;