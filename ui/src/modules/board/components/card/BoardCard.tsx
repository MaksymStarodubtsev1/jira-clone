import { FC, useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useMutation } from 'react-query';
import EasyEdit, { Types } from 'react-easy-edit';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';

import styles from './BoardCard.module.scss';
import {
  deleteCardById,
  editCardById,
  moveCardToColumnById,
} from '../../../../apis/Card';
import { Ticket } from '../../Board';
import { queryClient } from '../../../../core/http-client';

export const ItemTypes = {
  BOX: 'box',
};

export interface BoardCardProps {
  item: Ticket;
}

export const BoardCard: FC<BoardCardProps> = ({ item }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState<string>(item.title);
  const [description, setDescription] = useState<string>(item.description);

  const moveCardToColumnMutation = useMutation(moveCardToColumnById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const editCardMutation = useMutation(editCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const deleteCardMutation = useMutation(deleteCardById, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const handleEdit = () => setIsEditable(true);
  const handleCancelEdit = () => setIsEditable(false);

  const handleUpdateCard = () => {
    editCardMutation.mutate(
      {
        id: item.id,
        details: {
          title,
          description,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('board');
        },
      }
    );

    handleCancelEdit();
  };

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

  const opacity = isDragging ? 0.4 : 1;

  const buttonContent = useMemo(() => {
    if (isEditable) {
      return (
        <CardActions>
          <Button size="small" onClick={handleUpdateCard}>
            Save
          </Button>
          <Button size="small" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </CardActions>
      );
    } else {
      return (
        <CardActions>
          <Button size="small" onClick={handleEdit}>
            Edit
          </Button>
          <Button size="small" onClick={handleRemoveCard}>
            Delete
          </Button>
        </CardActions>
      );
    }
  }, [isEditable, title, description]);

  return (
    <Card classes={{ root: styles.root }} ref={drag} style={{ opacity }}>
      <CardActionArea>
        <CardContent>
          <EasyEdit
            allowEdit={isEditable}
            type={Types.TEXT}
            onSave={setTitle}
            value={title}
            cssClassPrefix={styles.easyEditInput}
            saveButtonLabel="Save"
            cancelButtonLabel="Cancel"
          />
          <EasyEdit
            allowEdit={isEditable}
            type={Types.TEXT}
            onSave={setDescription}
            value={description}
            cssClassPrefix={styles.easyEditInput}
            saveButtonLabel="Save"
            cancelButtonLabel="Cancel"
          />
        </CardContent>
        {buttonContent}
      </CardActionArea>
    </Card>
  );
};
