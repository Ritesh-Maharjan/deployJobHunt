import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminDeleteUser, getAllUser } from "../api/userApi";
import Loading from "../component/Loading";
import Popup from "../component/Popup";
import { togglePopup } from "../redux/slicer/popupSlice";

function Users() {
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState();
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.user);
  const popup = useSelector((state) => state.popup.popup);
  const dispatch = useDispatch();
  const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const resData = await getAllUser(token);
      setIsLoading(false);
      if (resData?.response?.status === 403) {
        navigate("/forbidden");
      } else {
        navigate("/users");
        setUsers(resData.data);
      }
    };
    fetchData();
  }, [token, popup, navigate]);

  const removeUser = async () => {
    const resData = await adminDeleteUser(token, deleteId);
    if (resData.data) {
      dispatch(togglePopup(false));
    }
  };

  return (
    <div>
      <div className="flex flex-col w-[90vw] m-auto items-center ">
        {popup && (
          <Popup
            text="Are you sure you want to delete this user?"
            actionFunc={removeUser}
          />
        )}
        {isLoading ? (
          <Loading />
        ) : users?.length < 1 ? (
          <div className="flex justify-center items-center h-[90vh]">
            <h1 className="text-3xl font-black">No Users found</h1>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 w-full">
            {users?.map((el) => {
              return (
                <div
                  key={el._id}
                  className=" flex items-center space-between border-2 m-2 p-2 rounded-2xl drop-shadow-lg hover:border-red-400"
                >
                  <div className="flex flex-col justify-center items-center px-2 mr-6 w-[20vw]">
                    {el?.avatar ? (
                      <img
                        src={`${IMAGE_URL}${el?.avatar}`}
                        alt="Company logo"
                        className=""
                      />
                    ) : (
                      <img
                        src="https://imgs.search.brave.com/lQJ580-JievQJ14gi6KKJrwsK5Yln9K2ECOia6lOlBg/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5E/WkxXRnFZcUlHNGxf/eUphcU91SlhnSGFI/YSZwaWQ9QXBp"
                        alt="Company logo"
                      />
                    )}
                  </div>
                  <div className="text-xs lg:text-lg ml-4 w-full">
                    <h2 className="flex items-center">
                      <span className="mr-3 w-32">Name: </span>
                      {el?.name}
                    </h2>
                    <h2 className="flex items-center">
                      <span className="mr-3 w-32">Email: </span>
                      {el?.email}
                    </h2>
                    <h2 className="flex items-center">
                      <span className="mr-3 w-32">Phone:</span> {el?.phone}
                    </h2>
                    <h2 className="flex items-center">
                      <span className="mr-3 w-32">Roles:</span>
                      {el?.roles}
                    </h2>
                    <button
                      className="border-2 px-2 py-1 mt-5 bg-red-600"
                      onClick={() => {
                        setDeleteId(el?._id);
                        dispatch(togglePopup(true));
                      }}
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
