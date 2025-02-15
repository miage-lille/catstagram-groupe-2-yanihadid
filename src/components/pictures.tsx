import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPicture, picturesSelector } from '../reducer';
import { closeModal, selectPicture } from '../actions';
import ModalPortal from './modal';
import { isSome } from 'fp-ts/Option';

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 1s;
  max-width: fit-content;
  &:hover {
    transform: scale(1.2);
  }
`;
const Pictures = () => {
  const pictures = useSelector(picturesSelector);
  const selectedPicture = useSelector(getSelectedPicture);
  const dispatch = useDispatch();

  return (
    <Container>
      {pictures.status === 'success' && pictures.data.map((picture, index) => (
        <Image
          key={index}
          src={picture.previewFormat}
          alt={`Picture ${index + 1}`}
          onClick={() => dispatch(selectPicture(picture))}
        />
      ))}
      {isSome(selectedPicture) && (
        <ModalPortal largeFormat={selectedPicture.value.largeFormat} close={() => dispatch(closeModal())} />
      )}
    </Container>
  );
};

export default Pictures;