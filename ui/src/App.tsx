import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { QueryClientProvider } from 'react-query';

import { BoardView } from './modules/board';
import { queryClient } from '@core/http-client';


const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const Backend = isMobile ? TouchBackend : HTML5Backend;

function App() {
  return (
    <DndProvider backend={Backend} options={{ enableMouseEvents: true }}>
      <QueryClientProvider client={queryClient}>
        <ScopedCssBaseline />
        <BoardView />
      </QueryClientProvider>
    </DndProvider>
  );
}

export default App;
