import type { Request, Response } from 'express';

import prisma from '../../prisma/client';

export const create = async (req: Request, res: Response) => {
  try {
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
    const updatedCard = await prisma.card.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.order && { order: req.body.order }),
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

export const reorder = async (req: Request, res: Response) => {
  let currentElOrder;
  const prevEl = req.body.prevElement;
  const nextEl = req.body.nextElement;
  const newOrder = req.body.idsList;

  if (!prevEl) {
    currentElOrder = nextEl.order - 512;
  } else if (!nextEl) {
    currentElOrder = prevEl.order + 512;
  } else {
    currentElOrder = Math.floor((prevEl.order + nextEl.order) / 2);
  }

  const needToSetNewListOrder = Math.abs(currentElOrder - prevEl?.order) <= 1
  || Math.abs(currentElOrder - nextEl?.order) <= 1

  if (!newOrder?.length && needToSetNewListOrder) {
    return res.status(400).send('Missing required parameter: idsList');
  }

  try {
    const currEl = req.body.currentElement;
    if (!currEl?.id) {
      return res.status(400).json('Missing required parameter: order');
    }

    if (needToSetNewListOrder) {
      const updateCardList = newOrder.map(({id}: { id: string}, idx: number) => {
        return prisma.card.update({
          where: { id },
          data: { order: idx * 512 }
        })
      })

      const updatedCards = await prisma.$transaction(updateCardList)

      res.status(200).json(updatedCards);
    } else {
      const updatedCard = await prisma.card.update({
        where: { id: currEl.id },
        data: { order: currentElOrder }
      })

      res.status(200).json(updatedCard);
    }

  } catch (err) {
    console.log(err);
    res.status(200).json({ message: 'Error editing column order' });
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    await prisma.card.delete({
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
