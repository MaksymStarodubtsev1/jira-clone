import { useState } from 'react';
import { BoardColumn } from '../components/column/BoardColumn';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Home.module.scss';
import { useQuery } from 'react-query';
import { getBoards } from '../../apis/Board';

const columns = [
  {
    id: 1,
    title: 'todo',
    tickets: [
      {
        id: 11,
        title: 'Title text',
        description: 'Description text',
      },
      {
        id: 12,
        title: 'Title text',
        description: 'Description text',
      },
    ],
  },
  { id: 2, title: 'in progress', tickets: [] },
  { id: 3, title: 'done', tickets: [] },
];

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const boardsQuery = useQuery('boards', getBoards);

  if (boardsQuery.isError) {
    return <Alert severity="error">This is an error Alert.</Alert>;
  }

  if (boardsQuery.isLoading) {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={boardsQuery.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const columnsList = boardsQuery.data?.data.columns;

  return (
    <div className={styles.root}>
      {columnsList?.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          setColumn={() => {}}
        ></BoardColumn>
      ))}
    </div>
  );
};
