import helmet from 'helmet';
import compression from 'compression';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenv } from 'dotenv';
import { config, swaggerConfig } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@/utils';
import { ValidationPipe } from '@nestjs/common/pipes';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { HttpExceptionFilter } from './decorators';
dotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: Logger.logger,
  });

  app.enableCors();
  app.use(
    helmet({
      contentSecurityPolicy: false,
      xssFilter: true,
    }),
  );
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(
    // new QueryFailedFilter(reflector),
    new HttpExceptionFilter(reflector),
  );

  app.setGlobalPrefix(config().prefix);

  const swaggerDocument = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .setLicense(swaggerConfig.license, swaggerConfig.licenseUrl)
    .setContact(
      swaggerConfig.contact,
      swaggerConfig.contact,
      swaggerConfig.contact,
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup(swaggerConfig.path, app, document);

  await app.listen(config().port);
}
bootstrap();
