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

import { deleteCardById, editCardById, moveCardToColumnById } from '@apis/Card';
import { queryClient } from '@core/http-client';
import { Loading } from '@shared/components/loading';
import { Ticket } from '@shared/types/index';
import { ItemTypes } from '@shared/constans';

import styles from './BoardCard.module.scss';

export interface BoardCardProps {
  item: Ticket;
}

export const BoardCard: FC<BoardCardProps> = ({ item }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [updatedCard, setUpdatedCard] = useState(item);

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

  const handleUpdateCard = (updatedCardDetails: Ticket) => {
    editCardMutation.mutate(updatedCardDetails);
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
          value={updatedCard.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedCard((_card) => ({ ..._card, title: event.target.value }));
          }}
        />
        <TextField
          required
          label="description"
          type="text"
          margin="dense"
          fullWidth
          variant="standard"
          value={updatedCard.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedCard((_card) => ({ ..._card, description: event.target.value }));
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditModal}>Cancel</Button>
        <Button onClick={() => handleUpdateCard(updatedCard)}>Save</Button>
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
