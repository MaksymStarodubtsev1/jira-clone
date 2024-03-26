import { FC } from 'react';

import { Typography } from '@mui/material';
import { Board } from '@shared/types';

import styles from './BoardInfo.module.scss';
import { CreateBoardModal } from '../create-board-modal';
import { UpdateBoardModal } from '../update-board-modal';
import { DeleteBoardModal } from '../delete-board-modal';

interface BoardInfoProps {
  currentBoard?: Board;
  setCurrentBoard: (value: Board | undefined) => void;
  loading: boolean;
}

export const BoardInfo: FC<BoardInfoProps> = ({ currentBoard, loading, setCurrentBoard }) => {
  return (
    <div className={styles.root}>
      {currentBoard && (
        <Typography variant="h4" display="block">
          {currentBoard.title}
        </Typography>
      )}
      <div className={styles.actions}>
        <CreateBoardModal setCurrentBoard={setCurrentBoard} />
        <UpdateBoardModal board={currentBoard} loading={loading} setCurrentBoard={setCurrentBoard} />
        <DeleteBoardModal board={currentBoard} loading={loading} setCurrentBoard={setCurrentBoard} />
      </div>
    </div>
  );
};
