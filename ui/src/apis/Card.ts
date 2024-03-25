import { getHTTPClient } from '../core/http-client';
import { Ticket } from '../shared/types';

const $http = getHTTPClient();

interface newCard {
  title: string;
  description: string;
  columnId: string;
}

export const createCardInColumn = (cardInfo: newCard) => {
  return $http.post(`/card`, cardInfo);
};

export const moveCardToColumnById = ({ columnId, cardId }: { [key: string]: string }) => {
  return $http.patch(`/card/${cardId}`, {
    columnId: columnId,
  });
};

export const editCardById = ({ id, ...details }: Ticket) => {
  return $http.patch(`/card/${id}`, details);
};

export const deleteCardById = (cardId: string) => {
  return $http.delete(`/card/${cardId}`);
};
