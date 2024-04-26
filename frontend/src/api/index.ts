import { safeFetch } from "../lib/http"
import { z } from "zod"

export const check = (min: string, max: string) =>
  safeFetch({
    method: "GET",
    url: `http://localhost:3000//api/hotels?min=${min}&max=${max}`,
    schema: z.object({ }),
  })