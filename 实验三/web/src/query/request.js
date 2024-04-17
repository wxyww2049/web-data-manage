import axios from "axios";
export const request = async (params) => {
  let response = await new Promise((res, rej) => {
    axios
      .request({
        ...params,
        headers: {
          "Access-Control-Allow-Origin": "*",
          ...params.headers,
        },
      })
      .then((resp) => {
        res(resp);
      })
      .catch((err) => {
        rej(err);
      });
  });

  return response;
};
