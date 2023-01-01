import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const getAllJobs = async (search, token) => {
  let allJobs;
  try {
    if (token) {
      allJobs = await axios.get(`${SERVER_URL}/job?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      allJobs = await axios.get(`${SERVER_URL}/job?search=${search}`);
    }
    return allJobs;
  } catch (err) {
    return err;
  }
};

const getJob = async (param) => {
  try {
    const allJobs = await axios.get(`${SERVER_URL}/job/${param}`);
    return allJobs;
  } catch (err) {
    return err;
  }
};

const adminDeleteJob = async (param, token) => {
  try {
    const allJobs = await axios.delete(`${SERVER_URL}/admin/jobs/${param}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return allJobs;
  } catch (e) {
    return(e)
  }
};

const deleteJob = async (param,token) => {
  try {
    const allJobs = await axios.delete(`${SERVER_URL}/job/${param}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return allJobs;
  } catch (e) {
    return e
  }
}

const applyJob = async (param,token) => {
  try {
    const apply = await axios.post(`${SERVER_URL}/job/${param}/apply`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return apply;
  } catch (e) {
    return e
  }
}

const isApplied = async (param,token) => {
  try{
    const apply = await axios.get(`${SERVER_URL}/job/${param}/applied`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return apply;
  }
  catch(e){
    return e
  }
}

const createJob = async (data, token) => {
  try{
    const creatJob = await axios.post(`${SERVER_URL}/job`,data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return creatJob;

  }catch(err){
    return err
  }
}

const updateJob = async (id, data, token) => {
  try{
    const creatJob = await axios.put(`${SERVER_URL}/job/${id}`,data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return creatJob;

  }catch(err){
    return err
  }
}

export { getAllJobs, getJob, adminDeleteJob, deleteJob, applyJob, isApplied,createJob,updateJob };
