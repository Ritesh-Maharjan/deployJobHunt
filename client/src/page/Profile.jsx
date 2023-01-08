import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { deleteUser, getUser, updateUser } from "../api/userApi";
import { useNavigate } from "react-router";
import Popup from "../component/Popup";
import { togglePopup } from "../redux/slicer/popupSlice";
import { loggingOut } from "../redux/slicer/authSlice";
import { deleteApplication } from "../api/applicationApi";
import Loading from "../component/Loading";

function Profile() {
  const [user, setUser] = useState();
  const [file, setFile] = useState("");
  const [success, setSuccess] = useState();
  const [isLoading, setIsLoading] = useState();
  const token = useSelector((state) => state.auth.user);
  const popup = useSelector((state) => state.popup.popup);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let initialValues = {
    name: "",
    email: "",
    phone: "",
    avatar: "",
  };

  // validation for all input except image since it's not required
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
  });

  if (user) {
    initialValues = {
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    };
  }

  const renderError = (message) => <p className="text-red-400">{message}</p>;

  const onSubmit = async (values, actions) => {
    // Creating formdata in order to send image if sent
    let formData = new FormData();
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("avatar", file);

    // calling the api to create the user
    const resData = await updateUser(formData, token);

    // checking errors and displaying the errors
    if (resData.response) {
      let errors = resData.response.data.err.errors;
      if (errors.email) {
        actions.setFieldError("email", errors.email.message);
      }
      if (errors.phone) {
        actions.setFieldError("phone", errors.phone.message);
      }
    } else {
      setSuccess("Updated successfully!!!");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const callUserApi = async () => {
      const resData = await getUser(token);
      setIsLoading(false);
      if (resData.data) {
        setUser(resData.data);
        navigate("/profile");
      }
    };
    if (token) {
      callUserApi();
    }
  }, [token, navigate]);

  const deleteAccBtn = async (e) => {
    e.preventDefault();
    dispatch(togglePopup(true));
  };

  const accountDelete = async () => {
    const resData = await deleteUser(token);
    if (resData.data) {
      await deleteApplication(token);
      localStorage.removeItem("user");
      dispatch(loggingOut());
      dispatch(togglePopup(false));
      navigate("/");
    }
  };

  return (
    <div className="w-[90vw] m-auto mt-4">
      {popup && (
        <Popup
          text={"Are you sure you want to delete this account?"}
          actionFunc={accountDelete}
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        user && (
          <div
            key={user._id}
            className=" flex flex-col space-between border-2 p-2 m-auto rounded-2xl drop-shadow-lg"
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, actions) => {
                await onSubmit(values, actions);
              }}
            >
              <Form className="w-full p-6 mt-2 m-auto">
                {success && (
                  <p className="bg-green-300 py-4 rounded-lg text-center">
                    {success}
                  </p>
                )}
                <h1 className="font-bold text-lg lg:text-3xl my-4">Update your account</h1>

                <div className="my-4">
                  <label htmlFor="email" className="block text-gray-500 font-bold">
                    Email:
                  </label>
                  <div>
                    <Field
                      className="border-2 w-full p-2  "
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" render={renderError} />
                  </div>
                </div>

                <div className="my-4">
                  <label htmlFor="phone" className="block text-gray-500 font-bold">
                    Phone:
                  </label>
                  <div>
                    <Field
                      className="border-2 w-full p-2  "
                      type="number"
                      name="phone"
                      id="phone"
                      placeholder="Enter your phone number"
                      onWheel={(e) => e.target.blur()}
                    />
                    <ErrorMessage name="phone" render={renderError} />
                  </div>
                </div>

                <div className="my-4">
                  <input
                    className="file:mr-2 file:py-1 file:px-4 text-sm file:rounded-full file:text-sm cursor-pointer"
                    type="file"
                    name="avatar"
                    onChange={(event) => {
                      setFile(event.target.files[0]);
                    }}
                  />
                </div>


                <button
                  type="submit"
                  className="border-2 my-4 px-5 py-2 hover:bg-black hover:text-white"
                >
                  Update
                </button>
                <button
                  onClick={(e) => deleteAccBtn(e)}
                  className="border-2 md:my-4 md:mx-4 px-5 py-2 bg-red-400 hover:bg-black hover:text-white"
                >
                  Delete Account
                </button>
              </Form>
            </Formik>
          </div>
        )
      )}
    </div>
  );
}

export default Profile;
