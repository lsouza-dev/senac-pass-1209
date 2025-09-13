import z, { optional } from 'zod'
export const setorFields = {
  id_setor         :true,
  nome             :true,
  descricao        :true,
  capacidade_max   :true,
  capacidade_atual :true,
  id_evento        :true,
  ativo            :true,
  reservas         :true,
  eventos          :true,
}

export const setorCriacaoSchema = z.object({
  nome           : z.string('O nome é obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres.'),
  descricao      : z.string('A descrição é obrigatória.').max(255,'A descrição deve ter no máximo 255 caracteres.'),
  capacidade_max : z.int('A capacidade máxima é obrigatória.').positive('A capacidade máxima deve ser um numero inteiro positivo'),
  id_evento : z.int('O evento não pode estar vazio.').positive('O código do evento deve ser um numero inteiro positivo'),
})

export const setorEdicaoSchema = z.object({
  nome           : z.string('O nome é obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres.').optional(),
  descricao      : z.string('A descrição é obrigatória.').max(255,'A descrição deve ter no máximo 255 caracteres.').optional(),
  capacidade_max : z.int('A capacidade máxima é obrigatória.').positive('A capacidade máxima deve ser um numero inteiro positivo').optional(),
  id_evento : z.int('O evento não pode estar vazio.').positive('O código do evento deve ser um numero inteiro positivo').optional(),
})


export type SetorCriacaoDTO = z.infer<typeof setorCriacaoSchema>
export type SetorEdicaoDTO = z.infer<typeof setorEdicaoSchema>