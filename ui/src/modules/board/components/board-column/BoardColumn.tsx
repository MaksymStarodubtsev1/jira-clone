import { FC, useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper'

import { Button, DialogTitle, DialogContent, DialogActions, Dialog, TextField, PaperProps } from '@mui/material';
import { queryClient } from '@core/http-client';
import { createCardInColumn } from '@apis/Card';
import type { Column } from '@shared/types';
import { ItemTypes } from '@shared/constans';

import styles from './BoardColumn.module.scss';
import { BoardCard } from '../board-card/BoardCard';
import {Ticket} from "@shared/types";

interface BoardColumnProps {
  column: Column;
  canAddTicket?: boolean;
}

export const BoardColumn: FC<BoardColumnProps> = ({ column, canAddTicket = true }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const deleteCardMutation = useMutation(createCardInColumn, {
    onSuccess: () => {
      queryClient.invalidateQueries('board');
    },
  });

  const handleCreateCard = ({ title, description }: { [key: string]: string }) => {
    deleteCardMutation.mutate({
      columnId: column.id,
      title,
      description,
    });

    setIsCreateModalOpen(false);
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: () => column,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = '#ccc';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  const paperProps: PaperProps = {
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget as unknown as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries());
      const title = formJson.title as string;
      const description = formJson.description as string;

      handleCreateCard({
        title,
        description,
      });
    },
  };

  const [cards, setCards] = useState(column.cards)

  useEffect(() => {
    setCards(column.cards)
  }, [column.cards])

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
    )
  }, [])

  const renderCard = useCallback(
      (card: Ticket, index: number) => {
        return (
            <BoardCard
                key={card.id}
                item={card}
                index={index}
                id={card.id}
                moveCard={moveCard}
            />
        )
      },
      [],
  )

  return (
    <div className={styles.root} key={column.id} ref={drop} style={{ backgroundColor }}>
      <div className={styles.title}>{column.title}</div>
      <div className={styles.content}>
        {cards?.map((card, i) => renderCard(card, i))}
        {canAddTicket && (
          <Button variant="outlined" onClick={() => setIsCreateModalOpen(true)}>
            Add new ticket
          </Button>
        )}
      </div>
      <Dialog open={isCreateModalOpen} PaperProps={paperProps} onClose={() => setIsCreateModalOpen(false)}>
        <DialogTitle>Create new ticket</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            id="title"
            name="title"
            label="title"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            id="description"
            name="description"
            margin="dense"
            label="description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
