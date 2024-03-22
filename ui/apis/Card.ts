import { getHTTPClient } from '../core/http-client';

const $http = getHTTPClient();

interface newCard {
  title: string;
  description: string;
  columnId: string
}

interface updatedCardInfo {
  id: string;
  details: { title: string; description: string };
}

export const createCardInColumn = (cardInfo: newCard) => {
  return $http.post(`/card`, cardInfo);
};

export const moveCardToColumnById = ({
  columnId,
  cardId,
}: {
  [key: string]: string;
}) => {
  return $http.patch(`/card/${cardId}`, {
    columnId: columnId,
  });
};

export const editCardById = (card: updatedCardInfo) => {
  return $http.patch(`/card/${card.id}`, card.details);
};

export const deleteCardById = (cardId: string) => {
  return $http.delete(`/card/${cardId}`);
};
