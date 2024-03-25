import { FC, useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import styles from './Autocomplete.module.scss';
import { Autocomplete as MuiAutocomplete } from '@mui/material';

import TextField from '@mui/material/TextField';

export interface AutocompleteProps {
  optionsList: any[];
  loading: boolean;
  label?: string;
  search?: string;
  setSearch: (value: string) => void;
  setValue: (value: any) => void;
}

export const Autocomplete: FC<AutocompleteProps> = ({
  optionsList = [],
  loading,
  search = '',
  label = '',
  setSearch,
  setValue,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<any[]>(optionsList);

  useEffect(() => {
    setOptions(optionsList);
  }, [optionsList]);

  return (
    <div className={styles.root}>
      <MuiAutocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_: any, newValue: any) => {
          if (newValue) {
            setValue(newValue);
          }
        }}
        inputValue={search}
        onInputChange={(_, newInputValue) => {
          setSearch(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
