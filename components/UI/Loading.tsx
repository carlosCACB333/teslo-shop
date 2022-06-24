import { Grid, Skeleton } from "@mui/material";
import React from "react";

export const Loading = () => {
  return (
    <>
      <Skeleton width={300} />
      <Skeleton width={250} />
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((_, idx) => (
          <Grid item xs={6} sm={4} key={idx}>
            <Sklton />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

const Sklton = () => {
  return (
    <>
      <Skeleton variant="rectangular" height="35vh" />
      <Skeleton />
      <Skeleton />
    </>
  );
};
