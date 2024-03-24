import { FC, SetStateAction, useState } from 'react';
import { useMutation } from 'react-query';

import { Button, DialogTitle, DialogActions, Dialog } from '@mui/material';
import type { PaperProps } from '@mui/material';

import { queryClient } from '../../../../core/http-client';
import { deleteBoard } from '../../../../apis/Board';
import { Loading } from '../../../../shared/components/loading';

interface DeleteBoardModalProps {
  board?: {
    id: string;
    title: string;
  };
  loading: boolean;
  setCurrentBoard: SetStateAction<any>;
}

export const DeleteBoardModal: FC<DeleteBoardModalProps> = ({
  board,
  loading,
  setCurrentBoard,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteBoardMutation = useMutation(deleteBoard, {
    onSuccess: () => {
      queryClient.invalidateQueries(['board', board?.id]);
      setCurrentBoard(null);
    },
    onSettled: () => {
      setIsDeleteModalOpen(false);
    },
  });

  const isBoardEmpty = !board;
  const disabledFields: boolean =
    isBoardEmpty || loading || deleteBoardMutation.isLoading;

  const handleDeleteBoard = (board: any) => {
    deleteBoardMutation.mutate(board.id);
  };

  const deleteCardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();

      handleDeleteBoard({ id: board?.id });
    },
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        disabled={disabledFields}
        onClick={() => setIsDeleteModalOpen(true)}
      >
        {isBoardEmpty ? 'Delete' : `Delete ${board.title} board`}
      </Button>
      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={isDeleteModalOpen}
        onClose={() => {
          if (disabledFields) {
            return;
          }
          setIsDeleteModalOpen(false);
        }}
        PaperProps={deleteCardModalProps}
      >
        {deleteBoardMutation.isLoading ? (
          <Loading />
        ) : (
          <>
            <DialogTitle>{`Are you sure you whant to delete ${board?.title} board`}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Delete</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};
