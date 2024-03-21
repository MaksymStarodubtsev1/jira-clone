import { FC } from 'react';
import { useDrag } from 'react-dnd';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import styles from './BoardCard.module.scss';

interface Card {
  item: { id: number; title: string; description: string };
  isDragging: boolean;
}

export const BoardCard: FC<Card> = ({ item, isDragging }) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'string',
      item: item,
      collect: (monitor: any) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );
  return (
    <div ref={dragRef} style={{ opacity }}>
      <Card classes={{ root: styles.card }}>
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
    </div>
  );
};
