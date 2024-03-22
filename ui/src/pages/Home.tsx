import { BoardColumn } from '../components/column/BoardColumn';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Home.module.scss';
import { useQuery } from 'react-query';
import { getBoard } from '../../apis/Board';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const boardsQuery = useQuery('board', getBoard);

  const isLoading = boardsQuery.isLoading;
  const isError = boardsQuery.isError;

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
        <BoardColumn
          key={column.id}
          column={column}
          canAddTicket={index === 0}
        ></BoardColumn>
      ))}
    </div>
  );
};
