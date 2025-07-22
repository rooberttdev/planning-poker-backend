import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { PlanningPokerService } from './planning-poker.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { StartRoundDto } from './dtos/start-round.dto';
import { VoteDto } from './dtos/vote.dto';
import { GetRoomInfoDto } from './dtos/get-room-info.dto';

@WebSocketGateway({ cors: true })
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PlanningPokerGateway {
  @WebSocketServer() server: Server;
  private logger = new Logger(PlanningPokerGateway.name);

  constructor(private readonly poker: PlanningPokerService) {}

  @SubscribeMessage('createRoom')
  async handleCreate(
    @MessageBody() dto: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.poker.createRoom(dto.moderator, dto.roomName);
      client.join(room.id);
      client.emit('roomCreated', room);
      this.logger.log(`createRoom → ${room.id}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }
  @SubscribeMessage('getRoomInfo')
  async handleGetRoomInfo(
    @MessageBody() dto: GetRoomInfoDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.poker.getRoom(dto.roomId);
      client.emit('roomInfo', {
        roomId: dto.roomId,
        name: room.name,
        moderator: room.moderator,
        participantCount: room.participants.size,
      });
      this.logger.log(`getRoomInfo → ${dto.roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }
  @SubscribeMessage('joinRoom')
  async handleJoin(
    @MessageBody() dto: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const room = this.poker.joinRoom(dto.roomId, dto.participant);
      client.join(dto.roomId);
      this.server
        .to(dto.roomId)
        .emit('participantJoined', Array.from(room.participants));
      this.logger.log(`joinRoom → ${dto.participant} in ${dto.roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('startRound')
  async handleStart(
    @MessageBody() dto: StartRoundDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const task = this.poker.startRound(
        dto.roomId,
        dto.title,
        dto.description,
      );
      this.server.to(dto.roomId).emit('roundStarted', {
        title: task.title,
        description: task.description,
      });
      this.logger.log(`startRound → ${dto.roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('vote')
  async handleVote(
    @MessageBody() dto: VoteDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const task = this.poker.vote(dto.roomId, dto.participant, dto.value);
      this.server
        .to(dto.roomId)
        .emit('voteReceived', { count: task.votes.size });

      const room = this.poker.getRoom(dto.roomId);
      if (task.votes.size === room.participants.size) {
        const results = this.poker.revealVotes(dto.roomId);
        this.server.to(dto.roomId).emit('votesRevealed', results);
      }
      this.logger.log(`vote → ${dto.participant} in ${dto.roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('revealVotes')
  async handleReveal(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const results = this.poker.revealVotes(roomId);
      this.server.to(roomId).emit('votesRevealed', results);
      this.logger.log(`revealVotes → ${roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }

  @SubscribeMessage('nextRound')
  async handleNext(
    @MessageBody('roomId') roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.poker.resetRound(roomId);
      this.server.to(roomId).emit('roundReset');
      this.logger.log(`nextRound → ${roomId}`);
    } catch (err) {
      client.emit('error', err.message);
    }
  }
}
