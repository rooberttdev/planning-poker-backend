# 🃏 Planning Poker Backend

Backend da aplicação Planning Poker, desenvolvido com NestJS, com suporte a REST API e comunicação em tempo real via WebSockets. Acesse ao Swagger : ttps://planning-poker-backend-api.fly.dev/api

---

## Pré-requisitos

- Node.js (versão 18 ou superior)
- NestJS CLI (opcional)
  ```bash
  npm install -g @nestjs/cli
  ```

## Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:

```bash
npm install
```

## Executar a aplicação local

1. Execute o comando:

```bash
ng serve
```
## Acesse a documentação Swagger

[![Swagger](https://img.shields.io/badge/Swagger-API-blue)](https://planning-poker-backend-api.fly.dev/api)

1. Abra a documentação interativa em: `https://planning-poker-backend-api.fly.dev/api`
2. Link da API `https://planning-poker-backend-api.fly.dev`

## Estrutura do Projeto

```
src/
├── dtos/                       # DTOs para validação
├── interfaces/                 # Interfaces de tipos
├── planning-poker.gateway.ts   # Gateway WebSocket
├── planning-poker.service.ts   # Lógica de negócio
├── rooms.controller.ts         # Endpoints REST
└── main.ts                     # Bootstrap da aplicação

```

## Endpoints REST

```
| Método  | Rota                          | Descrição                                  |
| ------- | ----------------------------- | ------------------------------------------ |
| GET     | `/rooms`                      | Lista todas as salas                       |
| POST    | `/rooms`                      | Cria uma nova sala                         |
| GET     | `/rooms/:id`                  | Detalhes de uma sala                       |
| POST    | `/rooms/:id/join`             | Entrar em uma sala                         |
| POST    | `/rooms/:id/round`            | Iniciar uma rodada                         |
| POST    | `/rooms/:id/vote`             | Registrar um voto                          |
| POST    | `/rooms/:id/reveal`           | Revelar os votos da rodada                 |
| DELETE  | `/rooms/:id/round`            | Resetar a rodada atual                     |
| GET     | `/rooms/:id/issues`           | Listar todas as issues da sala             |
| POST    | `/rooms/:id/issues`           | Adicionar uma nova issue à sala            |
| PUT     | `/rooms/:id/issues/:issueId`  | Atualizar uma issue existente              |
| DELETE  | `/rooms/:id`                  |  Deletar a sala                            |

```

## Eventos WebSocket

1. Eventos enviados pelo cliente

```
| Evento         | Payload                                                       | Descrição                                    |
| -------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `createRoom`   | `{ moderator: string; roomName?: string }`                    | Cria uma nova sala                           |
| `getRoomInfo`  | `{ roomId: string }`                                          | Busca dados da sala (nome, moderador…)       |
| `joinRoom`     | `{ roomId: string; participant: string }`                     | Entra em uma sala                            |
| `startRound`   | `{ roomId: string; title: string; description?: string }`     | Inicia uma nova rodada                       |
| `vote`         | `{ roomId: string; participant: string; value: number }`      | Envia um voto                                |
| `revealVotes`  | `{ roomId: string }`                                          | Revela todos os votos da rodada              |
| `nextRound`    | `{ roomId: string }`                                          | Reseta a rodada atual (próxima rodada)       |
| `getIssues`    | `{ roomId: string }`                                          | Sincroniza lista de issues da sala           |
| `issueUpdate`  | `{ roomId: string; action: 'added'|'updated'; issue: Issue }` | Dispara quando uma issue é criada ou editada |
| `leaveRoom`    | `{ roomId: string; participant: string }`                     | Remove participante da sala                  |
| `endRoom`      | `{ roomId: string }`                                          | Encerra a sala e desconecta todos            |

```

2.  Eventos emitidos pelo servidor

```
| Evento              | Payload                      |
| ------------------- | ---------------------------- |
| `roomCreated`       | `Room`                       |
| `participantJoined` | `string[]` (participantes)   |
| `roundStarted`      | `{ title, description }`     |
| `voteReceived`      | `{ count }`                  |
| `votesRevealed`     | `Array<[participant, vote]>` |
| `roundReset`        | `void`                       |

```

## Funcionalidades

- ✅ Criar e gerenciar salas
- ✅ Entrar em salas existentes
- ✅ Votação em tempo real via WebSocket
- ✅ Rodadas com reset e revelação de votos
- ✅ Moderador e participantes
- ✅ Integração com frontend Angular

## Tecnologias Utilizadas

- NestJS
- TypeScript
- Socket.IO
- uuid
- WebSockets

## TODO

- Persistência em banco de dados
- Autenticação e autorização
- Deploy em cloud
- Testes unitários e e2e
## Decisões Técnicas

- NestJS + Socket.IO
  Uso de @nestjs/platform-socket.io para gateway WebSocket, garantindo escalabilidade e hooks de ciclo de vida.

- UUID v4
  Identificadores únicos de sala (uuid), sem colisões mesmo em múltiplas instâncias.

- In-memory state
  Armazenamento de salas e votos em memória para simplicidade.

- Swagger
  Documentação automática via @nestjs/swagger, acessível em /api.

- DTOs + class-validator
  Garantia de payloads válidos antes de processar lógicas de negócio.

- Modularização
  Separação clara entre camada REST (rooms.controller), camada de negócio (rooms.service) e WebSocket (poker.gateway).

- Deploy no Fly.io

```
 Imagem Docker declarada em Dockerfile
 CI/CD automático via GitHub Actions / Fly CLI
```
