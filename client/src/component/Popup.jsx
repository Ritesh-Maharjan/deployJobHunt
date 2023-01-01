import React from "react";
import { useDispatch } from "react-redux";
import { togglePopup } from "../redux/slicer/popupSlice";

function Popup({ text, actionFunc }) {
  const dispatch = useDispatch();
  return (
    <div className="fixed flex items-center justify-center h-full w-screen left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 bg-gray-900 bg-opacity-50">
      <div className="text-center flex flex-col justify-center items-center min-h-[250px] rounded-xl z-30 bg-white p-10 relative">
        <div
          className="text-red-600 absolute top-0 right-0"
          onClick={() => dispatch(togglePopup(false))}
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
          {text}
        </h3>
        <div className="flex justify-center gap-4">
          <button className="bg-red-700 p-2" onClick={actionFunc}>Yes, I'm sure</button>
          <button
            className="border-2 p-2"
            onClick={() => dispatch(togglePopup(false))}
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
