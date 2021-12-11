import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import passport = require("passport");
import { join } from "path";
import express = require("express");

import { AppModule } from "./app.module";
import { JWT_SECRET } from "./config/app.config";
import { JwtPayload } from "./auth/jwt-payload.interface";

async function bootstrap() {
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create(AppModule,{
    //logger: ['error', 'warn'],
  });
  //'error', 'warn', 'debug', and 'verbose' 
  passport.use(
    "basic-user",
    new Strategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
      },
      async function(payload: JwtPayload, done) {
        return done(null, 1);
      }
    )
  );

  app.use("/private", [
    passport.authenticate(["basic-user"], { session: false }),
    express.static(join(__dirname, "..", "private")),
  ]);

  app.use("/public", express.static(join(__dirname, "..", "public")));

  const port = 8301;
  app.enableCors();
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
