import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllApplicaitons } from "../api/applicationApi";
import Card from "../component/Card";
import Loading from "../component/Loading";

function JobApplications() {
  const token = useSelector((state) => state.auth.user);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const applicationsApi = async () => {
      const resData = await getAllApplicaitons(token);
      setIsLoading(false);
      if (resData?.response?.status === 401) {
        navigate("/forbidden");
      } else {
        setData(resData.data);
        navigate("/applications");
      }
    };
    if (token) {
      applicationsApi();
    }
  }, [token, navigate]);

  return (
    <div
      className={`${
        data?.length !== 0 && "grid xl:grid-cols-2"
      }  w-[90vw] m-auto`}
    >
      {isLoading ? (
        <Loading />
      ) : data?.length === 0 ? (
        <div className="h-[90vh] w-full flex justify-center items-center ">
          <h1 className="font-black text-3xl">
            No jobs applied yet!! Please go and apply.
          </h1>
        </div>
      ) : (
        data?.map((el) => {
          return <Card data={el.jobId} key={el._id} />;
        })
      )}
    </div>
  );
}

export default JobApplications;
