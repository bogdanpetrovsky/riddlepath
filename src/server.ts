import * as dotenv from 'dotenv';
loadDotEnvConfig();

import { app } from './app';
import * as bodyParser from 'body-parser';
import { sequelize } from "./core/sequelize";
import cors from 'cors';
import passport from "passport";
import session from 'express-session';
import { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { initPassportConfiguration } from "./auth/passport/passport";

import { usersRoutes } from "./users/routes";
import { authRoutes } from "./auth/routes";

function loadDotEnvConfig() {
  const config = dotenv.config();

  if (config.error) {
    throw config.error;
  }
}

export class Server {
  private httpServer: HTTPServer;
  private app: Application;

  private readonly DEFAULT_PORT = process.env.PORT || "5000";

  constructor() {
    this.initialize();
    this.configureApp();
  }

  private initialize(): void {
    this.app = app;
    this.httpServer = createServer(this.app);
    sequelize.instance();
  }

  public listen(callback: (port: string) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }

  private configureApp(): void {
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json({limit: '5mb'}));
    this.app.use(session({ secret: 'anything' }));
    this.app.use(cors({
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", 'Authorization', 'Uppy-Auth-Token'],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: process.env.FRONT_END_URL,
      preflightContinue: false
    }));
    this.app.use(passport.initialize());
    initPassportConfiguration();
    this.app.use(passport.session());
    this.app.use('/users', passport.authenticate('jwt', {session: false}),  usersRoutes);
    this.app.use('/', authRoutes);
  }
}
