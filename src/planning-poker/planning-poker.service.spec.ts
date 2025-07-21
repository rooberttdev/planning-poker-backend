import { Test, TestingModule } from '@nestjs/testing';
import { PlanningPokerService } from './planning-poker.service';

describe('PlanningPokerService', () => {
  let service: PlanningPokerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningPokerService],
    }).compile();

    service = module.get<PlanningPokerService>(PlanningPokerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createRoom() deve gerar uma sala com id e moderator corretos', () => {
    const room = service.createRoom('Alice');
    expect(room.id).toBeDefined();
    expect(room.moderator).toBe('Alice');
    expect(room.participants.size).toBe(0);
    expect(room.currentTask).toBeUndefined();
  });

  it('joinRoom() deve adicionar participante', () => {
    const room = service.createRoom('Alice');
    const updated = service.joinRoom(room.id, 'Bob');
    expect(Array.from(updated.participants)).toContain('Bob');
  });

  it('startRound() deve inicializar currentTask corretamente', () => {
    const room = service.createRoom('Alice');
    const task = service.startRound(room.id, 'Test Title', 'Test Desc');
    expect(task.title).toBe('Test Title');
    expect(task.description).toBe('Test Desc');
    expect(task.votes.size).toBe(0);
    expect(task.revealed).toBe(false);
  });

  it('vote() deve registrar voto de participante', () => {
    const room = service.createRoom('Alice');
    service.joinRoom(room.id, 'Bob');
    service.startRound(room.id, 'T1');
    const task = service.vote(room.id, 'Bob', 5);
    expect(task.votes.get('Bob')).toBe(5);
  });

  it('revealVotes() deve marcar revealed e retornar votos', () => {
    const room = service.createRoom('Alice');
    service.joinRoom(room.id, 'Bob');
    service.startRound(room.id, 'T1');
    service.vote(room.id, 'Bob', 8);
    const results = service.revealVotes(room.id);
    expect(results).toEqual([['Bob', 8]]);
  });

  it('resetRound() deve limpar currentTask', () => {
    const room = service.createRoom('Alice');
    service.startRound(room.id, 'T1');
    service.resetRound(room.id);
    expect(service.getRoom(room.id).currentTask).toBeUndefined();
  });
});
