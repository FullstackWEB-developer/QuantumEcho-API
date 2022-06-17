import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
// import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
// import {GraphQLUpload} from "graphql-upload/GraphQLUpload.js";
// 

import typeDefs from "./src/graphql/typeDefs";
import resolvers from "./src/graphql/resolvers";

const graphqlTools = require('graphql-tools');

const app = express();

// const allowedOrigins = ['http://localhost:3000'];
// const options: cors.CorsOptions = {
//   origin: allowedOrigins
// };
// app.use(cors(options));
app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// const root = {
//   Upload: GraphQLUpload,
// };

const schema = graphqlTools.makeExecutableSchema({typeDefs, resolvers});

app.use(
  '/graphql', 
  // graphqlUploadExpress({ maxFileSize: 1024*1000*10, maxFiles: 1 }),
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
  }),
  express.json(),
  // graphqlUploadExpress({maxFieldSize:1024*1000*10, maxFiles:1}),
  bodyParser.json()
  // express.static(`${path.resolve()}/public`)
);
app.use(express.static('./'))

console.log(">>>>", path.resolve());

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