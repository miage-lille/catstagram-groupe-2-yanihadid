import { Loop, liftState, Cmd, loop } from 'redux-loop';
import { compose } from 'redux';
import { Actions } from './types/actions.type';
import { Picture } from './types/picture.type';
import { Option, none, some } from 'fp-ts/Option';
import { ApiState } from './types/api.type';
import { loading, success, failure } from './api';
import { cmdFetch } from './commands';
import { fetchCatsRequest } from './actions';

export type State = {
  counter: number;
  pictures: ApiState;
  pictureSelected: Option<Picture>;
}

export const defaultState: State = {
  counter: 3,
  pictures: success([]),
  pictureSelected: none
};

export const reducer = (state: State | undefined, action: Actions): State | Loop<State> => {
  if (!state) return defaultState;
  
  switch (action.type) {
    case 'INCREMENT': {
      const newCounter = state.counter + 1;
      return loop(
        { ...state, counter: newCounter },
        Cmd.action(fetchCatsRequest(newCounter))
      );
    }

    case 'DECREMENT': {
      if (state.counter <= 3) return state;
      const newCounter = state.counter - 1;
      return loop(
        { ...state, counter: newCounter },
        Cmd.action(fetchCatsRequest(newCounter))
      );
    }

    case 'SELECT_PICTURE':
      return {
        ...state,
        pictureSelected: some(action.picture)
      };

    case 'CLOSE_MODAL':
      return {
        ...state,
        pictureSelected: none
      };

    case 'FETCH_CATS_REQUEST':
      return loop(
        { ...state, pictures: loading() },
        cmdFetch(action)
      );

    case 'FETCH_CATS_COMMIT':
      return {
        ...state,
        pictures: success(action.payload as Picture[])
      };

    case 'FETCH_CATS_ROLLBACK':
      return {
        ...state,
        pictures: failure(action.error.message)
      };
  }
};

export const counterSelector = (state: State): number => state.counter;
export const picturesSelector = (state: State): ApiState => state.pictures;
export const getSelectedPicture = (state: State): Option<Picture> => state.pictureSelected;

export default compose(liftState, reducer);