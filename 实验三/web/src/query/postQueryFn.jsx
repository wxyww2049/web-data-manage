import { request } from "./request";

export const postQueryFn = async (param) => {
  param = param?.queryKey;
  const { data } = await request({
    url: param[0],
    method: "get",
    params: param[1] ?? {},
  });

  // console.log(param);
  return {
    data,
  };
};
