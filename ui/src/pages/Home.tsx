import { useState } from 'react';

import styles from './Home.module.scss';
import { Board } from '../components/board';
import { BoardAutocomplete } from '../components/autocomplete';
import { useMutation, useQuery } from 'react-query';

import { createBoard, getBoards } from '../../apis/Board';
import { useDebounce } from '../utils';
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
} from '@mui/material';
import type { PaperProps } from '@mui/material';

import { queryClient } from '../../core/http-client';

export interface Ticket {
  id: string;
  title: string;
  description: string;
}

export const Home = () => {
  const [currentBoardId, setCurrentBoardId] = useState(
    '65fafadee946d357eafb45de'
  );
  const [search, setSearch] = useState<string>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const searchValue = useDebounce(search?.trim());

  const boardsQuery = useQuery(
    ['boards', searchValue],
    () => getBoards(searchValue),
    {
      enabled: !!searchValue,
    }
  );

  const createNewBoardMutation = useMutation(createBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const handleCreateBoard = (title: string) => {
    createNewBoardMutation.mutate({
      title,
    });

    setIsCreateModalOpen(false);
  };

  const createCardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(
        event.currentTarget as unknown as HTMLFormElement
      );
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;

      handleCreateBoard(title);
    },
  };

  const options = boardsQuery.data?.data || [];
  return (
    <div className={styles.root}>
      <BoardAutocomplete
        optionsList={options}
        loading={boardsQuery.isLoading}
        search={search}
        setSearch={setSearch}
        setCurrentBoardId={setCurrentBoardId}
      />
      <Button onClick={() => setIsCreateModalOpen(true)}>
        Create new board
      </Button>
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        PaperProps={createCardModalProps}
      >
        <DialogTitle>Create new board</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="title"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
      <Board boardId={currentBoardId} />
    </div>
  );
};
