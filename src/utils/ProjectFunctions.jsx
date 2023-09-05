import axios from "axios";

export const getAllProjects = async (token) => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/projects/`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
