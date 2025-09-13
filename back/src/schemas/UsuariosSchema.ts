import z from 'zod'
export const usuarioFields = {
  id_usuario :true,
  nome       :true,
  cpf        :true,
  telefone   :true,
  email      :true,
  senha      :false,
  ativo      :true,
  id_perfil  :false,
  reservas   :false,
  perfis :true,

}

export const usuarioCriacaoSchema = z.object({
  nome       : z.string('nome obrigatório.').max(255,'nome deve ter no máximo 255 caracteres'),
  cpf        : z.string('cpf obrigatório.').max(255,'cpf deve ter no máximo 255 caracteres'),
  telefone   : z.string('telefone obrigatório.').max(255,'telefone deve ter no máximo 255 caracteres'),
  email      : z.string('email obrigatório.').max(255,'email deve ter no máximo 255 caracteres'),
  senha      : z.string('senha obrigatória.').max(255,'senha deve ter no máximo 255 caracteres'),
  id_perfil  : z.int('id_perfil obrigatório. Deve ser um número inteiro positivo'),
})

export const usuarioEdicaoSchema = z.object({
  nome       : z.string('nome obrigatório.').max(255,'nome deve ter no máximo 255 caracteres').optional(),
  telefone   : z.string('telefone obrigatório.').max(255,'telefone deve ter no máximo 255 caracteres').optional(),
  email      : z.string('email obrigatório.').max(255,'email deve ter no máximo 255 caracteres').optional(),
  senha      : z.string('senha obrigatória.').max(255,'senha deve ter no máximo 255 caracteres').optional(),
  ativo      : z.boolean('ativo deve ser verdadeiro ou falso.').optional(),
  id_perfil  : z.int('id_perfil obrigatório. Deve ser um número inteiro positivo').optional(),
})


export type UsuarioCriacaoDTO = z.infer<typeof usuarioCriacaoSchema>
export type UsuarioEdicaoDTO = z.infer<typeof usuarioEdicaoSchema>