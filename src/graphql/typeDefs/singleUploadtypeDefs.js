import { gql } from 'apollo-server-express'

const typeDefs = gql`

  scalar Upload

  type File {
    filename: String!
  }

  type Query {
    otherFields: Boolean!
  }

  type Mutation {
    singleUpload(base64Str: String!, _id:String!, filename:String!, type:String!): File!
  }
`;

export default typeDefs
// module.exports = typeDefs