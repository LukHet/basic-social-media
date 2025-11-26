import { apiConnector } from "./apiConnector";

export const apiGetData = async (url, data, withCredentials) => {
  return apiConnector("GET", url, data, withCredentials);
};
