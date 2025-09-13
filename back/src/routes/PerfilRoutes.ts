import { FastifyInstance } from "fastify";
import { obterPerfis } from "../controllers/PerfilController";


export async function perfilRoutes(server:FastifyInstance) {
  server.get('',obterPerfis)
}