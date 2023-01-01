import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { createUser } from "../api/userApi";

function Signup() {
  const [file, setFile] = useState("");
  const navigate = useNavigate();

  // validation for all input except image since it's not required
  const validationSchema = Yup.object({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string()
      .min(7, "Must be greater than 7 characters")
      .required(),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    roles: Yup.string().required(),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    roles: "Company",
  };

  const renderError = (message) => <p className="text-red-400">{message}</p>;

  const onSubmit = async (values, actions) => {
    // Creating formdata in order to send image if sent
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("roles", values.roles);
    formData.append("avatar", file);

    // calling the api to create the user
    const resData = await createUser(formData);

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
      navigate("/login");
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
          <Form className="w-[90vw] border-2 border-black rounded-lg shadow-2xl p-6 mt-2 m-auto">
            <h1 className="font-bold text-3xl my-4">Sign up</h1>

            <div className="my-4">
              <label className="block text-gray-500 font-bold" htmlFor="name">
                Name:
              </label>
              <div>
                <Field
                  className="border-2 w-full p-2  "
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" render={renderError} />
              </div>
            </div>

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
              <div>
                <Field
                  className="border-2 w-full p-2  "
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" render={renderError} />
              </div>
            </div>

            <div className="my-4">
              <label className="block text-gray-500 font-bold">Phone:</label>
              <div>
                <Field
                  className="border-2 w-full p-2  "
                  type="number"
                  name="phone"
                  placeholder="Enter your phone number"
                  onWheel={(e) => e.target.blur()}
                />
                <ErrorMessage name="phone" render={renderError} />
              </div>
            </div>

            <div className="my-4">
              <label className="block text-gray-500 font-bold">Roles:</label>
              <div className="flex flex-col">
                <div>
                  <Field
                    type="radio"
                    name="roles"
                    value="Company"
                    id="Company"
                  />
                  <label htmlFor="Company" className="ml-1 mr-2">
                    Company
                  </label>
                  <Field
                    type="radio"
                    name="roles"
                    value="Job seeker"
                    id="Job seeker"
                  />
                  <label htmlFor="Job seeker" className="ml-1">
                    Job seeker
                  </label>
                </div>
                <ErrorMessage name="roles" render={renderError} />
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
              Signup
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Signup;
