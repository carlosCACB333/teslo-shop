import { Box, Button, ButtonGroup, InputLabel } from "@mui/material";
import React, { FC, useState } from "react";
interface Props {
  title?: string;
  editable?: boolean;
  value: number;
  max: number;
  onChangeCounter: (quanty: number) => void;
}
export const Counter: FC<Props> = ({
  title,
  editable = true,
  value = 1,
  onChangeCounter,
  max,
}) => {
  return (
    <>
      <InputLabel>{title}</InputLabel>
      <ButtonGroup variant="outlined" color="primary">
        <Button
          onClick={() => editable && value > 1 && onChangeCounter(value - 1)}
        >
          -1
        </Button>
        <Button>{value}</Button>
        <Button
          onClick={() => editable && value < max && onChangeCounter(value + 1)}
        >
          +1
        </Button>
      </ButtonGroup>
    </>
  );
};
