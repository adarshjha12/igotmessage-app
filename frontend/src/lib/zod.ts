import {z} from 'zod'

const phoneSchema = z.string()
  .min(10, "Phone number is too short")
  .regex(/^\d+$/, "Enter numbers only");

export {phoneSchema}