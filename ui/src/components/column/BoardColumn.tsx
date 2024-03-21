import { FC } from 'react';
import { useDrop } from 'react-dnd';

import styles from './BoardColumn.module.scss';
import { BoardCard } from '../card/BoardCard';
import { Ticket } from '../../pages/Home';

export const ItemTypes = {
  BOX: 'box',
};

interface BoardColumnProps {
  column: {
    id: number;
    title: string;
    tickets?: Ticket[];
  };
  setColumn: any;
}

export const BoardColumn: FC<BoardColumnProps> = ({ column, setColumn }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: () => (column),
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

  return (
    <div className={styles.column} key={column.id} ref={drop} style={{ backgroundColor }}>
      <div className={styles.title}>{column.title}</div>
      <div className={styles.content}>
        {column.tickets?.map((ticket: Ticket) => (
          <BoardCard key={ticket.id} item={ticket} setColumn={setColumn}/>
        ))}
      </div>
    </div>
  );
};
