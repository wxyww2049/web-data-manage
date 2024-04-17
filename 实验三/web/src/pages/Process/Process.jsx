import { Box } from "@mui/material";
import React from "react";
import CountProcess from "../../compents/CountProcess";
import TypePosition from "../../compents/TypePosition";
import ProcessCompany from "../../compents/ProcessCompany";

export default function Process() {
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <CountProcess />
        <ProcessCompany />
      </Box>
      <TypePosition />
    </div>
  );
}
