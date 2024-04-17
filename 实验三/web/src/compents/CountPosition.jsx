import { Box, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { postQueryFn } from "../query/postQueryFn";
import { COUNT_POSITION } from "../constants/url";
import * as echarts from "echarts";
export default function CountPosition() {
  const pieRef = React.useRef(null);
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: [COUNT_POSITION],
    queryFn: postQueryFn,
  });
  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(pieRef.current);
      myChart.setOption({
        title: {
          text: "职位热度",
        },
        tooltip: {},
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            data: data.data.map((item) => {
              return {
                value: item.frequency,
                name: item.position,
              };
            }),
          },
        ],
      });
      return () => {
        myChart.dispose();
      };
    }
  }, [isSuccess]);
  return (
    <Paper
      sx={{
        width: "30%",
        maxWidth: "400px",
        minWidth: "300px",
        height: "250px",
        margin: 1,
        padding: 2,
        paddingRight: 0,
      }}
      elevation={3}
    >
      <Box ref={pieRef} sx={{ height: "250px" }}></Box>
    </Paper>
  );
}
