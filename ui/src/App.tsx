import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClientProvider } from 'react-query';

import { BoardView } from './modules/board';
import { queryClient } from '@core/http-client';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <ScopedCssBaseline />
        <BoardView />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
