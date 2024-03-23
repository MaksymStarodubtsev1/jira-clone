import { FC, useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import styles from './Autocomplete.module.scss';
import Autocomplete from '@mui/material/Autocomplete';

import TextField from '@mui/material/TextField';

export interface BoardAutocompleteProps {
  optionsList: any[];
  loading: boolean;
  search: string;
  boardId: string;
  setSearch: (value: string) => void;
  setCurrentBoardId: (value: string) => void;
}

export const BoardAutocomplete: FC<BoardAutocompleteProps> = ({
  optionsList = [],
  loading,
  search = '',
  setSearch,
  boardId,
  setCurrentBoardId,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] =
    useState<{ title: string; id: string }[]>(optionsList);

  useEffect(() => {
    setOptions(optionsList);
  }, [optionsList]);

  return (
    <div className={styles.root}>
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        inputValue={search}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter a board ID here..."
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </div>
  );
};
