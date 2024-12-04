import React from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const ShowImage = () => {
  const { id, type } = useParams();
  const imageUrl = `${BASE_URL}/verification/${id}/${type}`;

  return (
    <div className="show-image-page">
      <img src={imageUrl} alt={`${type} Image`} />
    </div>
  );
};

export default ShowImage;
