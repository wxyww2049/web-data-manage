import React, { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useQuery } from "@tanstack/react-query";
import { COUNT_COMPANY } from "../constants/url";
import { postQueryFn } from "../query/postQueryFn";

export default function CountCompany(props) {
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: [COUNT_COMPANY],
    queryFn: postQueryFn,
  });

  const barRef = useRef(null);
  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(barRef.current);
      myChart.setOption({
        title: {
          text: "公司热度",
        },
        tooltip: {},
        xAxis: {
          data: data.data.map((item) => item.name),
          axisLabel: {
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
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
