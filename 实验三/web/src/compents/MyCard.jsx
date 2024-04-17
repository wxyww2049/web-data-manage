import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import { postQueryFn } from "../query/postQueryFn";
import Loading from "./loading";
import { useEffect } from "react";
import { AI_SUMMARY } from "../constants/url";
export default function MyCard(props) {
  const { id, title, url } = props;
  const [content, setContent] = React.useState(null);
  const [show, setShow] = React.useState(false);
  const { isSuccess, data, mutate, isPending } = useMutation({
    mutationFn: postQueryFn,
  });
  // useEffect(() => {
  //   console.log(id);
  // }, []);
  useEffect(() => {
    if (isSuccess) {
      setContent(data.data);
    }
  }, [isSuccess]);
  return (
    <Card sx={{ minWidth: 275, marginBottom: 3 }} elevation={3}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>

        <Typography variant="body2">
          <br />
          原文地址：{url}
        </Typography>
        {show && (
          <>
            <Typography variant="h5">
              <br />
              AI总结
            </Typography>
            {content !== null && <ReactMarkdown>{content}</ReactMarkdown>}
            {isPending && <Loading />}
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <a href={url} target="_blank">
          <Button variant="outlined">查看原文</Button>
        </a>
        {show && (
          <Button variant="outlined" onClick={() => setShow(false)}>
            关闭AI总结
          </Button>
        )}
        {!show && (
          <Button
            variant="outlined"
            onClick={() => {
              setShow(true);
              if (content === null) {
                mutate({
                  queryKey: [AI_SUMMARY, { id: id }],
                });
              }
            }}
          >
            查看AI总结
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
