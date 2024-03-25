import { FC } from 'react';
import { useQuery } from 'react-query';

import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import styles from './BoardView.module.scss';
import { BoardColumn } from '../board-column/BoardColumn';
import { getBoard } from '../../../../apis/Board';
import type { Board } from '../../../../shared/types';

interface BoardProps {
  boardId?: string;
}

export const BoardView: FC<BoardProps> = ({ boardId }) => {
  const boardQuery = useQuery(['board', boardId], () => getBoard(boardId), {
    enabled: !!boardId,
  });

  const isLoading = boardQuery.isLoading;
  const isError = boardQuery.isError;

  if (isError) {
    return <Alert severity="error">Error appeared</Alert>;
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

  const columnsList: Board['columns'] = boardQuery.data?.data.columns || [];

  return (
    <div className={styles.root}>
      {columnsList.map((column, index) => (
        <BoardColumn key={column.id} column={column} canAddTicket={index === 0} />
      ))}
    </div>
  );
};
