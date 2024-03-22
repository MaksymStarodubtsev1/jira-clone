import { getHTTPClient } from '../core/http-client';

const $http = getHTTPClient();

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
