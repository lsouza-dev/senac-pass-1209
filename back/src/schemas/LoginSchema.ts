import z from "zod";

export const loginSchema = z.object({
  login: z.string('O campo login é obrigatório').max(255,'Login deve ter no máximo 255 caracteres.'),
  senha: z.string('O campo senha é obrigatório').max(255,'senha deve ter no máximo 255 caracteres.'),
})

export type LoginDTO = z.infer<typeof loginSchema>