// Updated 

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./auth.strategy";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [
    ConfigModule, // to use config service and load .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' }, // or your desired expiry
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}


// Backdated

// import { Module } from "@nestjs/common";
// import { AuthService } from "./auth.service";
// import { AuthController } from "./auth.controller";
// import { JwtModule } from "@nestjs/jwt";
// import { AccessTokenStrategy, RefreshTokenStrategy } from "./auth.strategy";
// import { DatabaseModule } from "../database/database.module";

// @Module({
//   imports: [JwtModule.register({}), DatabaseModule],
//   controllers: [AuthController],
//   providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
// })
// export class AuthModule {}

