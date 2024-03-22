import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Home.module.scss';
import { useQuery } from 'react-query';
import { getBoard } from '../../apis/Board';
import Autocomplete from '@mui/material/Autocomplete';
import { Board } from '../components/board';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const [currentBoardId, setCurrentBoardId] = useState(
    '65fafadee946d357eafb45de'
  );
  const [search, setSearch] = useState('');

  const boardQuery = useQuery('board', () => getBoard(currentBoard));
  const boardsQuery = useQuery('boards', () => getBoard(search));

  const isLoading = boardQuery.isLoading;
  const isError = boardQuery.isError;

  if (isError) {
    return <Alert severity="error">This is an error Alert.</Alert>;
  }

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: '#fff',
          opacity: 0.4,
          zIndex: (theme: any) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const columnsList = boardsQuery.data?.data.columns;

  return (
    <div className={styles.root}>
      {columnsList?.map((column, index) => (
      <Board boardId={currentBoardId} />
    </div>
  );
};
