import { FC, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useMutation } from 'react-query';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  PaperProps,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';

import styles from './BoardCard.module.scss';
import { deleteCardById, editCardById, moveCardToColumnById } from '../../../../apis/Card';
import { Ticket } from '../../Board';
import { queryClient } from '../../../../core/http-client';
import { Loading } from '../../../../shared/components/loading';

export const ItemTypes = {
  BOX: 'box',
};

export interface BoardCardProps {
  item: Ticket;
}

export const BoardCard: FC<BoardCardProps> = ({ item }) => {
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => setIsEditable(true);
  const handleCancelEdit = () => setIsEditable(false);

  const moveCardToColumnMutation = useMutation(moveCardToColumnById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const editCardMutation = useMutation(editCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
    onSettled: handleCancelEdit,
  });

  const deleteCardMutation = useMutation(deleteCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const handleRemoveCard = () => {
    deleteCardMutation.mutate(item.id);
  };

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

  const editCardModalProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as unknown as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;
      const description = formJson.description as string;

      editCardMutation.mutate({
        id: item.id,
        details: {
          title,
          description,
        },
      });
    },
  };

  const opacity = isDragging ? 0.4 : 1;
  const cursor = isEditable ? 'text' : 'move';
  const disabledFields = editCardMutation.isLoading;

  return (
    <Card classes={{ root: styles.root }} ref={drag} style={{ opacity, cursor }}>
      <CardContent>
        <Typography variant="h5">{item.title}</Typography>
        <Typography variant="body2">{item.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleEdit}>
          Edit
        </Button>
        <Button size="small" onClick={handleRemoveCard}>
          Delete
        </Button>
      </CardActions>
      {disabledFields ? (
        <Loading />
      ) : (
        <Dialog
          fullWidth
          maxWidth={'xs'}
          open={isEditable}
          onClose={() => {
            if (disabledFields) {
              return;
            }

            handleCancelEdit();
          }}
          PaperProps={editCardModalProps}
        >
          <DialogTitle>Update card info</DialogTitle>
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
            <TextField
              required
              margin="dense"
              id="description"
              name="description"
              label="description"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Card>
  );
};
