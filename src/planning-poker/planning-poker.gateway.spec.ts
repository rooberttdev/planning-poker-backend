import { Test, TestingModule } from '@nestjs/testing';
import { PlanningPokerGateway } from './planning-poker.gateway';
import { PlanningPokerService } from './planning-poker.service';
import { Server } from 'socket.io';

describe('PlanningPokerGateway', () => {
  let gateway: PlanningPokerGateway;
  let service: PlanningPokerService;

  const fakeService = {
    createRoom: jest.fn(),
    getRoom: jest.fn(),
    joinRoom: jest.fn(),
    startRound: jest.fn(),
    vote: jest.fn(),
    revealVotes: jest.fn(),
    resetRound: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanningPokerGateway,
        { provide: PlanningPokerService, useValue: fakeService },
      ],
    }).compile();

    gateway = module.get<PlanningPokerGateway>(PlanningPokerGateway);
    service = module.get<PlanningPokerService>(PlanningPokerService);

    gateway.server = { to: () => ({ emit: jest.fn() }) } as unknown as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('handleCreate deve chamar service.createRoom e emitir roomCreated', () => {
    const client = { join: jest.fn(), emit: jest.fn() } as any;
    fakeService.createRoom.mockReturnValue({
      id: '123',
      moderator: 'Alice',
      participants: new Set(),
      name: 'Teste Planning',
    });

    gateway.handleCreate(
      { moderator: 'Alice', roomName: 'Teste Planning' },
      client,
    );

    expect(service.createRoom).toHaveBeenCalledWith('Alice', 'Teste Planning');
    expect(client.emit).toHaveBeenCalledWith(
      'roomCreated',
      expect.objectContaining({ id: '123' }),
    );
  });
});
