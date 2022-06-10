const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const {MongoClient } = require('mongodb');
require('dotenv').config();

const start = async () => {

  const MONGO_DB = process.env.URL
  const client = await MongoClient.connect(
    MONGO_DB,
    { useNewUrlParser: true, useUnifiedTopology: true}
  )
  const db = client.db()
  const context = {db}

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}
start()


