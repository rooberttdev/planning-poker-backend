import { Module } from '@nestjs/common';
import { PlanningPokerModule } from './planning-poker/planning-poker.module';
import { RoomsController } from './planning-poker/plannimg-pokert.controller';

@Module({
  imports: [PlanningPokerModule],
})
export class AppModule {}
