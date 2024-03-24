import { useState } from 'react';
import { useQuery } from 'react-query';

import styles from './Board.module.scss';
import { BoardView } from './components/board-view';
import { CreateBoardModal } from './components/create-board-modal';
import { Autocomplete } from '../../shared/components/autocomplete';
import { getBoards } from '../../apis/Board';
import { useDebounce } from '../../utils';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const [currentBoard, setCurrentBoard] = useState({ id: null });
  const [search, setSearch] = useState<string>();

  const searchValue = useDebounce(search?.trim());

  const boardsQuery = useQuery(
    ['boards', searchValue],
    () => getBoards(searchValue),
    {
      enabled: !!searchValue,
    }
  );

  const options = boardsQuery.data?.data || [];

  return (
    <div className={styles.root}>
      <Autocomplete
        optionsList={options}
        loading={boardsQuery.isLoading}
        search={search}
        label="Enter a board ID here..."
        setSearch={setSearch}
        setValue={setCurrentBoard}
      />
      <CreateBoardModal />
      <BoardView boardId={currentBoard?.id || ''} />
    </div>
  );
};
