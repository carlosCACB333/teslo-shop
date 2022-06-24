import { ShowChart } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, SvgIconTypeMap, Typography } from "@mui/material";
import React, { FC } from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface Props {
  title: string;
  value: number | string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}
export const StatCard: FC<Props> = ({ title, value, Icon }) => {
  return (
    <Grid item sm={12} md={4} lg={3} width="100%">
      <Card>
        <CardContent>
          <Typography variant="button">{title}</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={1}>
              <ShowChart color="primary" />
              <Typography>+45%</Typography>
            </Box>
            {<Icon color="primary" sx={{ fontSize: 60 }} />}
          </Box>
          <Typography variant="h4">{value}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
