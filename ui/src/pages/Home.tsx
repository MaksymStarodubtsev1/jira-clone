import { useState } from 'react';

import styles from './Home.module.scss';
import { Board } from '../components/board';
import { BoardAutocomplete } from '../components/autocomplete';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const [currentBoardId, setCurrentBoardId] = useState(
    '65fafadee946d357eafb45de'
  );
  const [search, setSearch] = useState('react');

  return (
    <div className={styles.root}>
      <BoardAutocomplete
        search={search}
        setSearch={setSearch}
        boardId={currentBoardId}
        setCurrentBoardId={setCurrentBoardId}
      />
      <Board boardId={currentBoardId} />
    </div>
  );
};
