import { Box, MenuItem, Paper, Select } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { postQueryFn } from "../query/postQueryFn";
import { COUNT_PROCESS, TYPES_COMPANY } from "../constants/url";
import * as echarts from "echarts";

const companies = [
  "腾讯",
  "美团",
  "华为",
  "百度",
  "快手",
  "阿里",
  "京东",
  "得物",
  "小米",
  "星云",
  "携程",
  "海康",
  "网易",
  "字节跳动",
  "蔚来",
  "威视",
  "深信服",
  "淘天",
  "荣耀",
  "小红书",
  "金山",
  "大华",
  "美的",
  "用友",
  "蚂蚁",
  "顺丰",
  "诺瓦",
  "宁德时代",
  "大疆",
  "途虎",
  "oppo",
  "哔哩哔哩",
  "米哈游",
  "58同城",
  "TCL",
  "电信",
  "饿了么",
  "平安银行",
  "商汤",
];

export default function ProcessCompany() {
  const pieRef = React.useRef(null);
  const [company, setCompany] = React.useState(companies[0]);
  const { isSuccess, data, mutate } = useMutation({
    mutationFn: postQueryFn,
  });
  useEffect(() => {
    mutate({
      queryKey: [TYPES_COMPANY, { company_name: company }],
    });
  }, [company]);
  useEffect(() => {
    if (isSuccess) {
      const myChart = echarts.init(pieRef.current);
      myChart.setOption({
        title: {
          text: `${company}面试进度`,
        },
        tooltip: {},
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            data: data.data.map((item) => {
              return {
                value: item.rate,
                name: item.type,
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
    <>
      <Box>
        <Select
          value={company}
          label="公司"
          sx={{ width: "150px" }}
          onChange={(e) => {
            setCompany(e.target.value);
          }}
        >
          {companies.map((item) => {
            return (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
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
    </>
  );
}
