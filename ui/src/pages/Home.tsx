import { BoardCard } from '../components/card/BoardCard';
import styles from './Home.module.scss';

const columns = [
  {
    id: 1,
    title: 'todo',
    card: [
      {
        id: 1,
        title: 'Title text',
        description: 'Description text',
      },
      {
        id: 2,
        title: 'Title text',
        description: 'Description text',
      },
    ],
  },
  { id: 2, title: 'in progress' },
  { id: 3, title: 'done' },
];

export const Home = () => {
  return (
    <div className={styles.root}>
      {columns.map((column) => (
        <div className={styles.column} key={column.id}>
          <div className={styles.title}>{column.title}</div>
          <div className={styles.content}>
            {column.card?.map((card) => (
              <BoardCard key={card.id} item={card} isDragging={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
