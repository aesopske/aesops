import * as z from "zod"

export const predictionsModel = z.object({
  id: z.number().int(),
  month: z.string().nullish(),
  year: z.number().int().nullish(),
  PMS: z.number().nullish(),
  AGO: z.number().nullish(),
  DPK: z.number().nullish(),
  prediction_date: z.date().nullish(),
})
