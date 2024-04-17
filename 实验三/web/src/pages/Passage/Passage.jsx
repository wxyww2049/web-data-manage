import React, { useEffect, useState } from "react";
import MyCard from "../../compents/MyCard";
import SearchField from "../../compents/SearchField";
import { Box, Pagination } from "@mui/material";
import { postQueryFn } from "../../query/postQueryFn";
import { useMutation } from "@tanstack/react-query";
import { INTEVIEWS } from "../../constants/url";
import Loading from "../../compents/loading";

export default function Passage() {
  const [keys, setKey] = React.useState("");
  const [passage, setPassage] = React.useState([]);
  const { isSuccess, data, mutate, isPending } = useMutation({
    mutationFn: postQueryFn,
  });
  const [page, setPage] = useState(1);
  const fetch = () => {
    if (keys === "") return;
    setPage(1);

    mutate({
      queryKey: [INTEVIEWS, { handle: keys }],
    });
  };
  useEffect(() => {
    if (isSuccess) {
      setPassage(data.data);
    }
  }, [isSuccess]);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <SearchField keys={keys} setKey={setKey} click={fetch} />
      </Box>
      {isPending && <Loading />}
      {isSuccess && !isPending && (
        <Box>
          {passage
            ?.slice((page - 1) * 10, Math.min(page * 10 - 1, passage.length))
            ?.map((item) => (
              <MyCard id={item.id} title={item.title} url={item.url} />
            ))}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Pagination
              color="primary"
              count={Math.ceil(passage.length / 10)}
              onChange={(e, v) => {
                setPage(v);
              }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
}
