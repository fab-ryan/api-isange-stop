import { Module } from '@nestjs/common';
import { DBModule } from '@/extra';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, DBModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
