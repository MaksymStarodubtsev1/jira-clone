import { useState } from 'react';

import styles from './Home.module.scss';
import { Board } from '../components/board';
import { BoardAutocomplete } from '../components/autocomplete';
import { useQuery } from 'react-query';

import { getBoards } from '../../apis/Board';

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

  const boardsQuery = useQuery(['boards', search], () => getBoards(search), {
    enabled: !!search,
  });

  const options = boardsQuery.data?.data || [];
  return (
    <div className={styles.root}>
      <BoardAutocomplete
        optionsList={options}
        loading={boardsQuery.isLoading}
        search={search}
        setSearch={setSearch}
        boardId={currentBoardId}
        setCurrentBoardId={setCurrentBoardId}
      />
      <Board boardId={currentBoardId} />
    </div>
  );
};
