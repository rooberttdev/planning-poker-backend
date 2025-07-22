# 🃏 Planning Poker Backend

Backend da aplicação Planning Poker, desenvolvido com NestJS, com suporte a REST API e comunicação em tempo real via WebSockets.

---

## 🚀 Pré-requisitos

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

1. Acesse ao Swagger `https://planning-poker-backend-api.fly.dev/api`

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
| Método | Rota                | Descrição                  |
| ------ | ------------------- | -------------------------- |
| GET    | `/rooms`            | Lista todas as salas       |
| POST   | `/rooms`            | Cria uma nova sala         |
| GET    | `/rooms/:id`        | Detalhes de uma sala       |
| POST   | `/rooms/:id/join`   | Entrar em uma sala         |
| POST   | `/rooms/:id/round`  | Iniciar uma rodada         |
| POST   | `/rooms/:id/vote`   | Registrar um voto          |
| POST   | `/rooms/:id/reveal` | Revelar os votos da rodada |
| DELETE | `/rooms/:id/round`  | Resetar a rodada atual     |


```

## Eventos WebSocket

1. Eventos enviados pelo cliente

```
| Evento        | Payload                               |
| ------------- | ------------------------------------- |
| `createRoom`  | `{ moderator, teamName, cards, id? }` |
| `joinRoom`    | `{ roomId, participant }`             |
| `startRound`  | `{ roomId, title, description? }`     |
| `vote`        | `{ roomId, participant, value }`      |
| `revealVotes` | `{ roomId }`                          |
| `nextRound`   | `{ roomId }`                          |

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
- 
## TODO

- Persistência em banco de dados
- Autenticação e autorização
- Deploy em cloud
- Testes unitários e e2e
