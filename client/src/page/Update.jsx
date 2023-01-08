import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getJob, updateJob } from "../api/jobApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../component/Loading";

function Update() {
  const token = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);
  const [apiData, setApiData] = useState();
  const [isLoading, setIsLoading] = useState();
  const param = useParams();
  const navigate = useNavigate();

  const initialValues = {
    jobTitle: apiData?.jobTitle,
    deadline: apiData?.deadline.split("T")[0],
    education: apiData?.education,
    experience: apiData?.experience || "",
    jobCategory: apiData?.jobCategory,
    salary: apiData?.salary,
    jobType: apiData?.jobType,
    vacancies: apiData?.vacancies,
  };

  useEffect(() => {
    setIsLoading(true);

    const getJobApi = async () => {
      const resData = await getJob(param.id);
      setIsLoading(false);
      if (resData?.response?.status === 403) {
        navigate("/forbidden");
      } else {
        navigate(`/update/${param.id}`);
        setApiData(resData.data);
      }
    };
    getJobApi();
  }, [param.id, navigate]);

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required(),
    jobCategory: Yup.string().required(),
    salary: Yup.string().required(),
    vacancies: Yup.number().min(1).required(),
    deadline: Yup.date().required(),
  });

  const onSubmit = async (values) => {
    const data = {
      jobTitle: values.jobTitle,
      deadline: values.deadline,
      education: values.education,
      experience: values.experience,
      jobCategory: values.jobCategory,
      salary: values.salary,
      vacancies: values.vacancies,
    };

    const resData = await updateJob(param.id, data, token);
    if (resData.response?.status === 401) {
      navigate("/forbidden");
    }
    if (resData.data) {
      setSuccess("Updated successfully!!!");
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  };

  const renderError = (message) => <p className="text-red-400">{message}</p>;

  return (
    <div>
      <div className="mt-10 h-[90vh]">
        {isLoading ? (
          <Loading />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await onSubmit(values);
            }}
            enableReinitialize={true}
          >
            <Form className="w-[90vw] border-2 border-black rounded-lg shadow-2xl p-6 m-auto">
              {success && (
                <div className="fixed flex items-center justify-center h-full w-screen left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] z-10 bg-gray-900 bg-opacity-50">
                  <div
                    className="p-4 mb-4 text-sm bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 relative flex items-center justify-center min-h-[100px]"
                    role="alert"
                  >
                    <div
                      className="text-red-600 absolute top-0 right-0"
                      onClick={() => setSuccess(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <span className="lg:font-bold text-xl">
                      Updated successfully!
                    </span>
                  </div>
                </div>
              )}

              <h1 className="font-bold text-3xl my-4">Update job</h1>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Job Title:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="text"
                    name="jobTitle"
                    placeholder="Enter your job title"
                  />
                  <ErrorMessage name="jobTitle" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Vacancies:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="number"
                    name="vacancies"
                    placeholder="Enter total number of vacancy"
                  />
                  <ErrorMessage name="vacancies" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Job Category:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="text"
                    name="jobCategory"
                    placeholder="Enter your job category"
                  />
                  <ErrorMessage name="jobCategory" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">Salary:</label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="text"
                    name="salary"
                    placeholder="Enter the salary amount"
                  />
                  <ErrorMessage name="salary" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Deadline:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="date"
                    name="deadline"
                    placeholder="Enter job deadline"
                  />
                  <ErrorMessage name="deadline" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Experience:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    type="text"
                    name="experience"
                    placeholder="Enter required experience"
                  />
                  <ErrorMessage name="experience" render={renderError} />
                </div>
              </div>
              <div className="my-4">
                <label className="block text-gray-500 font-bold">
                  Select Education level:
                </label>
                <div>
                  <Field
                    className="border-2 w-full p-2  "
                    as="select"
                    name="education"
                  >
                    <option value="High school">High school</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Phd">Phd</option>
                  </Field>
                  <ErrorMessage name="education" render={renderError} />
                </div>
              </div>

              <button
                type="submit"
                className="border-2 px-5 py-2 hover:bg-black hover:text-white"
              >
                Update Job
              </button>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
}

export default Update;
