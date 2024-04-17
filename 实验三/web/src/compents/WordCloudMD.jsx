import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-wordcloud";
import { useQuery } from "@tanstack/react-query";
import { postQueryFn } from "../query/postQueryFn";
import { WORD_CLOUD } from "../constants/url";
export default function WordCloudMD() {
  const cloudRef = useRef(null);
  const { isSuccess, data, isFetching } = useQuery({
    queryKey: [WORD_CLOUD],
    queryFn: postQueryFn,
  });
  useEffect(() => {
    if (isSuccess) {
      const chart = echarts.init(cloudRef.current);
      var option = {
        tooltip: {},
        series: [
          {
            type: "wordCloud",
            gridSize: 2,
            sizeRange: [24, 100],
            rotationRange: [0, 0],
            shape: "circle",
            width: 800,
            height: 500,
            drawOutOfBound: false,
            maskImage: false,
            textStyle: {
              color: function () {
                return (
                  "rgb(" +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(",") +
                  ")"
                );
              },
            },
            data: data.data,
          },
        ],
      };

      chart.setOption(option);
    }
  }, [isSuccess]);
  return (
    <div>
      <Box sx={{ width: "100%", height: "500px" }} ref={cloudRef}></Box>
    </div>
  );
}
