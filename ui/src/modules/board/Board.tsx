import { useState } from 'react';
import { useQuery } from 'react-query';

import { BoardView } from './components/board-view';
import { BoardInfo } from './components/board-info/BoardInfo';
import styles from './Board.module.scss';
import { Autocomplete } from '../../shared/components/autocomplete';
import { getBoards } from '../../apis/Board';
import { useDebounce } from '../../utils';
import type { Ticket } from '../../shared/types';

export const Board = () => {
  const [currentBoard, setCurrentBoard] = useState<Ticket>();
  const [search, setSearch] = useState<string>();

  const searchValue = useDebounce(search?.trim());

  const boardsQuery = useQuery(['boards', searchValue], () => getBoards(searchValue), {
    enabled: !!searchValue,
  });

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
      <BoardInfo currentBoard={currentBoard} setCurrentBoard={setCurrentBoard} loading={boardsQuery.isLoading} />
      <BoardView boardId={currentBoard?.id} />
    </div>
  );
};
