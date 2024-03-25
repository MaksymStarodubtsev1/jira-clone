import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClientProvider } from 'react-query';

import { Board } from './modules/board';
import { queryClient } from '../src/core/http-client';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <ScopedCssBaseline />
        <Board />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
