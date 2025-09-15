import z from 'zod'
export const clienteFields = {
  id_cliente :true,
  nome       :true,
  cpf        :true,
  telefone   :true,
  email      :true,
  ativo      :true,
  reservas   :false,
}

export const clienteCriacaoSchema = z.object({
  nome       : z.string('nome obrigatório.').max(255,'nome deve ter no máximo 255 caracteres').min(10,'nome deve ter ao menos 10 caracteres'),
  cpf        : z.string('cpf obrigatório.').max(11,'cpf deve ter no máximo 11 caracteres').min(11,'insira um cpf válido'),
  telefone   : z.string('telefone obrigatório.').max(11,'telefone deve ter no máximo 11 caracteres').min(10,'insira um telefone valido'),
  email      : z.string('email obrigatório.').max(255,'email deve ter no máximo 255 caracteres').min(10,'email deve ter ao menos 10 caracteres'),
})

export const clienteEdicaoSchema = z.object({
  nome       : z.string('nome obrigatório.').max(255,'nome deve ter no máximo 255 caracteres').optional(),
  telefone   : z.string('telefone obrigatório.').max(255,'telefone deve ter no máximo 255 caracteres').optional(),
  email      : z.string('email obrigatório.').max(255,'email deve ter no máximo 255 caracteres').optional(),
})


export type ClienteCriacaoDTO = z.infer<typeof clienteCriacaoSchema>
export type ClienteEdicaoDTO = z.infer<typeof clienteEdicaoSchema>