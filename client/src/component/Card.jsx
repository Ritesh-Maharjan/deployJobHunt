import React from "react";
import { Link } from "react-router-dom";

function Card({ data }) {
  const SERVER_URL = process.env.REACT_APP_IMAGE_URL;
  return (
    <Link to={`../job/${data._id}`}>
      <div className=" flex flex-col sm:flex-row sm:items-center sm:space-between border-2 m-2 p-2 rounded-2xl drop-shadow-lg hover:border-red-400">
        <div className="flex flex-col items-center justify-center w-16 my-2 sm:min-w-[100px] md:min-h-[140px] xl:min-h-[200px] ">
          {data?.createdBy?.avatar ? (
            <img src={`${SERVER_URL}${data?.createdBy.avatar}`} alt="Company logo" className="bg-contain h-12 lg:h-24" />
          ) : (
            <img
              src="https://imgs.search.brave.com/lQJ580-JievQJ14gi6KKJrwsK5Yln9K2ECOia6lOlBg/rs:fit:474:225:1/g:ce/aHR0cHM6Ly90c2U0/Lm1tLmJpbmcubmV0/L3RoP2lkPU9JUC5E/WkxXRnFZcUlHNGxf/eUphcU91SlhnSGFI/YSZwaWQ9QXBp"
              alt="Company logo"
            />
          )}
          <h1 className="text-sm font-bold mt-1 lg:text-xl">{data?.createdBy?.name}</h1>
        </div>
        <div className="text-xs sm:text-md xl:text-lg ml-4 w-full">
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Title: </span>
            {data?.jobTitle}
          </h2>
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Vacancies:</span> {data?.vacancies}
          </h2>
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Category:</span>
            {data?.jobCategory}
          </h2>
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Salary:</span> {data?.salary}
          </h2>
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Deadline:</span>
            {data?.deadline.split("T")[0]}
          </h2>

          {data?.experience && (
            <h2 className="flex items-center">
              <span className="mr-3 lg:w-32 font-black">Experience:</span>
              {data?.experience}
            </h2>
          )}
          <h2 className="flex items-center">
            <span className="mr-3 lg:w-32 font-black">Education:</span>
            {data?.education}
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default Card;
