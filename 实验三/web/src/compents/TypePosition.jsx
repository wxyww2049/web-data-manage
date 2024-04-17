import React, { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  COUNT_COMPANY,
  COUNT_STACKS,
  STACKS_POSTION,
  TYPES_POSITION,
} from "../constants/url";
import { postQueryFn } from "../query/postQueryFn";
import MulSelect from "./MulSelect";

const stapositions = [
  "产品",
  "人工智能",
  "前端",
  "后端",
  "客户端",
  "测开",
  "硬件",
  "运营",
];
const stacktypes = ["一面", "二面", "三面", "四面", "HR面", "面委", "OC"];
export default function TypePosition(props) {
  const { isSuccess, data, mutate } = useMutation({
    mutationFn: postQueryFn,
  });
  const [stacks, setStacks] = React.useState(stacktypes);
  useEffect(() => {
    mutate({
      queryKey: [TYPES_POSITION, { types: stacks.join(",") }],
    });
  }, [stacks]);
  const barRef = useRef(null);

  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(barRef.current);
      const Data = stacktypes.map((item) => data.data[item]);
      /**
       * 自己都看不懂了，能跑对就行
       */
      const datas = [["stacks"]];
      stapositions.forEach((item, index) => {
        datas.push([item]);
      });
      Data.forEach((item, index) => {
        if (item === undefined) return;
        datas[0].push(stacktypes[index]);
        item.forEach((it, ind) => {
          datas[ind + 1].push(it.rate);
        });
      });
      myChart.setOption({
        title: {
          text: "分岗位进度分布",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
        },
        dataset: {
          source: datas,
        },
        xAxis: { type: "category" },
        tooltip: {},
        yAxis: {},
        series: datas[0].map((item, index) => {
          if (index !== 0) return { type: "bar" };
        }),
      });
      return () => {
        myChart.dispose();
      };
    }
  }, [isSuccess]);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ height: "400px", padding: 3, margin: 1 }} elevation={3}>
        <MulSelect
          names={stacktypes}
          val={stacks}
          setVal={setStacks}
          title="进度"
        />
        <Box ref={barRef} sx={{ height: "350px" }}></Box>
      </Paper>
    </Box>
  );
}
