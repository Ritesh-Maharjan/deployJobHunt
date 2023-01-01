import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { loggingIn, loggingOut } from "../redux/slicer/authSlice";
import { useState } from "react";
import { useRef } from "react";

function Header() {
  const [displayMenu, setDisplayMenu] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuButton = useRef();
  const menuEl = useRef();
  const isLoggedIn = useSelector((state) => state.auth.user);
  const { decodedToken } = useJwt(isLoggedIn);
  const roles = decodedToken?.roles;

  useEffect(() => {
    const handleClick = (e) => {
      if (
        displayMenu &&
        !menuButton.current.contains(e.target) &&
        !menuEl.current.contains(e.target)
      ) {
        setDisplayMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    if (localStorage.getItem("user")) {
      dispatch(loggingIn(localStorage.getItem("user")));
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [dispatch, displayMenu]);

  const logout = () => {
    dispatch(loggingOut());
    localStorage.removeItem("user");
    setDisplayMenu(false)
    navigate("/login")
  };

  return (
    <div className="bg-black text-white rounded drop-shadow-xl relative z-10">
      <div className="flex flex-col w-[90%] m-auto">
        <div className="flex w-full h-[10vh] justify-between items-center md:text-xl">
          <h1 className="text-2xl font-bold md:text-3xl hover:border-b-4 ">
            <Link to="/">Job Hunt</Link>
          </h1>
          {isLoggedIn ? (
            <div className="relative">
              <button
                ref={menuButton}
                className="py-1 px-2 border-2 rounded-md"
                onClick={() => setDisplayMenu(!displayMenu)}
              >
                <span className="mr-4">Account </span>
              </button>
              <div
                className={`${
                  displayMenu ? "absolute" : "hidden"
                } right-0 bg-white rounded-md shadow-xl w-44`}
                ref={menuEl}
              >
                <Link
                  to="/profile"
                  onClick={() => setDisplayMenu(false)}
                  className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-400 hover:text-white"
                >
                  Profile
                </Link>
                {roles === "Job seeker" ? (
                  <Link
                    to="/applications"
                  onClick={() => setDisplayMenu(false)}
                  className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-400 hover:text-white"
                  >
                    Applied Jobs
                  </Link>
                ) : roles === "Admin" ? (
                  <Link
                    to="/users"
                  onClick={() => setDisplayMenu(false)}
                  className="block px-4 py-2 text-sm  text-gray-700 hover:bg-gray-400 hover:text-white"
                  >
                    Users
                  </Link>
                ) : (
                  <></>
                )}
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 hover:text-white w-full text-left"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <ul className="flex justify-around w-[10rem]">
              <Link to="signup">
                <li className="hover:border-b-4">Sign Up</li>
              </Link>
              <Link to="login">
                <li className="hover:border-b-4">Login</li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
