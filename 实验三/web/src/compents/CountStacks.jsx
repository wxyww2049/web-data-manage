import React, { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { COUNT_COMPANY, COUNT_STACKS } from "../constants/url";
import { postQueryFn } from "../query/postQueryFn";

export default function CountStacks(props) {
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: [COUNT_STACKS],
    queryFn: postQueryFn,
  });

  const barRef = useRef(null);
  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(barRef.current);
      myChart.setOption({
        title: {
          text: "技术栈热度",
        },
        tooltip: {},
        xAxis: {
          data: data.data.map((item) => item.name),
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: data.data.map((item) => item.frequency),
          },
        ],
      });
      return () => {
        myChart.dispose();
      };
    }
  }, [isSuccess]);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ height: "400px", padding: 3, margin: 1 }} elevation={3}>
        <Box ref={barRef} sx={{ height: "350px" }}></Box>
      </Paper>
    </Box>
  );
}
