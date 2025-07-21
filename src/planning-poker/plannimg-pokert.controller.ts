import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PlanningPokerService } from './planning-poker.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JoinRoomDto } from './dtos/join-room.dto';
import { StartRoundDto } from './dtos/start-round.dto';
import { VoteDto } from './dtos/vote.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly poker: PlanningPokerService) {}

  @Get()
  getAll() {
    return this.poker.getAllRooms();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() { moderator }: CreateRoomDto) {
    return this.poker.createRoom(moderator);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  join(@Param('id') roomId: string, @Body() { participant }: JoinRoomDto) {
    return this.poker.joinRoom(roomId, participant);
  }

  @Post(':id/round')
  startRound(@Param('id') roomId: string, @Body() dto: StartRoundDto) {
    return this.poker.startRound(roomId, dto.title, dto.description);
  }

  @Post(':id/vote')
  vote(@Param('id') roomId: string, @Body() dto: VoteDto) {
    return this.poker.vote(roomId, dto.participant, dto.value);
  }

  @Post(':id/reveal')
  reveal(@Param('id') roomId: string) {
    return this.poker.revealVotes(roomId);
  }

  @Delete(':id/round')
  nextRound(@Param('id') roomId: string) {
    this.poker.resetRound(roomId);
    return { ok: true };
  }
}
