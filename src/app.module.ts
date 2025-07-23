import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './app-auth/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR , APP_FILTER} from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RolesModule } from './app-auth/roles/roles.module';
import { PermissionsModule } from './app-auth/permissions/permissions.module';
import { JwtAuthGuard } from './app-auth/auth/jwt-auth.guard';
import { ThrottlerModule } from "@nestjs/throttler";
import { SavModule } from './modules/sav/sav.module';
import { SpaceshipModule } from './modules/spaceship/spaceship.module';
import { GodadyModule } from './modules/godady/godady.module';
import { DynadotModule } from './modules/dynadot/dynadot.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],

    }),
    SavModule,
    SpaceshipModule,
    GodadyModule,
    DynadotModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    
  ],
   
})
export class AppModule { }
