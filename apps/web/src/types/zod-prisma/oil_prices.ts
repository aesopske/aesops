import * as z from "zod"

export const oil_pricesModel = z.object({
  id: z.number().int(),
  Date: z.date().nullish(),
  Towns: z.string().nullish(),
  County: z.string().nullish(),
  Pms: z.number().nullish(),
  Ago: z.number().nullish(),
  Dpk: z.number().nullish(),
  Year: z.number().int().nullish(),
  Month: z.string().nullish(),
  Exrates: z.number().nullish(),
  Ppb: z.number().nullish(),
})
