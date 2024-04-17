import { Box, CircularProgress } from "@mui/material";
import React from "react";
export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "200px",
        gap: 2,
      }}
    >
      <CircularProgress color="primary" sx={{ width: 100 }} />
    </Box>
  );
}
