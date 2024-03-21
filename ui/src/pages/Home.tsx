import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
              <Box draggble={true}>
                <Card classes={{ root: styles.card }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Share</Button>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
