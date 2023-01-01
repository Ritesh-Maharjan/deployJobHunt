import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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

function Detail() {
  const params = useParams();
  const [job, setJob] = useState();
  const [roles, setRole] = useState();
  const [popup, setPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [apply, setApply] = useState();
  const navigate = useNavigate();
  const SERVER_URL = process.env.REACT_APP_IMAGE_URL;
  const token = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState();
  const { decodedToken } = useJwt(token);

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

  const adminDeleteJobBtn = async () => {
    const success = await adminDeleteJob(params.id, token);

    if (success.data) {
      navigate("/");
    }
  };

  const deleteJobBtn = async () => {
    const success = await deleteJob(params.id, token);

    if (success.data) {
      navigate("/");
    } else {
      setErrorMsg(success.response.data.msg);
      setPopup(false);
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
    <div className="m-4">
      {isLoading && <Loading />}
      {errorMsg && (
        <p className="text-red-400 font-black text-3xl flex justify-center my-2">
          Not Authorized, only can delete your own job
        </p>
      )}
      <div className="flex w-[90vw] m-auto">
        <div
          className={`${
            popup ? "fixed" : "hidden"
          } flex items-center justify-center h-full w-screen left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 bg-gray-900 bg-opacity-50 `}
        >
          <div className="text-center flex flex-col justify-center items-center min-h-[250px] rounded-xl z-30 bg-white p-10 relative">
            <div
              className="text-red-600 absolute top-0 right-0"
              onClick={() => setPopup(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-9 h-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="my-4 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this image?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-700 p-2"
                onClick={roles === "Admin" ? adminDeleteJobBtn : deleteJobBtn}
              >
                Yes, I'm sure
              </button>
              <button className="border-2 p-2" onClick={() => setPopup(false)}>
                No, cancel
              </button>
            </div>
          </div>
        </div>
        {job && (
          <div className=" flex items-center space-between  border-2 m-2 p-2 rounded-2xl drop-shadow-lg">
            <div className="flex flex-col w-[10vw] justify-center items-center px-2 mr-6">
              {job?.createdBy?.avatar ? (
                <img
                  src={`${SERVER_URL}${job?.createdBy?.avatar}`}
                  alt="Company Logo"
                />
              ) : (
                <img
                  src="https://imgs.search.brave.com/lQJ580-JievQJ14gi6KKJrwsK5Yln9K2ECOia6lOlBg/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5E/WkxXRnFZcUlHNGxf/eUphcU91SlhnSGFI/YSZwaWQ9QXBp"
                  alt="Company Logo"
                />
              )}
              <h1 className="text-3xl mt-3">{job?.createdBy?.name}</h1>
            </div>
            <div className="ml-4 w-full">
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Job Title: </span>
                {job?.jobTitle}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Vacancies:</span>{" "}
                {job?.vacancies}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Job Category:</span>
                {job?.jobCategory}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Salary:</span>{" "}
                {job?.salary}
              </h2>
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Deadline:</span>{" "}
                {job?.deadline.split("T")[0]}
              </h2>
              {job?.experience && (
                <h2 className="flex items-center">
                  <span className="mr-3 w-32 font-black">Experience:</span>{" "}
                  {job?.experience}
                </h2>
              )}
              <h2 className="flex items-center">
                <span className="mr-3 w-32 font-black">Education:</span>{" "}
                {job?.education}
              </h2>
              {roles === "Admin" ? (
                <>
                  <button
                    className="border-2 px-3 py-1 my-2 bg-red-500 hover:text-white hover:bg-black"
                    onClick={() => setPopup(true)}
                  >
                    Delete Job
                  </button>
                </>
              ) : roles === "Company" ? (
                <>
                  <Link to={`/update/${job._id}`}>
                    <button className="border-2 px-3 py-1 my-2  hover:text-white hover:bg-black">
                      Update Job
                    </button>
                  </Link>
                  <button
                    className="border-2 px-3 py-1 my-2 bg-red-500 ml-3 hover:text-white hover:bg-black"
                    onClick={() => setPopup(true)}
                  >
                    Delete Job
                  </button>
                </>
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
