import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Counter from './counter';
import Pictures from './pictures';

const App = () => (
  <Provider store={store}>
    <>
      <h2>Catstagram !</h2>
      <Counter />
      <Pictures />
    </>
  </Provider>
);

export default App;
