import { apiConnector } from "./apiConnector";

export const apiPostData = async (url, data, withCredentials) => {
  return apiConnector("POST", url, data, withCredentials);
};
