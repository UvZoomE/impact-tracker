import { RuxIcon } from "@astrouxds/react";
import React from "react";
import "./css/StarRating.css";

const StarRating = ({ rating, setRating }) => {
  const handleStarClick = (index) => {
    setRating(index + 1); // 1-based rating
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <RuxIcon
          key={index}
          icon="star"
          size="small"
          onClick={() => handleStarClick(index)}
          className={index < Math.round(rating) ? "filled-star" : "unfilled-star"}
        />
      ))}
    </div>
  );
}

export default StarRating;
