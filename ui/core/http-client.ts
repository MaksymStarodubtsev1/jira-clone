import {
  QueryClient,
  QueryKey,
  useMutation as useReactMutation,
  UseMutationOptions as UseReactMutationOptions,
  UseMutationResult as UseReactMutationResult,
  useQuery as useReactQuery,
  UseQueryOptions as UseReactQueryOptions,
  UseQueryResult as UseReactQueryResult,
} from 'react-query';

import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

import { getBaseUrl } from './base-url';

export const useQuery = <
  TQK extends QueryKey = QueryKey,
  TData = unknown,
  TError extends AxiosError = AxiosError,
  TQueryFnData = TData
>(
  options: UseReactQueryOptions<TQueryFnData, TError, TData, TQK>
): UseReactQueryResult<TData, TError> =>
  useReactQuery<TQueryFnData, TError, TData, TQK>(options);

export const getHTTPClient = (): AxiosInstance => {
  const instance = Axios.create();
  instance.defaults.baseURL = `${getBaseUrl()}`;

  return instance;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,

      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
