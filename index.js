const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');
const express = require('express');
const cors = require('cors');

const {MongoClient } = require('mongodb');
require('dotenv').config();

const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const startApolloServer = async(app, httpServer) => {

  const MONGO_DB = process.env.MONGO_URL
  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true}
  )
  const db = client.db()
  const context = {db}

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer(app, httpServer);

module.exports = httpServer


