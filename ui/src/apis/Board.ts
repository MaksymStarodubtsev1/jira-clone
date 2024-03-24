import { getHTTPClient } from '../core/http-client';

const $http = getHTTPClient();

export const getBoard = (boardId?: string) => {
  return $http.get(`/board?id=${boardId}`);
};

export const createBoard = ({ title }: { title: string }) => {
  return $http.post(`/board`, { title });
};

export const updateBoard = ({ id, title }: { id: string; title: string }) => {
  return $http.patch(`/board/${id}`, { title });
};

export const getBoards = (searchString?: string) => {
  return $http.get(`/boards?title=${searchString}`);
};
