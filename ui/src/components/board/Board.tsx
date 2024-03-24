import { BoardColumn } from '../column/BoardColumn';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Board.module.scss';
import { useQuery } from 'react-query';
import { getBoard } from '../../../apis/Board';
import { FC } from 'react';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

interface BoardProps {
  boardId: string;
}

export const Board: FC<BoardProps> = ({ boardId }) => {
  const boardQuery = useQuery(['board', boardId], () => getBoard(boardId), {
    enabled: !!boardId,
  });

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

  const columnsList = boardQuery.data?.data.columns || [];

  return (
    <div className={styles.root}>
      {columnsList.map((column, index) => (
        <BoardColumn
          key={column.id}
          column={column}
          canAddTicket={index === 0}
        />
      ))}
    </div>
  );
};
