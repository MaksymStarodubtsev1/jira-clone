import { Request, Response } from 'express';

import prisma from '../prisma/client';

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Missing required field: title' });
    }

    const newBoard = await prisma.board.create({
      data: {
        title: req.body.title,
        columns: {
          create: [
            { title: 'TODO' },
            { title: 'IN_PROGRESS' },
            { title: 'DONE' },
          ],
        },
      },
      include: { columns: true },
    });

    res.status(200).json(newBoard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating board' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!req.params.id || !req.body.title) {
      return res.status(400).json({ message: 'Missing required field: title' });
    }

    const updatedBoard = await prisma.board.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
      },
    });

    res.status(200).json(updatedBoard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating board' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Missing required field: id' });
    }

    await prisma.column.deleteMany({
      where: {
        boardId: req.params.id,
      },
    });

    await prisma.board.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json('Board successfully deleted');
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error board deleting' });
  }
};

export const searchOne = async (req: Request, res: Response) => {
  try {
    if (!req.query.title) {
      return res.status(400).json({ message: 'Missing required field: title' });
    }

    const board = await prisma.board.findFirst({
      where: {
        title: req.query.title.toString(),
      },
      include: {
        columns: {
          include: { cards: true },
        },
      },
    });

    if (board) {
      res.status(200).json(board);
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error appear, no info found' });
  }
};
