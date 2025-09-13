import z from 'zod'
export const eventoFields = {
  id_evento      :true,
  nome           :true,
  descricao      :true,
  local          :true,
  dt_inicio      :true,
  dt_fim         :true,
  capacidade_max :true,
  ativo          :true,
  reservas       :true,
  setores:true,

}

const dtInicioRegex = z.string('A data de início é obrigatória').regex(
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
  'A data de início deve estar no formato yyyy-MM-dd hh:mm'
)
const dtFimRegex = z.string('A data final é obrigatória').regex(
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
  'A data final deve estar no formato yyyy-MM-dd hh:mm'
)

export const eventoCriacaoSchema = z.object({
  nome           : z.string('O nome é obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres.'),
  descricao      : z.string('A descrição é obrigatória.').max(255,'A descrição deve ter no máximo 255 caracteres.'),
  local          : z.string('O local é obrigatório.').max(255,'O local deve ter no máximo 255 caracteres.'),
  dt_inicio      : dtInicioRegex,
  dt_fim         : dtFimRegex,
  capacidade_max : z.int('A capacidade máxima é obrigatória.').positive('A capacidade máxima deve ser um numero inteiro positivo'),
})

export const eventoEdicaoSchema = z.object({
  nome           : z.string('O nome é obrigatório.').max(100,'O nome deve ter no máximo 100 caracteres.').optional(),
  descricao      : z.string('A descrição é obrigatória.').max(255,'A descrição deve ter no máximo 255 caracteres.').optional(),
  local          : z.string('O local é obrigatório.').max(255,'O local deve ter no máximo 255 caracteres.').optional(),
  dt_inicio      : dtInicioRegex.optional(),
  dt_fim         : dtFimRegex.optional(),
  capacidade_max : z.int('A capacidade máxima é obrigatória.').positive('A capacidade máxima deve ser um numero inteiro positivo').optional(),
})


export type EventoCriacaoDTO = z.infer<typeof eventoCriacaoSchema>
export type EventoEdicaoDTO = z.infer<typeof eventoEdicaoSchema>