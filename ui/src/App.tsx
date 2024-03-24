import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClientProvider } from 'react-query';

import { Home } from './modules/board';
import { queryClient } from '../src/core/http-client';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <ScopedCssBaseline />
        <Home />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
