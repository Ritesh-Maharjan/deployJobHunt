import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useJwt } from "react-jwt";
import {
  adminDeleteJob,
  applyJob,
  deleteJob,
  getJob,
  isApplied,
} from "../api/jobApi";
import Loading from "../component/Loading";
import Popup from "../component/Popup";
import { togglePopup } from "../redux/slicer/popupSlice";

function Detail() {
  const params = useParams();
  const [job, setJob] = useState();
  const [roles, setRole] = useState();
  // const [popup, setPopup] = useState(false);

  const popup = useSelector((state) => state.popup.popup);
  const [errorMsg, setErrorMsg] = useState();
  const [apply, setApply] = useState();
  const navigate = useNavigate();
  const SERVER_URL = process.env.REACT_APP_IMAGE_URL;
  const token = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const { decodedToken } = useJwt(token);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async (id) => {
      const data = await getJob(id);
      setJob(data.data);
      setIsLoading(false);
    };
    const checkIfApplied = async (id, token) => {
      const success = await isApplied(id, token);
      setApply(success.data);
    };
    if (decodedToken) {
      setRole(decodedToken.roles);
      checkIfApplied(params.id, token);
    }
    fetchData(params.id);
  }, [params.id, decodedToken, token, apply]);

  const deletePopup = (e) => {
    e.preventDefault();
    dispatch(togglePopup(true));
  };

  const adminDeleteJobBtn = async () => {
    const resData = await adminDeleteJob(params.id, token);

    if (resData.data) {
      navigate("/");
      dispatch(togglePopup(false));
    } else {
      setErrorMsg(resData.response.data.msg);
      dispatch(togglePopup(false));
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  const deleteJobBtn = async () => {
    const resData = await deleteJob(params.id, token);

    if (resData.data) {
      navigate("/");
      dispatch(togglePopup(false));
    } else {
      setErrorMsg(resData.response.data.msg);
      dispatch(togglePopup(false));
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  const applyJobBtn = async () => {
    if (token) {
      await applyJob(params.id, token);
      setApply(true);
      alert("Applied to job successfully");
    } else {
      alert("Please login to apply");
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      {errorMsg && (
        <p className="text-red-400 font-black text-3xl flex justify-center my-2">
          Not Authorized, only can delete your own job
        </p>
      )}
      <div className="flex w-[90vw] m-auto">
        {popup &&
          (roles === "Admin" ? (
            <Popup
              text="Are you sure you want to delete the job?"
              actionFunc={adminDeleteJobBtn}
            />
          ) : (
            <Popup
              text="Are you sure you want to delete this job?"
              actionFunc={deleteJobBtn}
            />
          ))}
        {job && (
          <div className="flex flex-col md:flex-row items-center space-between border-2 m-2 p-2 rounded-2xl drop-shadow-lg text-xs md:text-base w-[450px] md:w-[600px]">
            <div className="flex flex-col items-center justify-center w-16 my-2 sm:min-w-[100px] md:min-h-[140px] xl:min-h-[320px]">
              {job?.createdBy?.avatar ? (
                <img
                  src={`${SERVER_URL}${job?.createdBy?.avatar}`}
                  alt="Company Logo"
                  className="bg-contain h-12 lg:h-24"
                />
              ) : (
                <img
                  src="https://imgs.search.brave.com/lQJ580-JievQJ14gi6KKJrwsK5Yln9K2ECOia6lOlBg/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5E/WkxXRnFZcUlHNGxf/eUphcU91SlhnSGFI/YSZwaWQ9QXBp"
                  alt="Company Logo"
                  className="bg-contain h-12 lg:h-24"
                />
              )}
              <h1 className="text-3xl mt-3">{job?.createdBy?.name}</h1>
            </div>
            <div className="ml-4 w-full">
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Title: </span>
                {job?.jobTitle}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Vacancies:</span>
                {job?.vacancies}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Category:</span>
                {job?.jobCategory}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Salary:</span>
                {job?.salary}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Deadline:</span>
                {job?.deadline.split("T")[0]}
              </h2>
              {job?.experience && (
                <h2 className="flex items-center">
                  <span className="mr-3 w-16 md:w-32 font-black">
                    Experience:
                  </span>
                  {job?.experience}
                </h2>
              )}
              <h2 className="flex items-center">
                <span className="mr-3 w-16 md:w-32 font-black">Education:</span>
                {job?.education}
              </h2>
              {roles === "Admin" ? (
                <>
                  <button
                    className="border-2 px-3 py-1 my-2 bg-red-500 hover:text-white hover:bg-black"
                    onClick={(e) => deletePopup(e)}
                  >
                    Delete Job
                  </button>
                </>
              ) : roles === "Company" ? (
                <div className="">
                  <Link to={`/update/${job._id}`}>
                    <button className="border-2 px-3 py-1 my-2  hover:text-white hover:bg-black">
                      Update Job
                    </button>
                  </Link>
                  <button
                    className="border-2 px-3 py-1 my-2 bg-red-500 ml-3 hover:text-white hover:bg-black"
                    onClick={(e) => deletePopup(e)}
                  >
                    Delete Job
                  </button>
                </div>
              ) : apply ? (
                <button className="border-2 px-3 py-1 my-2 bg-red-600" disabled>
                  Already applied
                </button>
              ) : (
                <button
                  className="border-2 px-3 py-1 my-2 hover:text-white hover:bg-black"
                  onClick={applyJobBtn}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detail;
