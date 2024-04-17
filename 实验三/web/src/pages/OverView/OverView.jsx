import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { postQueryFn } from "../../query/postQueryFn";
import { COUNT_COMPANY } from "../../constants/url";
import CountCompany from "../../compents/CountCompany";
import { Box } from "@mui/material";
import CountPosition from "../../compents/CountPosition";
import CountProcess from "../../compents/CountProcess";
import CountBigStack from "../../compents/CountBigStack";

export default function OverView() {
  return (
    <div style={{ width: "100%" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <CountPosition />
        <CountProcess />
        <CountBigStack />
      </Box>
      <CountCompany />
    </div>
  );
}
