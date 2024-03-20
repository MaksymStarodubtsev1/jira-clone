import { Request, Response } from 'express';

import prisma from '../prisma/client.ts';

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Missing required field: title' });
    }

    const newBoard = await prisma.board.create({
      data: {
        title: 'My Board',
        columns: {
          create: [
            { title: 'TODO' },
            { title: 'IN_PROGRESS' },
            { title: 'DONE' },
          ],
        },
      },
    });

    res.status(200).json(newBoard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating board' });
  }
};
