import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;


const getAllApplicaitons = async (token) => {
  try{

    const getAllApp = await axios.get(
      `${SERVER_URL}/job/applications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return getAllApp;

  }catch(err){
    return err
  }
}

const deleteApplication = async (token) => {
  try {
    const deleteApp = await axios.delete(
      `${SERVER_URL}/job/deleteapplication`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return deleteApp;
  } catch (err) {
    return err;
  }
};

export { deleteApplication, getAllApplicaitons };
