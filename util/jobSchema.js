const yup = require("yup");

const createJobSchema = yup.object({
  body: yup.object({
    jobTitle: yup.string("Job title is required").required(),
    jobCategory: yup.string("").required(),
    salary: yup.string("Job title is required").required(),
    deadline: yup.date("Job title is required").required(),
    education: yup
      .string()
      .oneOf(["High school", "Bachelor", "Master", "Phd"])
      .required(),
  }),
});

const updateJobSchema = yup.object({
  body: yup.object({
    jobTitle: yup.string("Job title is required").required(),
    jobCategory: yup.string("").required(),
    salary: yup.string("Job title is required").required(),
    deadline: yup.date("Job title is required").required(),
    education: yup
      .string()
      .oneOf(["High school", "Bachelor", "Master", "Phd"])
      .required(),
  }),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
};
