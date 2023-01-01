import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { login } from "../api/userApi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loggingIn } from "../redux/slicer/authSlice";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const dispatch = useDispatch()

  const initialValues = {
    email: "",
    password: "",
  };

  // validation for all input except image since it's not required
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string()
      .min(7, "Must be greater than 7 characters")
      .required(),
  });

  const renderError = (message) => <p className="text-red-400">{message}</p>;

  const onSubmit = async (values, actions) => {
    const resData = await login(values);

    if (resData.response) {
      setError(resData.response.data.msg);
    } else {
      localStorage.setItem('user', resData.data.token)
      dispatch(loggingIn(resData.data.token))
      navigate("/");
    }
  };

  return (
    <div>
      <div className="mt-10 h-[90vh]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            await onSubmit(values, actions);
          }}
        >
          <Form className="w-[90vw] border-2 border-black rounded-lg shadow-2xl p-6 m-auto">
            <h1 className="font-bold text-3xl my-4">Login</h1>
            {error && <p className="text-red-400">{error}</p>}
            <div className="my-4">
              <label className="block text-gray-500 font-bold">Email:</label>
              <div>
                <Field
                  className="border-2 w-full p-2  "
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" render={renderError} />
              </div>
            </div>

            <div className="my-4">
              <label className="block text-gray-500 font-bold">Password:</label>
              <Field
                className="border-2 w-full p-2  "
                type="password"
                name="password"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" render={renderError} />
            </div>

            <button
              type="submit"
              className="border-2 px-5 py-2 hover:bg-black hover:text-white"
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;
