import { useEffect, useState } from 'react';
import { BoardColumn } from '../components/column/BoardColumn';
import styles from './Home.module.scss';

const columns = [
  {
    id: 1,
    title: 'todo',
    tickets: [
      {
        id: 11,
        title: 'Title text',
        description: 'Description text',
      },
      {
        id: 12,
        title: 'Title text',
        description: 'Description text',
      },
    ],
  },
  { id: 2, title: 'in progress',  tickets: []},
  { id: 3, title: 'done',  tickets: [] },
];

export interface Ticket {
  id: number;
  title: string;
  description: string;
}

export const Home = () => {
  const [columnList, setColumnList] = useState<any>(columns)

  return (
    <div className={styles.root}>
      {columnList?.map((column) => (
        <BoardColumn column={column} setColumn={setColumnList}></BoardColumn>
      ))}
    </div>
  );
};
