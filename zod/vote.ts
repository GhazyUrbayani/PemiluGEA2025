import { z } from "zod";

export const voteSchema = z
  .object({
    token: z.string({ required_error: "Token is required" }).length(8, {
      message: "Token Invalid",
    }),
    sk1: z.string({ required_error: "SK1 is required" }).length(8, {
      message: "SK1 Invalid",
    }),
    sk2: z.string({ required_error: "SK2 is required" }).length(8, {
      message: "SK2 Invalid",
    }),
    sk3: z.string({ required_error: "SK3 is required" }).length(8, {
      message: "SK3 Invalid",
    }),
    sk4: z.string({ required_error: "SK4 is required" }).length(8, {
      message: "SK4 Invalid",
    }),
    ss1: z.string({ required_error: "SS1 is required" }).length(8, {
      message: "SS1 Invalid",
    }),
    ss2: z.string({ required_error: "SS2 is required" }).length(8, {
      message: "SS2 Invalid",
    }),
    ss3: z.string({ required_error: "SS3 is required" }).length(8, {
      message: "SS3 Invalid",
    }),
  })
  .refine(
    (data) => {
      const skValues = [data.sk1, data.sk2, data.sk3, data.sk4];
      const uniqueSkValues = new Set(skValues);

      const ssValues = [data.ss1, data.ss2, data.ss3];
      const uniqueSsValues = new Set(ssValues);

      return uniqueSkValues.size === 4 && uniqueSsValues.size === 3;
    },
    {
      message:
        "SK1, SK2, SK3, SK4 must be different values and SS1, SS2, SS3 must be different values",
      path: ["vote"],
    },
  );

export const tokenValidationSchema = z.object({
  token: z.string({ required_error: "Token is required" }).length(8, {
    message: "Token Invalid",
  }),
});

export const kahimVoteSchema = z
  .object({
    sk1: z.string({ required_error: "SK1 is required" }).length(8, {
      message: "SK1 Invalid",
    }),
    sk2: z.string({ required_error: "SK2 is required" }).length(8, {
      message: "SK2 Invalid",
    }),
    sk3: z.string({ required_error: "SK3 is required" }).length(8, {
      message: "SK3 Invalid",
    }),
    sk4: z.string({ required_error: "SK4 is required" }).length(8, {
      message: "SK4 Invalid",
    }),
  })
  .refine(
    (data) => {
      // Check if all sk values are different
      const skValues = [data.sk1, data.sk2, data.sk3, data.sk4];
      const uniqueSkValues = new Set(skValues);

      return uniqueSkValues.size === 4;
    },
    {
      message: "SK1, SK2, SK3, SK4 must be different values",
      path: ["kahim"], // this will make the error appear at the root level
    },
  );

export const senatorVoteSchema = z
  .object({
    ss1: z.string({ required_error: "SS1 is required" }).length(8, {
      message: "SS1 Invalid",
    }),
    ss2: z.string({ required_error: "SS2 is required" }).length(8, {
      message: "SS2 Invalid",
    }),
    ss3: z.string({ required_error: "SS3 is required" }).length(8, {
      message: "SS3 Invalid",
    }),
  })
  .refine(
    (data) => {
      // Check if all ss values are different
      const ssValues = [data.ss1, data.ss2, data.ss3];
      const uniqueSsValues = new Set(ssValues);

      return uniqueSsValues.size === 3;
    },
    {
      message: "SS1, SS2, SS3 must be different values",
      path: ["senator"], // this will make the error appear at the root level
    },
  );
