import { useState } from 'react';
import { useMutation } from 'react-query';

import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
} from '@mui/material';
import type { PaperProps } from '@mui/material';

import { queryClient } from '../../../../core/http-client';
import { createBoard } from '../../../../apis/Board';

export const CreateBoardModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <>
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
    </>
  );
};
