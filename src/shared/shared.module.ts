import { Module, Global } from '@nestjs/common';
import { ResponseService } from '@/utils';
import { JwtStrategy } from '@/strategy';

@Global()
@Module({
  providers: [ResponseService, JwtStrategy],
  exports: [ResponseService, JwtStrategy],
})
export class SharedModule {}
