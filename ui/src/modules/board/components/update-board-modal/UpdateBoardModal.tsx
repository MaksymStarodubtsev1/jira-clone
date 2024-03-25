import { FC, SetStateAction, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField } from '@mui/material';

import { queryClient } from '../../../../core/http-client';
import { updateBoard } from '../../../../apis/Board';
import { Loading } from '../../../../shared/components/loading';

interface UpdateBoardModalProps {
  board?: {
    id: string;
    title: string;
  };
  loading: boolean;
  setCurrentBoard: SetStateAction<any>;
}

export const UpdateBoardModal: FC<UpdateBoardModalProps> = ({ board, loading, setCurrentBoard }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [title, setTitle] = useState(board?.title);

  useEffect(() => {
    if (board?.title) {
      setTitle(board.title);
    }
  }, [board?.title]);

  const updateNewBoardMutation = useMutation(updateBoard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['board', board?.id]);
      setCurrentBoard(data.data);
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

  const dialogContent = updateNewBoardMutation.isLoading ? (
    <Loading />
  ) : (
    <>
      <DialogTitle>{`Update ${board?.title} board`}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          label="title"
          type="text"
          fullWidth
          variant="standard"
          value={title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
        <Button onClick={() => handleUpdateBoard({ ...board, title })}>Update</Button>
      </DialogActions>
    </>
  );

  return (
    <>
      <Button variant="outlined" disabled={disabledFields} onClick={() => setIsUpdateModalOpen(true)}>
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
      >
        {dialogContent}
      </Dialog>
    </>
  );
};
