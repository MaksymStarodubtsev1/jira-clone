import { getHTTPClient } from '@core/http-client';
import { Ticket } from '@shared/types';

const $http = getHTTPClient();

interface newCard {
  title: string;
  description: string;
  columnId: string;
}

export interface EditCardProps extends Partial<Ticket> {
  id: string;
}

type CardsIdsList = Pick<Ticket, 'id'>[]

export interface ChangeCardsOrderByIdsProps {
  idsList: CardsIdsList;
  currentElement: Ticket;
  prevElement: Ticket;
  nextElement: Ticket;
}

export const createCardInColumn = (cardInfo: newCard) => {
  return $http.post(`/card`, cardInfo);
};

export const moveCardToColumnById = ({ columnId, cardId }: { [key: string]: string }) => {
  return $http.patch(`/card/${cardId}`, {
    columnId: columnId,
  });
};

export const editCardById = ({ id, ...details }: EditCardProps) => {
  return $http.patch(`/card/${id}`, details);
};

export const reorderCardsByIds = (details: ChangeCardsOrderByIdsProps) => {
  console.log('details', details)
  return $http.patch(`/card/reorder/ids`, details);
};

export const deleteCardById = (cardId: string) => {
  return $http.delete(`/card/${cardId}`);
};
