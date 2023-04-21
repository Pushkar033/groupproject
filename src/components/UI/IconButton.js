import React from "react";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg"

const IconButton = (props) => {
  const iconPath = props.icon ==="edit"?editIcon:deleteIcon
  return (
    <button {...props}>
      <img alt="icon-button" src={iconPath} />
    </button>
  );
};

export default IconButton;
