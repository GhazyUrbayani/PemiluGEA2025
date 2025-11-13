import { z } from "zod";

export const signInSchema = z.object({
  nim: z
    .string({ required_error: "Masukkan NIM Anda" })
    .length(8, { message: "NIM Invalid" })
    .refine(
      (value) => {
        const firstThree = value.slice(0, 3);
        const lastFive = value.slice(3);
        return (
          firstThree === "120" &&
          !isNaN(Number(lastFive)) &&
          lastFive.length === 5
        );
      },
      { message: "NIM Invalid" },
    ),
  password: z
    .string({
      required_error: "Masukkan Password Anda",
    })
    .min(8, { message: "Password Harus Sepanjang Minimal 8 Karakter" }),
});

export const signUpSchema = z.object({
  nim: z
    .string({ required_error: "Masukkan NIM Anda" })
    .length(8, { message: "Invalid NIM" })
    .refine(
      (value) => {
        const firstThree = value.slice(0, 3);
        const lastFive = value.slice(3);
        return (
          firstThree === "120" &&
          !isNaN(Number(lastFive)) &&
          lastFive.length === 5
        );
      },
      { message: "Invalid NIM" },
    ),
  password: z
    .string({
      required_error: "Masukkan Password Anda",
    })
    .min(8, { message: "Password Harus Sepanjang Minimal 8 Karakter" }),
});
