import { Request, Response } from 'express';

import prisma from '../prisma/client';

export default async (req: Request, res: Response, next: any) => {
  try {
    const title = req.body.title;

    const existingBoard = await prisma.board.findFirst({
      where: { title },
    });

    if (existingBoard) {
      res.status(500).json({
        message: 'Board with the same title already exists',
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500);
  }
};
