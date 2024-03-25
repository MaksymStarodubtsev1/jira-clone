import { FC, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useMutation } from 'react-query';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import styles from './BoardCard.module.scss';
import { deleteCardById, editCardById, moveCardToColumnById } from '../../../../apis/Card';
import { queryClient } from '../../../../core/http-client';
import { Loading } from '../../../../shared/components/loading';
import { Ticket } from '../../../../shared/types/index';
import { ItemTypes } from '../../../../shared/constans';

export interface BoardCardProps {
  item: Ticket;
}

export const BoardCard: FC<BoardCardProps> = ({ item }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [updatedBoard, setUpdatedBoard] = useState(item);

  const handleCloseEditModal = () => setIsEditable(false);

  const moveCardToColumnMutation = useMutation(moveCardToColumnById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const editCardMutation = useMutation(editCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
    onSettled: handleCloseEditModal,
  });

  const deleteCardMutation = useMutation(deleteCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<Ticket>();
      if (item && dropResult) {
        moveCardToColumnMutation.mutate({
          columnId: dropResult.id,
          cardId: item.id,
        });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  const cursor = isEditable ? 'text' : 'move';
  const disabledFields = editCardMutation.isLoading;

  const handleUpdateCard = ({ id, boardDetails }: any) => {
    editCardMutation.mutate({
      id: id,
      details: boardDetails,
    });
  };

  const handleRemoveCard = () => {
    deleteCardMutation.mutate(item.id);
  };

  const dialogContent = disabledFields ? (
    <Loading />
  ) : (
    <>
      <DialogTitle>Update card info</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          label="title"
          type="text"
          fullWidth
          variant="standard"
          value={updatedBoard.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedBoard((_board) => ({ ..._board, title: event.target.value }));
          }}
        />
        <TextField
          required
          margin="dense"
          label="description"
          type="text"
          fullWidth
          variant="standard"
          value={updatedBoard.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedBoard((_board) => ({ ..._board, description: event.target.value }));
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditModal}>Cancel</Button>
        <Button
          onClick={() =>
            handleUpdateCard({
              id: item.id,
              boardDetails: updatedBoard,
            })
          }
        >
          Save
        </Button>
      </DialogActions>
    </>
  );

  return (
    <Card classes={{ root: styles.root }} ref={drag} style={{ opacity, cursor }}>
      <CardContent>
        <Typography variant="h5">{item.title}</Typography>
        <Typography variant="body2">{item.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => setIsEditable(true)}>
          Edit
        </Button>
        <Button size="small" onClick={handleRemoveCard}>
          Delete
        </Button>
      </CardActions>
      <Dialog
        fullWidth
        maxWidth={'xs'}
        open={isEditable}
        onClose={() => {
          if (disabledFields) return;
          else handleCloseEditModal();
        }}
      >
        {dialogContent}
      </Dialog>
    </Card>
  );
};
