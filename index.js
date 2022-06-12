// const { ApolloServer, gql } = require('apollo-server-express');
import {ApolloServer} from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
// require('dotenv').config();

import resolvers from './src/resolvers.js';
import typeDefs from './src/typeDefs.js';

const app = express();

app.use(
  cors(),
  express.json(),
  graphqlUploadExpress({maxFieldSize:1024*1000*10, maxFiles:1}),
  bodyParser.json()
);
// app.use(express.json());
// app.use(graphqlUploadExpress({maxFieldSize:1024*1000*10, maxFiles:1}));
// app.use(bodyParser.urlencoded({ extended: false }))

dotenv.config();

const httpServer = http.createServer(app);

const startApolloServer = async(app, httpServer) => {

  const MONGO_DB = process.env.MONGO_URL
  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true}
  )
  const db = client.db()
  // const context = {db}

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context:({req}) => {
      // const access_token = req.headers.authorization || '';
      // if (access_token !== '') {
      //   throw new AuthenticationError('you must be logged in');
      // }else{

      // }
      return {db, req}
    },
    uploads: {maxFieldSize:10000},
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
  );
}

startApolloServer(app, httpServer);

export default httpServer
// module.exports = httpServer


