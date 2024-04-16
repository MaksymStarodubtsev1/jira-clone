import { getHTTPClient } from '@core/http-client';

const $http = getHTTPClient();

export const createBoard = ({ title }: { title: string }) => {
  return $http.post(`/board`, { title });
};

export const getBoard = (boardId?: string) => {
  return $http.get(`/board/${boardId}`);
};

export const getBoards = (searchString?: string) => {
  return $http.get(`/board/findBySymbol/${searchString}`);
};

export const updateBoard = ({ id, title }: { id: string; title: string }) => {
  return $http.patch(`/board/${id}`, { title });
};

export const deleteBoard = (boardId?: string) => {
  return $http.delete(`/board/${boardId}`);
};
