import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
// import graphqlHeader from 'express-graphql-header';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import typeDefs from "./src/graphql/typeDefs";
import resolvers from "./src/graphql/resolvers";

const graphqlTools = require('graphql-tools');
const graphqlHeader = require('express-graphql-header');

const app = express();

app.use(cors());

const schema = graphqlTools.makeExecutableSchema({typeDefs, resolvers});

// app.use(function(req:Request, res:Response, next) {

//   const bearerHeader = req.headers['authorization'];
//   const jwt_access_token = bearerHeader ? bearerHeader.replace('Bearer ', '') : null;
//   console.log("🚀 ~ file: server.ts ~ line 28 ~ app.use ~ jwt_access_token", jwt_access_token)
//   if (jwt_access_token) {
//     next();
//   }else{
//     res.sendStatus(401);
//   }
// });

function verifyToken(req:Request, res:Response) {
  const bearerHeader = req.headers['authorization'];
  const jwt_access_token = bearerHeader ? bearerHeader.replace('Bearer ', '') : null;
  console.log("🚀 ~ file: server.ts ~ line 28 ~ app.use ~ jwt_access_token", jwt_access_token)
  if (jwt_access_token) {
    
  }else{
    res.sendStatus(401);
  }
}

const context = (async (req:Request) => {
  const bearerHeader = req.headers['authorization'];
  const jwt_access_token = bearerHeader ? bearerHeader.replace('Bearer ', '') : null;
  console.log("🚀 ~ file: server.ts ~ line 28 ~ app.use ~ jwt_access_token", jwt_access_token)
  // if (jwt_access_token) {
    
  // }else{
  //   res.sendStatus(401);
  // }

  return { jwt_access_token };
});

app.use(
  '/graphql', 
  // graphqlHeader,
  // graphqlHTTP(async (req) => ({
  //   schema: schema,
  //   graphiql: true,
  //   context: await context(req),
  // })),
  graphqlHTTP({
    schema: schema,
    // graphiql: process.env.MODE_DEV === "true" ? true : false,
    graphiql: true,
    // context:context,
  }),
  express.json(),
  bodyParser.json()
);
app.use(express.static('./'))

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