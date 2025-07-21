import { Module } from '@nestjs/common';
import { PlanningPokerService } from './planning-poker.service';
import { PlanningPokerGateway } from './planning-poker.gateway';

@Module({
  providers: [PlanningPokerService, PlanningPokerGateway],
})
export class PlanningPokerModule {}
