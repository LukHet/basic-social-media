import { apiConnector } from "./apiConnector";

export const apiPostData = async (url, data, withCredentials) => {
  apiConnector("POST", url, data, withCredentials);
};
