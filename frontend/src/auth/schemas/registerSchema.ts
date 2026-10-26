import * as yup from 'yup'

export const step1Schema = yup.object({
  firstname: yup.string().trim().required('First name is required'),
  lastname: yup.string().trim().required('Last name is required'),
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters'),
  province: yup.string().required('Province is required'),
  profileImageUrl: yup
    .string()
    .trim()
    .required('Profile image URL is required')
    .url('Please enter a valid URL'),
  email: yup.string().optional(),
  password: yup.string().optional(),
  confirmPassword: yup.string().optional(),
})

// Validation rules for POST /auth/register (see API contract)
export const registerSchema = step1Schema.shape({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

export type RegisterFormValues = yup.InferType<typeof registerSchema>
