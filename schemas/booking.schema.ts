import { z } from "zod";

export const RoomSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  image: z.string(),
});

export const RoomsResponseSchema = z.array(RoomSchema);

// What the CLIENT sends. No `id` — that's assigned by Postgres on
// insert and only ever appears in the response, never the request.
export const BookingRequestSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\d+$/, 'phone must contain only digits'),
  checkin: z.string(),
  checkout: z.string(),
  roomID: z.number(),
});

// What the SERVER returns after INSERT ... RETURNING *.
export const BookingResponseSchema = z.object({
  id: z.number(),
  room_id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  phone: z.string(),
  checkin: z.string(),
  checkout: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
}).refine(data => data.error || data.message, {
  message: 'expected either an `error` or `message` field',
});