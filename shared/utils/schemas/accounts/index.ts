import { accounts } from '@nuxthub/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

const base = createInsertSchema(accounts)

export default {
  create: base,
  register: base.pick({ username: true, email: true, password: true }),
  login: base.pick({ username: true, password: true }),
  forgotPassword: z.object({
    username: z.string().min(1, 'Username or email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  }),
  resetPassword: z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  }),
}
