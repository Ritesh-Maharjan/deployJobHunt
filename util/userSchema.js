const yup = require("yup");

const userSchema = yup.object({
  body: yup.object({
    name: yup.string("Name is required").required(),
    password: yup
      .string("Must have at least 8 length and max of 32")
      .min(7)
      .max(32)
      .required(),
    email: yup.string("Must be an email").email().required(),
    phone: yup
      .string()
      .required()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    roles: yup
      .mixed("Must be one of Job seeker or Company")
      .oneOf(["Job seeker", "Company", "Admin"])
      .required(),
  }),
});

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string("Must be an email").email().required(),
    password: yup
      .string("Must have at least 7 length and max of 32")
      .min(7)
      .max(32)
      .required(),
  }),
});

const changePasswordSchema = yup.object({
  body: yup.object({
    oldPassword: yup
      .string("Must have at least 8 length and max of 32")
      .min(7)
      .max(32)
      .required(),
    newPassword: yup
      .string("Must have at least 8 length and max of 32")
      .min(7)
      .max(32)
      .required(),
  }),
});



const updateUserSchema = yup.object({
  body: yup.object({
    email: yup.string("Must be an email").email().required(),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits").required()
  }),
});

module.exports = { userSchema, loginSchema, changePasswordSchema, updateUserSchema };
