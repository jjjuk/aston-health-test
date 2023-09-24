declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

export type JwtPayload = {
  id: number;
  isAdmin: boolean;
};
