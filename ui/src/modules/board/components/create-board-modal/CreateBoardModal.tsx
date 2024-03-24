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
import { Loading } from '../../../../shared/components/loading';

export const CreateBoardModal = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createNewBoardMutation = useMutation(createBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
    onSettled: () => {
      setIsCreateModalOpen(false);
    },
  });

  const disabledFields = createNewBoardMutation.isLoading;

  const handleCreateBoard = (title: string) => {
    createNewBoardMutation.mutate({
      title,
    });
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
      <Button
        variant="contained"
        color="success"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create new board
      </Button>
      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={isCreateModalOpen}
        onClose={() => {
          if (disabledFields) {
            return;
          }

          setIsCreateModalOpen(false);
        }}
        PaperProps={createCardModalProps}
      >
        {' '}
        {disabledFields ? (
          <Loading />
        ) : (
          <>
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
              <Button onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
