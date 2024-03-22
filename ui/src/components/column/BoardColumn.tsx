import { FC, useState } from 'react';
import { useDrop } from 'react-dnd';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import styles from './BoardColumn.module.scss';
import { BoardCard } from '../card/BoardCard';
import { Ticket } from '../../pages/Home';
import { queryClient } from '../../../core/http-client';
import { useMutation } from 'react-query';
import { createCardInColumn } from '../../../apis/Card';

export const ItemTypes = {
  BOX: 'box',
};

interface BoardColumnProps {
  column: {
    id: string;
    title: string;
    cards?: Ticket[];
  };
  canAddTicket: boolean;
}

export const BoardColumn: FC<BoardColumnProps> = ({ column, canAddTicket }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: () => column,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleChangeCreateModalVisibility = (open: boolean) => {
    setIsCreateModalOpen(open);
  };

  const deleteCardMutation = useMutation(createCardInColumn, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const handleCreateCard = ({
    title,
    description,
  }: {
    [key: string]: string;
  }) => {
    deleteCardMutation.mutate({
      columnId: column.id,
      title,
      description,
    });
    handleChangeCreateModalVisibility(false);
  };

  const isActive = canDrop && isOver;
  let backgroundColor = '#ccc';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  const createCardModalProps = {
    component: 'form',
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const title = formJson.title;
      const description = formJson.description;

      handleCreateCard({
        title,
        description,
      });
    },
  };

  return (
    <div
      className={styles.column}
      key={column.id}
      ref={drop}
      style={{ backgroundColor }}
    >
      <div className={styles.title}>{column.title}</div>
      <div className={styles.content}>
        {column.cards?.map((ticket: Ticket) => (
          <BoardCard key={ticket.id} item={ticket} />
        ))}
        {canAddTicket && (
          <Button
            variant="outlined"
            onClick={() => handleChangeCreateModalVisibility(true)}
          >
            Add new ticket
          </Button>
        )}
      </div>
      <Dialog
        open={isCreateModalOpen}
        onClose={() => handleChangeCreateModalVisibility(false)}
        PaperProps={createCardModalProps}
      >
        <DialogTitle>Create new ticket</DialogTitle>
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
          <Button onClick={() => handleChangeCreateModalVisibility(false)}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
