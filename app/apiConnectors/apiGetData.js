import { apiConnector } from "./apiConnector";

export const apiGetData = async (url, data, withCredentials) => {
  apiConnector("GET", url, data, withCredentials);
};
