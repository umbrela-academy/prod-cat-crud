# Problems

- No keycloak-connect usage
- No fastify middleware for openid-client
- Fastify session support seems cumbersome as compared to that of express (?)

# Admin Endpoints

```shell
npm install @keycloak/keycloak-admin-client
```

See https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_identity_providers_resource

# Auth Endpoints

```shell
npm install openid-client
```

```javascript
//discover issuer's metadata
import { Issuer } from 'openid-client';

const issuer = await Issuer.discover('https://auth-server-url.with-realm');

const client = new issuer.Client({
  client_id: 'zELcpfANLqY7Oqas',
  client_secret:
    'TQV5U29k1gHibH5bx1layBo0OSAvAbRT3UYW3EWrSYBB5swxjVfWUa1BS8lqzxG/0v9wruMcrGadany3',
  redirect_uris: ['http://localhost:3000/cb'],
  response_types: ['code'],
  // id_token_signed_response_alg (default "RS256")
  // token_endpoint_auth_method (default "client_secret_basic")
});
```

See https://github.com/melikhov-dev/nest-openid-client-passport

# Passport steps

See https://www.passportjs.org/concepts/authentication/downloads/html/
