import { FC } from 'react';
import { useDrag } from 'react-dnd';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import styles from './BoardCard.module.scss';
import { Ticket } from '../../pages/Home';

export const ItemTypes = {
  BOX: 'box',
};

export interface BoardCardProps {
  item: Ticket;
  setColumn: any;
}

export const BoardCard: FC<BoardCardProps> = ({ item, setColumn }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<Ticket>();
      if (item && dropResult) {
        setColumn((columnList) => {
          return columnList.map((column) => {
            if (column.id === dropResult.id) {
              return {...column, tickets: [
                ...column?.tickets, item
              ]}
            }

            return column
          })
        })
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <Card classes={{ root: styles.card }} ref={drag} style={{ opacity }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};
