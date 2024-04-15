import { QueryClientProvider } from 'react-query';

import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { queryClient } from '@core/http-client';
import { DndProvider } from "@core/dnd";

import { BoardView } from './modules/board';
function App() {
  return (
    <DndProvider>
      <QueryClientProvider client={queryClient}>
        <ScopedCssBaseline />
        <BoardView />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
