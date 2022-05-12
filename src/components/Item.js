import React from "react";
import "./Item.css";
const Item = ({ props }) => {
  const { image, id, name, description } = props;
  return (
    <div className="item">
      <img src={image} className="item-image"></img>
      <p className="name">{name}</p>
      <p className="desc">{description}</p>
      <p className="id">#{id}</p>
    </div>
  );
};
export default Item;
