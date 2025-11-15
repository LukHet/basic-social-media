export const apiConnector = async (
  method,
  url,
  data = {},
  withCredentials = false
) => {
  try {
    const config = {
      method,
      url: APIURL + url,
      withCredentials,
    };

    if (method === "GET") {
      config.params = data;
    } else {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
