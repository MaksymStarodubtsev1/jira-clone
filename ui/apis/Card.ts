import { getHTTPClient } from '../core/http-client';

const $http = getHTTPClient();

interface updatedCard {
  id: string;
  details: { title: string; description: string };
}

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

export const editCardById = (card: updatedCard) => {
  return $http.patch(`/card/${card.id}`, card.details);
};

export const deleteCardById = (cardId: string) => {
  return $http.delete(`/card/${cardId}`);
};
