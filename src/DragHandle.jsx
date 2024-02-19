import React from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";

const HandleWrapper = styled.div`
  height: 1rem;
  vertical-align: bottom;
  display: inline-block;
  margin-right: 0.5rem;
  svg {
    width: 100%;
    height: 100%;
  }
  cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
`;

export const DragHandle = (props) => {
  return (
    <HandleWrapper {...props}>
      <FontAwesomeIcon icon={faArrowsUpDownLeftRight} size="sm" />
    </HandleWrapper>
  );
};
