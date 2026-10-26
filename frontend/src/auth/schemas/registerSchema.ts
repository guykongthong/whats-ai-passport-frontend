import * as yup from 'yup'

// Validation rules for POST /auth/register (see API contract)
export const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  firstname: yup.string().trim().required('First name is required'),
  lastname: yup.string().trim().required('Last name is required'),
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address'),
  province: yup.string().required('Province is required'),
  profileImageUrl: yup
    .string()
    .trim()
    .required('Profile image URL is required')
    .url('Please enter a valid URL'),
})

export type RegisterFormValues = yup.InferType<typeof registerSchema>
