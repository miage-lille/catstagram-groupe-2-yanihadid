import styled from 'styled-components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { counterSelector } from '../reducer';
import { decrement, increment } from '../actions';

const Container = styled.div`
  padding: 16px;
  justify-content: center;
  display: flex;
`;

const Button = styled.button`
  padding: 16px 32px;
  background-color: indigo;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;

  &:hover {
    background-color: #3c0068;
  }
  &:focus {
    background-color: #5e00a3;
  }
  &:disabled {
    background-color: #808080;
  }
`;

const DisplayCounter = styled.span`
  padding: 16px 32px;
  margin-top: 8px;
  color: darkgrey;
`;

const Counter = () => {
  const counter = useSelector(counterSelector);
  const dispatch = useDispatch();
  return (
    <Container>
      <Button onClick={() => dispatch(decrement())}> - </Button>
      <DisplayCounter>{counter}</DisplayCounter>
      <Button onClick={() => dispatch(increment())}> + </Button>
    </Container>
  );
};

export default Counter;
