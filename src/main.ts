import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { UserSeeder } from './modules/users/user.seed';
import cookieParser from "cookie-parser";
import { setupSwagger } from "./shared/configurations/swagger.config";
import { PermissionSeederService } from './app-auth/permissions/permissions.seed';
import { RoleSeeder } from './app-auth/roles/roles.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.setGlobalPrefix("api/v1", { exclude: [''] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true ,// nếu truyền input không có thì trả lỗi
    transform: true,
    transformOptions: {
    enableImplicitConversion: true, 
  },
  }));
  app.use(cookieParser());
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  });
// Seeder cho Role
  
  const permissionSeeder = app.get(PermissionSeederService);
  await permissionSeeder.seedPermissions();
  const roleSeeder = app.get(RoleSeeder);
  await roleSeeder.seed();  
  const userSeeder = app.get(UserSeeder);
  await userSeeder.seed();
  
  const serveStatic = require('serve-static');
  app.use('/src/public', serveStatic('src/public'));

  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
