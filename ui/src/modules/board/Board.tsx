import { useState } from 'react';
import { useQuery } from 'react-query';

import { TicketBoard } from './components/ticket-board';
import { BoardInfo } from './components/board-info/BoardInfo';
import styles from './Board.module.scss';
import { Autocomplete } from '../../shared/components/autocomplete';
import { getBoards } from '../../apis/Board';
import { useDebounce } from '../../utils';
import { Board } from '../../shared/types';

export const BoardView = () => {
  const [currentBoard, setCurrentBoard] = useState<Board>();
  const [search, setSearch] = useState<string>('');

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
      <TicketBoard boardId={currentBoard?.id} />
    </div>
  );
};
