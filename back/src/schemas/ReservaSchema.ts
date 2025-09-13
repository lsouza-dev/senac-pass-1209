import z from 'zod'
export const reservaFields = {
  id_reserva   :true,
  id_cliente   :true,
  id_usuario   :true,
  id_evento    :true,
  id_setor     :true,
  status       :true,
  dt_criacao   :true,
  dt_validacao :true,
  ativo        :true,
  clientes     :true,
  eventos      :true,
  setores      :true,
  usuarios     :true,
}

export const reservaCriacaoSchema = z.object({
  id_reserva   : z.string().optional(),
  id_cliente   : z.int('O id_cliente é obrigatório.').positive('O id_cliente deve ser um número inteiro positivo.'),
  id_usuario   : z.int('O id_usuario é obrigatório.').positive('O id_usuario deve ser um número inteiro positivo.'),
  id_evento    : z.int('O id_evento é obrigatório.').positive('O id_evento deve ser um número inteiro positivo.'),
  id_setor    : z.int('O id_setor é obrigatório.').positive('O id_setor deve ser um número inteiro positivo.'),
})

export const reservaEdicaoSchema = z.object({
  id_setor    : z.int('O id_setor é obrigatório.').positive('O id_setor deve ser um número inteiro positivo.').optional(),
})


export type ReservaCriacaoDTO = z.infer<typeof reservaCriacaoSchema>
export type ReservaEdicaoDTO = z.infer<typeof reservaEdicaoSchema>