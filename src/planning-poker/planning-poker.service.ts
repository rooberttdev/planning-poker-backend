import { Injectable, Logger } from '@nestjs/common';
import { Room } from './interfaces/room-interface';
import { v4 as uuid } from 'uuid';
import { Issue } from './interfaces/issues.interface';

@Injectable()
export class PlanningPokerService {
  private readonly logger = new Logger(PlanningPokerService.name);
  private rooms = new Map<string, Room>();
  private cleanupTimer: NodeJS.Timeout;
  constructor() {
    this.logger.log('PlanningPokerService initialized');
    this.cleanupTimer = setInterval(() => {
      this.logger.log(
        `Active rooms: ${this.rooms.size} - IDs: [${[...this.rooms.keys()].join(', ')}]`,
      );
    }, 30000);
    this.cleanupTimer.unref();
  }
  onModuleDestroy() {
    clearInterval(this.cleanupTimer);
  }
  createRoom(moderator: string, roomName?: string): Room {
    const id = uuid();
    const room: Room = {
      id,
      moderator,
      participants: new Set([moderator]),
      currentTask: undefined,
      name: roomName,
      issues: [],
    };
    this.rooms.set(id, room);
    this.logger.log(`Room created: ${id} by ${moderator}`);
    return room;
  }
  getIssues(roomId: string): Issue[] {
    return [...this.getRoom(roomId).issues];
  }

  addIssue(roomId: string, issue: Issue): Issue[] {
    const room = this.getRoom(roomId);
    room.issues.push(issue);
    return [...room.issues];
  }

  updateIssue(roomId: string, issue: Issue): Issue[] {
    const room = this.getRoom(roomId);
    room.issues = room.issues.map((i) => (i.id === issue.id ? issue : i));
    return [...room.issues];
  }
  getRoom(id: string): Room {
    const room = this.rooms.get(id);
    if (!room) {
      this.logger.warn(`Attempt to access non‑existent room ${id}`);
      throw new Error('Sala não encontrada');
    }
    return room;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  joinRoom(id: string, participant: string): Room {
    const room = this.getRoom(id);
    room.participants.add(participant);
    this.logger.log(`${participant} joined room ${id}`);
    return room;
  }

  startRound(id: string, title: string, description?: string) {
    const room = this.getRoom(id);
    room.currentTask = {
      title,
      description,
      votes: new Map(),
      revealed: false,
    };
    this.logger.log(`Round started in ${id}: ${title}`);
    return room.currentTask;
  }

  vote(id: string, participant: string, value: number) {
    const room = this.getRoom(id);
    if (!room.currentTask) {
      this.logger.warn(`Vote attempt before starting round in ${id}`);
      throw new Error('Rodada não iniciada');
    }
    room.currentTask.votes.set(participant, value);
    this.logger.log(`${participant} voted ${value} in ${id}`);
    return room.currentTask;
  }

  revealVotes(id: string) {
    const room = this.getRoom(id);
    if (!room.currentTask) throw new Error('Rodada não iniciada');
    room.currentTask.revealed = true;
    this.logger.log(`Votes revealed in room ${id}`);
    return Array.from(room.currentTask.votes.entries());
  }

  resetRound(id: string) {
    const room = this.getRoom(id);
    if (!room.currentTask) throw new Error('Rodada não iniciada');
    delete room.currentTask;
    this.logger.log(`Round reset in room ${id}`);
  }
  leaveRoom(roomId: string, participant: string): Set<string> {
    const room = this.getRoom(roomId);
    room.participants.delete(participant);
    this.logger.log(`${participant} left room ${roomId}`);
    return room.participants;
  }

  deleteRoom(roomId: string): void {
    this.getRoom(roomId);
    this.rooms.delete(roomId);
    this.logger.log(`Room deleted: ${roomId}`);
  }
}
