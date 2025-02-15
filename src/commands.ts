import { Cmd } from 'redux-loop';
import { FetchCatsRequest } from './types/actions.type';
import { Picture } from './types/picture.type';
import { fetchCatsCommit, fetchCatsRollback } from './actions';

const parseResponse = (response: Response): Promise<Picture[]> => {
  return response.json().then(data =>
    data.hits.map((hit: any) => ({
      previewFormat: hit.previewURL,
      webFormat: hit.webformatURL,
      author: hit.user,
      largeFormat: hit.largeImageURL,
    } as Picture))
  );
};

export const cmdFetch = (action: FetchCatsRequest) =>
  Cmd.run(
    () => {
      return fetch(action.path, {
        method: action.method,
      }).then(checkStatus)
        .then(parseResponse);
    },
    {
      successActionCreator: fetchCatsCommit, // (equals to (payload) => fetchCatsCommit(payload))
      failActionCreator: fetchCatsRollback, // (equals to (error) => fetchCatsCommit(error))
    },
  );

const checkStatus = (response: Response) => {
  if (response.ok) return response;
  throw new Error(response.statusText);
};
