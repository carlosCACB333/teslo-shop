import { Button, ButtonGroup, InputLabel } from "@mui/material";
import React, { FC } from "react";
import { ISize } from "../../interfaces";
import { useState } from "react";

interface Props {
  selected?: ISize;
  sizes: ISize[];
  title?: string;
  onChangeSize: (s: ISize) => void;
}
export const SizeSelector: FC<Props> = ({
  selected,
  sizes,
  title,
  onChangeSize,
}) => {
  return (
    <>
      <InputLabel>{title}</InputLabel>
      <ButtonGroup variant="outlined">
        {sizes.map((s) => (
          <Button
            key={s}
            variant={selected === s ? "contained" : "outlined"}
            onClick={() => onChangeSize(s)}
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
};
