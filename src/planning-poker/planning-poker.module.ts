import { Module } from '@nestjs/common';
import { PlanningPokerService } from './planning-poker.service';
import { PlanningPokerGateway } from './planning-poker.gateway';
import { RoomsController } from './plannimg-pokert.controller';

@Module({
  providers: [PlanningPokerService, PlanningPokerGateway],
  controllers: [RoomsController],
})
export class PlanningPokerModule {}
