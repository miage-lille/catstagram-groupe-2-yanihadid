import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { counterSelector, getSelectedPicture, picturesSelector, selectPicture, closeModal } from '../reducer';
import { Picture } from '../types/picture.type';
import ModalPortal from './modal';
import { Option, isSome } from 'fp-ts/Option'; // Import Option utilities

const Container = styled.div`
  padding: 1rem;
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  margin: 10px;
  object-fit: contain;
  transition: transform 0.3s ease-in-out;
  max-width: 150px;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

const Pictures = () => {
  const dispatch = useDispatch();
  const pictures = useSelector(picturesSelector); // Selector to get pictures
  const counter = useSelector(counterSelector); // Selector to get counter value
  const selectedPicture: Option<Picture> = useSelector(getSelectedPicture); // Selector to get selected picture

  const handleClickPicture = (pic: Picture) => {
    dispatch(selectPicture(pic)); // Dispatch action to select a picture
  };

  const handleCloseModal = () => {
    dispatch(closeModal()); // Dispatch action to close the modal
  };

  return (
    <>
      {/* Display the thumbnails */}
      <Container>
        {pictures.slice(0, counter).map((pic, index) => (
          <Image
            key={index}
            src={pic.previewFormat}
            alt={`Cat by ${pic.author}`}
            onClick={() => handleClickPicture(pic)}
          />
        ))}
      </Container>

      {/* Display the modal if a picture is selected */}
      {isSome(selectedPicture) && (
        <ModalPortal
          largeFormat={selectedPicture.value.largeFormat}
          author={selectedPicture.value.author}
          close={handleCloseModal}
        />
      )}
    </>
  );
};

export default Pictures;
