import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBModule } from '@/extra';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailsModule } from './modules/mails/mails.module';
import { JwtService } from '@nestjs/jwt';
import { AuthMiddleware } from './middlewares';
import { SharedModule } from './shared';
import { securePaths } from './utils';

@Module({
  imports: [SharedModule, UsersModule, DBModule, AuthModule, MailsModule],
  controllers: [],
  providers: [JwtService],
  exports: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...securePaths);
  }
}
