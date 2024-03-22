import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Home } from './pages/Home';
import { queryClient } from '../core/http-client';

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
