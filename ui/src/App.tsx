import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from 'react-query'

import { Home } from './pages/Home';

const queryClient = new QueryClient()

function App() {
  return (
    <ScopedCssBaseline>
      <DndProvider backend={HTML5Backend}>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </DndProvider>
    </ScopedCssBaseline>
  );
}

export default App;
