import { useEffect } from 'react';
import Desktop from './components/Desktop';
import { uiSettings } from './data/config';
import './styles/win98.css';

function App() {
  // Apply UI scale as CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--ui-scale', uiSettings.scale);
  }, []);

  return <Desktop />;
}

export default App;
