import { Cmd, Loop, liftState, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import { none, Option, some } from 'fp-ts/lib/Option';
import fakeData from './fake-datas.json';


export type State = {
  counter: number,
  pictures: Picture[],
  selectedPicture: Option<Picture>,
}

export const defaultState: State = {
  counter: 3,
  pictures: fakeData,
  selectedPicture: none,
}

type Increment = { type: 'INCREMENT' };
type Decrement = { type: 'DECREMENT' };
type FetchCatsRequest = { type: 'FETCH_CATS_REQUEST' };
type FetchCatsCommit = { type: 'FETCH_CATS_COMMIT'; pictures: Picture[] };
type FetchCatsRollback = { type: 'FETCH_CATS_ROLLBACK' };
type SelectPicture = { type: 'SELECT_PICTURE'; picture: Picture };
type CloseModal = { type: 'CLOSE_MODAL' };

type Actions =
  | Increment
  | Decrement
  | FetchCatsRequest
  | FetchCatsCommit
  | FetchCatsRollback
  | SelectPicture
  | CloseModal;

const increment = (): Increment => ({ type: 'INCREMENT' });
const decrement = (): Decrement => ({ type: 'DECREMENT' });
const fetchCatsRequest = (): FetchCatsRequest => ({ type: 'FETCH_CATS_REQUEST' });
const fetchCatsCommit = (pictures: Picture[]): FetchCatsCommit => ({ type: 'FETCH_CATS_COMMIT', pictures });
const fetchCatsRollback = (): FetchCatsRollback => ({ type: 'FETCH_CATS_ROLLBACK' });
export const selectPicture = (picture: Picture): SelectPicture => ({ type: 'SELECT_PICTURE', picture });
export const closeModal = (): CloseModal => ({ type: 'CLOSE_MODAL' });



const fetchPicturesFromAPI = async (counter: number): Promise<Picture[]> => {
  const API_KEY = 'u_uomcf891am';
  const response = await fetch(`https://pixabay.com/api/?key=${API_KEY}&per_page=${3}&q=cat`);
  const data = await response.json();
  
  return data.hits.map((hit: any) => ({
    previewFormat: hit.previewURL,
    webformatFormat: hit.webformatURL,
    author: hit.user,
    largeFormat: hit.largeImageURL,
  }));
};

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState;
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1};
    case 'DECREMENT':
      return { ...state, counter: Math.max(3, state.counter - 1) };
    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: action.pictures };
    case 'SELECT_PICTURE':
      return { ...state, selectedPicture: some(action.picture) };
    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: none };
    case 'FETCH_CATS_REQUEST':
      return loop(
        state,
        Cmd.run(fetchPicturesFromAPI, {
          args: [state.counter],
          successActionCreator: fetchCatsCommit,
          failActionCreator: fetchCatsRollback,
        })
      );
    
    case 'FETCH_CATS_ROLLBACK':
      return { ...state, pictures: [] };
  }
};

export const counterSelector = (state: State) => {
  return state.counter;
};
export const picturesSelector = (state: State) => {
  return state.pictures;
};
export const getSelectedPicture = (state: State) => {
  return state.selectedPicture;
};



export default compose(liftState, reducer);