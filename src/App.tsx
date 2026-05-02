import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <Canvas />
      <PropertiesPanel />
    </div>
  );
}

export default App;
