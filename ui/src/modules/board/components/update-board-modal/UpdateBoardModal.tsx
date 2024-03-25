import { FC, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField } from '@mui/material';
import type { PaperProps } from '@mui/material';

import { queryClient } from '../../../../core/http-client';
import { updateBoard } from '../../../../apis/Board';
import { Loading } from '../../../../shared/components/loading';

interface UpdateBoardModalProps {
  board?: {
    id: string;
    title: string;
  };
  loading: boolean;
}

export const UpdateBoardModal: FC<UpdateBoardModalProps> = ({ board, loading }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const updateNewBoardMutation = useMutation(updateBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries(['board', board?.id]);
    },
    onSettled: () => {
      setIsUpdateModalOpen(false);
    },
  });

  const isBoardEmpty = !board;
  const disabledFields: boolean = isBoardEmpty || loading || updateNewBoardMutation.isLoading;

  const handleUpdateBoard = (board: any) => {
    updateNewBoardMutation.mutate({
      id: board.id,
      title: board.title,
    });
  };

  const updateBoardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as unknown as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;

      handleUpdateBoard({ id: board?.id, title });
    },
  };

  return (
    <>
      <Button
        variant="outlined"
        disabled={disabledFields}
        onClick={() => setIsUpdateModalOpen(true)}
      >
        {isBoardEmpty ? 'Update' : `Update board`}
      </Button>
      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={isUpdateModalOpen}
        onClose={() => {
          if (disabledFields) {
            return;
          }
          setIsUpdateModalOpen(false);
        }}
        PaperProps={updateBoardModalProps}
      >
        {updateNewBoardMutation.isLoading ? (
          <Loading />
        ) : (
          <>
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
          </>
        )}
      </Dialog>
    </>
  );
};
