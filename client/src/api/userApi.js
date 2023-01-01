import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Calling POST method of /auth/signup to create user
const createUser = async (data) => {
  try {
    const user = await axios.post(`${SERVER_URL}/auth/signup`, data);
    return user;
  } catch (err) {
    return err;
  }
};

const updateUser = async (data, token) => {
  try {
    const user = await axios.put(`${SERVER_URL}/user`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (err) {
    return err;
  }
};

const login = async (data) => {
  try {
    const user = await axios.post(`${SERVER_URL}/auth/login`, data);
    return user;
  } catch (err) {
    return err;
  }
};

const getAllUser = async (data) => {
  try {
    const jobs = await axios.get(`${SERVER_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${data}`,
      },
    });
    return jobs;
  } catch (err) {
    return err;
  }
};

const getUser = async (data) => {
  try {
    const jobs = await axios.get(`${SERVER_URL}/user`, {
      headers: {
        Authorization: `Bearer ${data}`,
      },
    });
    return jobs;
  } catch (err) {
    return err;
  }
};

const adminDeleteUser = async (token, id) => {
  try {
    const users = await axios.delete(`${SERVER_URL}/admin/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return users;
  } catch (err) {
    return err;
  }
};

const deleteUser = async (token, id) => {
  try {
    const users = await axios.delete(`${SERVER_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return users;
  } catch (err) {
    return err;
  }
};

export { createUser, login, getAllUser, getUser, adminDeleteUser, updateUser, deleteUser };
