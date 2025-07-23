import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ApiOperation } from '@nestjs/swagger';

import { PlanningPokerService } from './planning-poker.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { StartRoundDto } from './dtos/start-round.dto';
import { VoteDto } from './dtos/vote.dto';
import { CreateIssueDto } from './dtos/create-issue.dto';
import { UpdateIssueDto } from './dtos/update-issue.dto';
import { Issue } from './interfaces/issues.interface';
import { LeaveRoomDto } from './dtos/leave-room.dto';
import { Room } from './interfaces/room-interface';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly poker: PlanningPokerService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as salas' })
  getAll() {
    return this.poker.getAllRooms();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma sala' })
  @HttpCode(HttpStatus.OK)
  getRoom(@Param('id') roomId: string): Room {
    try {
      return this.poker.getRoom(roomId);
    } catch (err) {
      throw new NotFoundException(`Sala ${roomId} não encontrada`);
    }
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova sala' })
  create(@Body() { moderator }: CreateRoomDto) {
    return this.poker.createRoom(moderator);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Entrar em uma sala existente' })
  join(@Param('id') roomId: string, @Body() { participant }: JoinRoomDto) {
    return this.poker.joinRoom(roomId, participant);
  }

  @Post(':id/round')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar uma nova rodada na sala' })
  startRound(@Param('id') roomId: string, @Body() dto: StartRoundDto) {
    return this.poker.startRound(roomId, dto.title, dto.description);
  }

  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar um voto na rodada atual' })
  vote(@Param('id') roomId: string, @Body() dto: VoteDto) {
    return this.poker.vote(roomId, dto.participant, dto.value);
  }

  @Post(':id/reveal')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revelar votos da rodada atual' })
  reveal(@Param('id') roomId: string) {
    return this.poker.revealVotes(roomId);
  }

  @Delete(':id/round')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetar a rodada atual' })
  nextRound(@Param('id') roomId: string) {
    this.poker.resetRound(roomId);
    return { ok: true };
  }

  @Get(':id/issues')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as issues da sala' })
  getIssues(@Param('id') roomId: string): Issue[] {
    return this.poker.getIssues(roomId);
  }

  @Post(':id/issues')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar uma nova issue à sala' })
  addIssue(@Param('id') roomId: string, @Body() dto: CreateIssueDto): Issue[] {
    const newIssue: Issue = {
      id: uuid(),
      title: dto.title,
      description: dto.description,
      status: 'pending',
      createdAt: new Date(),
    };
    return this.poker.addIssue(roomId, newIssue);
  }

  @Put(':id/issues/:issueId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar uma issue existente' })
  updateIssue(
    @Param('id') roomId: string,
    @Param('issueId') issueId: string,
    @Body() dto: UpdateIssueDto,
  ): Issue[] {
    const issues = this.poker.getIssues(roomId);
    const existing = issues.find((i) => i.id === issueId);
    if (!existing) {
      throw new NotFoundException(`Issue ${issueId} não encontrada`);
    }

    const updated: Issue = {
      ...existing,
      ...dto,
      id: issueId,
      createdAt: existing.createdAt,
      votes: existing.votes,
      result: existing.result,
    };

    return this.poker.updateIssue(roomId, updated);
  }
  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Participante sai da sala' })
  leaveRoom(
    @Param('id') roomId: string,
    @Body() { participant }: LeaveRoomDto,
  ): string[] {
    return Array.from(this.poker.leaveRoom(roomId, participant));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar sala' })
  deleteRoom(@Param('id') roomId: string): void {
    this.poker.deleteRoom(roomId);
  }
}
