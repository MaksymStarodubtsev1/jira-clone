import { Request, Response } from 'express';

import prisma from '../prisma/client';

export const create = async (req: Request, res: Response) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.columnId) {
      return res.status(400).json({
        message: 'Missing required field: title, description, columnId',
      });
    }

    const newCard = await prisma.card.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        column: { connect: { id: req.body.columnId } },
      },
    });

    res.status(200).json(newCard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating card' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({
        message: 'Missing required field: cardId',
      });
    }

    const updatedCard = await prisma.card.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.columnId && {
          column: { connect: { id: req.body.columnId } },
        }),
      },
    });

    res.status(200).json(updatedCard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating board' });
  }
};
