import { Loop, Cmd, loop, liftState } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';

// Define the State type
export type State = {
  counter: number;
  pictures: string[];
  selectedPicture: string | null;
  loading: boolean;
  fetchError: string | null;
};

// Define the default state
export const defaultState: State = {
  counter: 0,
  pictures: [],
  selectedPicture: null,
  loading: false,
  fetchError: null,
};

// Action types
type Increment = { type: 'INCREMENT' };
type Decrement = { type: 'DECREMENT' };
type SelectPicture = { type: 'SELECT_PICTURE'; payload: string };
type CloseModal = { type: 'CLOSE_MODAL' };
type FetchCatsRequest = { type: 'FETCH_CATS_REQUEST' };
type FetchCatsCommit = { type: 'FETCH_CATS_COMMIT'; payload: string[] };
type FetchCatsRollback = { type: 'FETCH_CATS_ROLLBACK'; payload: string };

type Actions =
  | Increment
  | Decrement
  | SelectPicture
  | CloseModal
  | FetchCatsRequest
  | FetchCatsCommit
  | FetchCatsRollback;

// Action creators
export const increment = (): Increment => ({ type: 'INCREMENT' });
export const decrement = (): Decrement => ({ type: 'DECREMENT' });
export const selectPicture = (picture: string): SelectPicture => ({ type: 'SELECT_PICTURE', payload: picture });
export const closeModal = (): CloseModal => ({ type: 'CLOSE_MODAL' });
export const fetchCatsRequest = (): FetchCatsRequest => ({ type: 'FETCH_CATS_REQUEST' });
export const fetchCatsCommit = (pictures: string[]): FetchCatsCommit => ({ type: 'FETCH_CATS_COMMIT', payload: pictures });
export const fetchCatsRollback = (error: string): FetchCatsRollback => ({ type: 'FETCH_CATS_ROLLBACK', payload: error });

// Reducer implementation
export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState; // Mandatory by Redux

  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };

    case 'DECREMENT':
      return { ...state, counter: Math.max(0, state.counter - 1) }; // Ensure counter doesn't go below 0

    case 'SELECT_PICTURE':
      return { ...state, selectedPicture: action.payload };

    case 'CLOSE_MODAL':
      return { ...state, selectedPicture: null };

    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, loading: true },
        Cmd.run(fetchCatsApi, {
          successActionCreator: (pictures) => fetchCatsCommit(pictures),
          failActionCreator: (error: { message: string; }) => fetchCatsRollback(error.message),
        })
      );

    case 'FETCH_CATS_COMMIT':
      return { ...state, pictures: action.payload, loading: false, fetchError: null };

    case 'FETCH_CATS_ROLLBACK':
      return { ...state, loading: false, fetchError: action.payload };

    default:
      return state;
  }
};

// Selectors
export const counterSelector = (state: State) => state.counter;
export const picturesSelector = (state: State) => state.pictures;
export const getSelectedPicture = (state: State) => state.selectedPicture;

// Helper function to simulate API call (replace this with actual API logic)
const fetchCatsApi = async (): Promise<string[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(['cat1.jpg', 'cat2.jpg', 'cat3.jpg']), 1000)
  );
};

export default compose(liftState, reducer);
