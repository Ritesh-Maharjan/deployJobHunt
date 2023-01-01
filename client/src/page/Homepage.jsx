import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useJwt } from "react-jwt";
import { getAllJobs } from "../api/jobApi";
import Card from "../component/Card";
import Loading from "../component/Loading";

function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const searchInput = useRef(null);

  const [search, setSearch] = useState("");

  const token = useSelector((state) => state.auth.user);
  const { decodedToken } = useJwt(token);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllJobs(search, token);
      setIsLoading(false);
      setJobs(data.data.jobs);
    };
    fetchData();
  }, [search, token]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.current.value);
  };

  return (
    <div>
      <div className="flex flex-col w-[90vw] m-auto items-center ">
        <form className="flex items-center w-full relative m-2">
          <input
            type="text"
            name="search"
            ref={searchInput}
            placeholder="Search"
            className="border-2 w-full p-2 rounded-2xl drop-shadow-lg"
          />
          <button
            onClick={submitSearch}
            className="absolute right-0 p-2 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </form>
        {decodedToken?.roles === "Company" && (
          <div className="flex justify-end w-full my-2">
            <Link
              to="addjob"
              className="border-2 p-2 rounded-2xl drop-shadow-lg hover:text-white hover:bg-black"
            >
              Add job
            </Link>
          </div>
        )}
        {isLoading ? (
          <Loading /> 
        ) : jobs.length < 1 ? (
          <div>
            <h1 className="text-3xl font-black">No Jobs found</h1>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 w-full">
            {jobs?.map((el) => {
              return <Card data={el} key={el._id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
