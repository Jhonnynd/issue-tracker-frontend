import axios from "axios";

export const getAllProjects = async () => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_BACKEND_URL}/projects/`,
    };
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
