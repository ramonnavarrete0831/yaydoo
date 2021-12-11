import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RouterModule, Routes } from "nest-router";

import { TYPEORM_CONFIG } from "./config/typeorm.config";
import { V1Module } from "./v1/v1.module";
import { AuthModule } from "./auth/auth.module";
import { TwoStepVerificationModule } from "./two-step-verification/two-step-verification.module";

const routes: Routes = [
  {
    path: "/v.1",
    children: [V1Module],
  },
];

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONFIG),
    RouterModule.forRoutes(routes),
    AuthModule,
    TwoStepVerificationModule,
    V1Module,
  ],
  providers: [],
})
export class AppModule {}
