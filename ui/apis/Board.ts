import { getHTTPClient } from '../core/http-client';

const $http = getHTTPClient();

export const getBoard = (boardId: string) => {
  return $http.get(`/board?id=${boardId}`);
};

export const getBoards = (searchString?: string) => {
  if (searchString) {
    return $http.get(`/boards?title=${searchString}`);
  }
};
