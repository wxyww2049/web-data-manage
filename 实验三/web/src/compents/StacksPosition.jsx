import React, { useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import * as echarts from "echarts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { COUNT_COMPANY, COUNT_STACKS, STACKS_POSTION } from "../constants/url";
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
export default function StacksPosition(props) {
  const { isSuccess, data, mutate } = useMutation({
    mutationFn: postQueryFn,
  });
  const [stacks, setStacks] = React.useState([
    "数据库",
    "计算机网络",
    "计算机语言",
    "操作系统",
    "其他",
  ]);
  useEffect(() => {
    mutate({
      queryKey: [STACKS_POSTION, { position: stacks.join(",") }],
    });
  }, [stacks]);
  const barRef = useRef(null);

  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(barRef.current);
      const sqlData = data.data["数据库"];
      const netData = data.data["计算机网络"];
      const lanData = data.data["计算机语言"];
      const osData = data.data["操作系统"];
      const elseData = data.data["其他"];
      const datas = [["stacks"]];
      stapositions.forEach((item, index) => {
        datas.push([item]);
      });

      if (sqlData !== undefined) {
        datas[0].push("数据库");
        sqlData.forEach((item, index) => {
          datas[index + 1].push(item.frequency);
        });
      }
      if (netData !== undefined) {
        datas[0].push("计算机网络");
        netData.forEach((item, index) => {
          datas[index + 1].push(item.frequency);
        });
      }
      if (lanData !== undefined) {
        datas[0].push("计算机语言");
        lanData.forEach((item, index) => {
          datas[index + 1].push(item.frequency);
        });
      }
      if (osData !== undefined) {
        datas[0].push("操作系统");
        osData.forEach((item, index) => {
          datas[index + 1].push(item.frequency);
        });
      }
      if (elseData !== undefined) {
        datas[0].push("其他");
        elseData.forEach((item, index) => {
          datas[index + 1].push(item.frequency);
        });
      }

      // return;
      myChart.setOption({
        title: {
          text: "分岗位技术栈热度",
        },
        legend: {
          // Try 'horizontal'
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
          names={["数据库", "计算机网络", "计算机语言", "操作系统", "其他"]}
          val={stacks}
          setVal={setStacks}
          title="技术栈"
        />
        <Box ref={barRef} sx={{ height: "350px" }}></Box>
      </Paper>
    </Box>
  );
}
