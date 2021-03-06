import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe)
  app.useGlobalInterceptors(new TransformInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Tasks example')
    .setDescription('The Tasks API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 3000
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
