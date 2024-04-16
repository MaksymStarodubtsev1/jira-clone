import type { Request, Response } from 'express';

import prisma from '../../prisma/client';

export const create = async (req: Request, res: Response) => {
  try {
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
    res.status(200).json({ error: 'Error creating board' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
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
    const deleteCards = prisma.card.deleteMany({
      where: { column: { boardId: { in: [req.params.id] } } },
    });

    const deleteColumns = prisma.column.deleteMany({
      where: {
        boardId: req.params.id,
      },
    });

    const deleteBoard = prisma.board.delete({
      where: {
        id: req.params.id,
      },
    });

    await prisma.$transaction([deleteCards, deleteColumns, deleteBoard]);

    res.status(200).json('Board successfully deleted');
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error board deleting' });
  }
};

export const getBoard = async (req: Request, res: Response) => {
  try {
    const board = await prisma.board.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        columns: {
          include: {
            cards: {
              orderBy: {
                order: 'asc',
              },
            }
          },
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

export const getBoardBySymbol = async (req: Request, res: Response) => {
  try {
    if (!req.params.symbol) {
      return res.status(400).json({ message: 'Missing required field: symbol' });
    }

    const board = await prisma.board.findMany({
      where: {
        title: {
          startsWith: req.params.symbol,
          mode: 'insensitive',
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
