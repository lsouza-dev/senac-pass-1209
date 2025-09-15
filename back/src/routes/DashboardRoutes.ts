import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { mensagemPadrao, prisma, verificarIdRequisicao } from "../Util";



export async function dashboardRoutes(server:FastifyInstance) {
  server.get('/:idEvento',async (req:FastifyRequest<{Params:{idEvento:number}}>,reply: FastifyReply) => {
    try{
      const {idEvento} = req.params
      verificarIdRequisicao(idEvento,reply)


      const  cardsEvento = await prisma.$queryRawUnsafe<any[]>(`
          SELECT
          evt.nome as nome,
          evt.capacidade_max as capacidade,
          CAST((evt.capacidade_max - SUM(CASE WHEN rsv.ativo = 1 THEN 1 ELSE 0 END))as SIGNED) as disponiveis,
          CAST(SUM(CASE WHEN rsv.ativo = 1 THEN 1 ELSE 0 END) as SIGNED) as vendidos,
          CAST(SUM(CASE WHEN rsv.status = 'Validado' THEN 1 ELSE 0 END)as SIGNED) as validados
          FROM reservas rsv
          RIGHT JOIN eventos evt on (evt.id_evento =  rsv.id_evento)
          where evt.id_evento = ${idEvento};
        `)

        console.log(cardsEvento);


      const setoresDash = await prisma.$queryRawUnsafe<any[]>(`
          SELECT
          str.id_setor,
          str.nome,
          CAST((str.capacidade_max - SUM(CASE WHEN rsv.ativo = 1 THEN 1 ELSE 0 END)) as SIGNED) as disponiveis,
          CAST(SUM(CASE WHEN rsv.ativo = 1 THEN 1 ELSE 0 END) as SIGNED) as vendidos,
          CAST((str.capacidade_atual) as SIGNED) as ocupados,
          CAST((str.capacidade_max - SUM(CASE WHEN rsv.status = 'Validado' THEN 1 ELSE 0 END)) as SIGNED) as desocupados
          from setores str
          INNER join eventos evt on (str.id_evento = evt.id_evento)
          LEFT join reservas rsv on (rsv.id_setor = str.id_setor)
          where str.id_evento = ${idEvento} and str.ativo = true
          group by str.id_setor,str.nome;
        `)
      
        return reply.status(200).send(mensagemPadrao(true,'Dados do dashboard carregados!',{
          cards: cardsEvento,
          dash: setoresDash
        }))
    }catch(err:any){
      return reply.status(500).send(mensagemPadrao(false,'Erro inesperado: ' + err.message))
    }
})}
