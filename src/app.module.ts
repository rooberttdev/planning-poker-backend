import { Module } from '@nestjs/common';
import { PlanningPokerModule } from './planning-poker/planning-poker.module';
import { RoomsController } from './planning-poker/plannimg-pokert.controller';
import { PlanningPokerService } from './planning-poker/planning-poker.service';
import { PlanningPokerGateway } from './planning-poker/planning-poker.gateway';

@Module({
  imports: [PlanningPokerModule],
  controllers: [RoomsController],
  providers: [PlanningPokerService, PlanningPokerGateway],
})
export class AppModule {}
