import {getHTTPClient} from '../core/http-client'

const $http = getHTTPClient();

export const getBoard = () => {
  return $http.get('/board?title=react');
};
