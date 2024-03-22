import { FC, useState } from 'react';

import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from 'react-query';
import { getBoards } from '../../../apis/Board';
import Autocomplete from '@mui/material/Autocomplete';

import TextField from '@mui/material/TextField';

export interface BoardAutocompleteProps {
  search: string;
  boardId: string;
  setSearch: (value: string) => void;
  setCurrentBoardId: (value: string) => void;
}

export const BoardAutocomplete: FC<BoardAutocompleteProps> = ({
  search = '',
  setSearch,
  boardId,
  setCurrentBoardId,
}) => {
  const [value, setValue] = useState('');
  const boardsQuery = useQuery('boards', () => getBoards(search), {
    enabled: search.length > 2,
    staleTime: 1000 * 5,
  });

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

  const boardsList = boardsQuery.data?.data ?? [];

  return (
    <Autocomplete
      value={value}
      onChange={(f: any, newValue: string | null) => {
        setValue(newValue);
      }}
      inputValue={search}
      onInputChange={(event, newInputValue) => {
        setSearch(newInputValue);
      }}
      options={boardsList.map((option) => option.title)}
      renderInput={(params) => <TextField {...params} label="Board search" />}
    />
  );
};
