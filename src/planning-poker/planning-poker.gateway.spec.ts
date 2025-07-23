import { Test, TestingModule } from '@nestjs/testing';
import { PlanningPokerGateway } from './planning-poker.gateway';
import { PlanningPokerService } from './planning-poker.service';
import { Server, Socket } from 'socket.io';

type AnyObject = Record<string, any>;

describe('PlanningPokerGateway', () => {
  let gateway: PlanningPokerGateway;
  let service: PlanningPokerService;
  let mockServer: any;

  const mockService = {
    createRoom: jest.fn(),
    joinRoom: jest.fn(),
    getRoom: jest.fn(),
    startRound: jest.fn(),
    vote: jest.fn(),
    revealVotes: jest.fn(),
    resetRound: jest.fn(),
    addIssue: jest.fn(),
    updateIssue: jest.fn(),
    getIssues: jest.fn(),
    leaveRoom: jest.fn(),
    deleteRoom: jest.fn(),
  };

  beforeEach(async () => {
    mockServer = {
      to: jest.fn().mockReturnValue({ emit: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanningPokerGateway,
        { provide: PlanningPokerService, useValue: mockService },
      ],
    }).compile();

    gateway = module.get<PlanningPokerGateway>(PlanningPokerGateway);
    service = module.get<PlanningPokerService>(PlanningPokerService);
    gateway.server = mockServer as Server;
  });

  function makeClient(): Socket & AnyObject {
    return {
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
    } as any;
  }

  it('handleCreate → calls createRoom, joinRoom and emits roomCreated', async () => {
    const client = makeClient();
    const fakeRoom = { id: 'r1', participants: new Set(['M']), issues: [] };
    mockService.createRoom.mockReturnValue(fakeRoom);
    mockService.joinRoom.mockReturnValue(fakeRoom);

    await gateway.handleCreate({ moderator: 'M', roomName: 'R' }, client);

    expect(service.createRoom).toHaveBeenCalledWith('M', 'R');
    expect(service.joinRoom).toHaveBeenCalledWith('r1', 'M');
    expect(client.emit).toHaveBeenCalledWith('roomCreated', fakeRoom);
    expect(mockServer.to).toHaveBeenCalledWith('r1');
  });

  it('handleJoin → calls joinRoom and notifies room', async () => {
    const client = makeClient();
    const fakeRoom = {
      id: 'r1',
      participants: new Set(['A', 'B']),
      issues: [],
    };
    mockService.joinRoom.mockReturnValue(fakeRoom);

    await gateway.handleJoin({ roomId: 'r1', participant: 'B' }, client);
    expect(service.joinRoom).toHaveBeenCalledWith('r1', 'B');
    expect(mockServer.to).toHaveBeenCalledWith('r1');
  });

  it('handleStart → broadcasts roundStarted on success', async () => {
    const client = makeClient();
    mockService.startRound.mockReturnValue({ title: 'T', description: 'D' });

    await gateway.handleStart(
      { roomId: 'r1', title: 'T', description: 'D' },
      client,
    );
    expect(service.startRound).toHaveBeenCalledWith('r1', 'T', 'D');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('roundStarted', {
      title: 'T',
      description: 'D',
    });
  });

  it('handleVote → counts votes, notifies and auto-reveals', async () => {
    const client = makeClient();
    mockService.vote.mockReturnValue({ votes: new Map([['P', 5]]) });
    mockService.getRoom.mockReturnValue({
      participants: new Set(['P']),
      currentTask: { votes: new Map([['P', 5]]), revealed: false },
    });
    mockService.revealVotes.mockReturnValue([['P', 5]]);

    await gateway.handleVote(
      { roomId: 'r1', participant: 'P', value: 5 },
      client,
    );

    expect(service.vote).toHaveBeenCalledWith('r1', 'P', 5);

    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('voteReceived', {
      count: 1,
    });
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('participantVoted', {
      participant: 'P',
    });

    expect(service.revealVotes).toHaveBeenCalledWith('r1');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('votesRevealed', [
      ['P', 5],
    ]);
  });

  it('handleReveal → emits votesRevealed', async () => {
    mockService.revealVotes.mockReturnValue([['P', 8]]);
    await gateway.handleReveal('r1', makeClient());
    expect(service.revealVotes).toHaveBeenCalledWith('r1');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('votesRevealed', [
      ['P', 8],
    ]);
  });

  it('handleNext → emits roundReset', async () => {
    await gateway.handleNext('r1', makeClient());
    expect(service.resetRound).toHaveBeenCalledWith('r1');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('roundReset');
  });

  it('handleIssueUpdate → routes to add or update then emits', () => {
    const data = { roomId: 'r1', action: 'added', issue: { id: 'i1' } };
    gateway.handleIssueUpdate(data);
    expect(service.addIssue).toHaveBeenCalledWith('r1', data.issue);
    expect(mockServer.to).toHaveBeenCalledWith('r1');
  });

  it('handleGetIssues → emits syncIssues', () => {
    const client = makeClient();
    mockService.getIssues.mockReturnValue([{ id: 'i1' }]);
    gateway.handleGetIssues('r1', client);
    expect(service.getIssues).toHaveBeenCalledWith('r1');
    expect(client.emit).toHaveBeenCalledWith('syncIssues', [{ id: 'i1' }]);
  });

  it('handleLeave → emits updated participant list', () => {
    const client = makeClient();
    mockService.leaveRoom.mockReturnValue(new Set(['A']));
    gateway.handleLeave({ roomId: 'r1', participant: 'B' }, client);
    expect(service.leaveRoom).toHaveBeenCalledWith('r1', 'B');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('participantJoined', [
      'A',
    ]);
  });

  it('handleEnd → notifies and deletes room', () => {
    gateway.handleEnd('r1');
    expect(mockServer.to('r1').emit).toHaveBeenCalledWith('roomEnded');
    expect(service.deleteRoom).toHaveBeenCalledWith('r1');
  });
});
