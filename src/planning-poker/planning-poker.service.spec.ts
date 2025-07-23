import { Test, TestingModule } from '@nestjs/testing';
import { PlanningPokerService } from './planning-poker.service';
import { Room } from './interfaces/room-interface';

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

  describe('#createRoom()', () => {
    it('creates a new room with an id, moderator and no currentTask', () => {
      const room = service.createRoom('Alice', 'My Room');
      expect(room.id).toBeDefined();
      expect(room.moderator).toBe('Alice');
      expect(room.name).toBe('My Room');
      expect(Array.from(room.participants)).toEqual(['Alice']);
      expect(room.currentTask).toBeUndefined();
      expect(room.issues).toEqual([]);
    });
  });

  describe('#getRoom() / #getAllRooms()', () => {
    it('retrieves a previously created room and lists all rooms', () => {
      const r1 = service.createRoom('A');
      const r2 = service.createRoom('B');
      expect(service.getRoom(r1.id)).toEqual(r1);
      expect(
        service
          .getAllRooms()
          .map((r) => r.id)
          .sort(),
      ).toEqual([r1.id, r2.id].sort());
    });

    it('throws when room does not exist', () => {
      expect(() => service.getRoom('does-not-exist')).toThrow(
        'Sala não encontrada',
      );
    });
  });

  describe('#joinRoom()', () => {
    it('adds a participant to the room', () => {
      const room = service.createRoom('Alice');
      const updated = service.joinRoom(room.id, 'Bob');
      expect(Array.from(updated.participants)).toContain('Bob');
    });

    it('throws if the room does not exist', () => {
      expect(() => service.joinRoom('xxx', 'Bob')).toThrow(
        'Sala não encontrada',
      );
    });
  });

  describe('#startRound(), #vote(), #revealVotes(), #resetRound()', () => {
    let room: Room;

    beforeEach(() => {
      room = service.createRoom('Mod');
      service.joinRoom(room.id, 'P1');
      service.joinRoom(room.id, 'P2');
    });

    it('startRound initializes currentTask', () => {
      const task = service.startRound(room.id, 'T1', 'Desc');
      expect(task).toMatchObject({
        title: 'T1',
        description: 'Desc',
        revealed: false,
      });
      expect(task.votes.size).toBe(0);
    });

    it('vote records votes and increments map size', () => {
      service.startRound(room.id, 'T1');
      service.vote(room.id, 'P1', 3);
      service.vote(room.id, 'P2', 5);
      const t = service.getRoom(room.id).currentTask!;
      expect(t.votes.get('P1')).toBe(3);
      expect(t.votes.get('P2')).toBe(5);
      expect(t.votes.size).toBe(2);
    });

    it('vote before startRound throws', () => {
      expect(() => service.vote(room.id, 'P1', 1)).toThrow(
        'Rodada não iniciada',
      );
    });

    it('revealVotes flips revealed flag and returns entries', () => {
      service.startRound(room.id, 'T1');
      service.vote(room.id, 'P1', 8);
      const results = service.revealVotes(room.id);
      expect(results).toEqual([['P1', 8]]);
      expect(service.getRoom(room.id).currentTask!.revealed).toBe(true);
    });

    it('resetRound removes currentTask', () => {
      service.startRound(room.id, 'T1');
      service.resetRound(room.id);
      expect(service.getRoom(room.id).currentTask).toBeUndefined();
    });
  });

  describe('#leaveRoom() & #deleteRoom()', () => {
    it('leaveRoom removes a participant', () => {
      const room = service.createRoom('Mod');
      service.joinRoom(room.id, 'P');
      const remaining = service.leaveRoom(room.id, 'P');
      expect(Array.from(remaining)).not.toContain('P');
    });

    it('deleteRoom removes it entirely', () => {
      const room = service.createRoom('Mod');
      service.deleteRoom(room.id);
      expect(() => service.getRoom(room.id)).toThrow();
    });
  });
});
