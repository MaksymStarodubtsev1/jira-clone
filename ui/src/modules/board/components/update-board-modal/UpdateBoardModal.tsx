import { FC, useState } from 'react';
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
import { updateBoard } from '../../../../apis/Board';

interface UpdateBoardModalProps {
  board?: {
    id: string;
    title: string;
  };
  loading: boolean;
}

export const UpdateBoardModal: FC<UpdateBoardModalProps> = ({
  board,
  loading,
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const updateNewBoardMutation = useMutation(updateBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries(['board', board?.id]);
    },
  });

  const handleUpdateBoard = (board: any) => {
    updateNewBoardMutation.mutate({
      id: board.id,
      title: board.title,
    });

    setIsUpdateModalOpen(false);
  };

  const updateCardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(
        event.currentTarget as unknown as HTMLFormElement
      );
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;

      handleUpdateBoard({id: board?.id, title});
    },
  };

  const boardExist = !!board;

  const buttonDisabled = !boardExist || loading;

  return (
    <>
      <Button
        disabled={buttonDisabled}
        onClick={() => setIsUpdateModalOpen(true)}
      >
        {boardExist ? `Update ${board.title} board` : 'Update'}
      </Button>
      <Dialog
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        PaperProps={updateCardModalProps}
      >
        <DialogTitle>{`Update ${board?.title} board`}</DialogTitle>
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
          <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
