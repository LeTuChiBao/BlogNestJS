import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, 
    whitelist: true, 
    forbidNonWhitelisted: true, 
  }));
  const config = new DocumentBuilder()
  .setTitle('Blog APIs')
  .setDescription('List APIs for simple Blog by Chi Bao')
  .setVersion('1.0')
  .addTag('Auth')
  .addTag('Users')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  //config folder upload
  app.useStaticAssets(join(__dirname, '../../uploads')); // thêm cho statuc file
  await app.listen(5000);
}
bootstrap();
