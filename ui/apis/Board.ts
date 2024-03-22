import {getHTTPClient} from '../core/http-client'

const $http = getHTTPClient();

export const getBoards = () => {
  return $http.get('/board?title=react');
};
