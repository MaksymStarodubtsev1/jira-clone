import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Home } from './pages/Home';

function App() {
  return (
    <ScopedCssBaseline>
      <DndProvider backend={HTML5Backend}>
        <Home />
      </DndProvider>
    </ScopedCssBaseline>
  );
}

export default App;
