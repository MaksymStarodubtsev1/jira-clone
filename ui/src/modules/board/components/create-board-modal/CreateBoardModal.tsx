import { FC, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField, PaperProps } from '@mui/material';
import { queryClient } from '@core/http-client';
import { createBoard } from '@apis/Board';
import { Loading } from '@shared/components/loading';
import type { Board } from '@shared/types';

interface CreateBoardModalProps {
  setCurrentBoard: (value: Board) => void;
}

export const CreateBoardModal: FC<CreateBoardModalProps> = ({ setCurrentBoard }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const createNewBoardMutation = useMutation(createBoard, {
    onSuccess: (data) => {
      setCurrentBoard(data.data);
      queryClient.invalidateQueries('board');
    },
    onSettled: () => {
      setIsCreateModalOpen(false);
    },
  });

  const handleCreateBoard = (title: string) => {
    createNewBoardMutation.mutate({
      title,
    });
  };

  const disabledFields = createNewBoardMutation.isLoading;

  const createCardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as unknown as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;

      handleCreateBoard(title);
    },
  };

  const dialogContent = disabledFields ? (
    <Loading />
  ) : (
    <>
      <DialogTitle>Create new board</DialogTitle>
      <DialogContent>
        <TextField autoFocus required id="title" name="title" label="title" type="text" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
        <Button type="submit">Create</Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <Button variant="contained" color="success" onClick={() => setIsCreateModalOpen(true)}>
        Create new board
      </Button>
      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={isCreateModalOpen}
        onClose={() => {
          if (disabledFields) return;
          else setIsCreateModalOpen(false);
        }}
        PaperProps={createCardModalProps}
      >
        {dialogContent}
      </Dialog>
    </>
  );
};
