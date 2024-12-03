import React from 'react';
import { useParams } from 'react-router-dom';

const ShowImage = () => {
  const { id, type } = useParams();
  const imageUrl = `https://wheelsongo-backend.onrender.com/verification/${id}/${type}`;

  return (
    <div className="show-image-page">
      <img src={imageUrl} alt={`${type} Image`} />
    </div>
  );
};

export default ShowImage;
