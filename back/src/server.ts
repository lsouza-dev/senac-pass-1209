import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { usuarioRoutes } from './routes/UsuarioRoutes'
import { eventoRoutes } from './routes/EventoRoutes'
import { setorRoutes } from './routes/SetorRoutes'
import { clienteRoutes } from './routes/ClienteRoutes'
import { reservaRoutes } from './routes/ReservaRoutes'
import { perfilRoutes } from './routes/PerfilRoutes'
import { dashboardRoutes } from './routes/DashboardRoutes'


(BigInt.prototype as any).toJSON = function(){
  return Number(this)
}
const server = fastify()
server.register(fastifyCors,{
  origin:"*",
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
})

server.register(usuarioRoutes,{
  prefix:'/api/usuarios'
})
server.register(perfilRoutes,{
  prefix:'/api/perfis'
})

server.register(eventoRoutes,{
  prefix:'/api/eventos'
})

server.register(setorRoutes,{
  prefix:'/api/setores'
})
server.register(clienteRoutes,{
  prefix:'/api/clientes'
})
server.register(reservaRoutes,{
  prefix:'/api/reservas'
})
server.register(dashboardRoutes,{
  prefix:'/api/dashboard'
})

server.listen({port:3333}).then(() => console.log('Servidor em execução:\nhttp://localhost:3333/'))