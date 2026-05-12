type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

export default {
  fetch(request: Request, env: Env) {
    return env.ASSETS.fetch(request);
  },
} satisfies { fetch(request: Request, env: Env): Promise<Response> };
