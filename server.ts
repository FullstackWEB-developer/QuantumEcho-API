import express from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import typeDefs from "./src/graphql/typeDefs";
import resolvers from "./src/graphql/resolvers";

const graphqlTools = require('graphql-tools');

const app = express();

app.use(cors());

const schema = graphqlTools.makeExecutableSchema({typeDefs, resolvers});

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: schema,
    // graphiql: process.env.MODE_DEV === "true" ? true : false,
    graphiql: true,
  }),
  
  bodyParser.json({
    limit: '50mb'
  }),
  bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }),
);

// app.use(bodyParser.json({limit: 1000 * 1024}))

// app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}));

app.use(express.static('./'));

dotenv.config();

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();