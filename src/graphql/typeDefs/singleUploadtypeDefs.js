import { gql } from 'apollo-server-express'

const typeDefs = gql`

  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    otherFields: Boolean!
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

export default typeDefs
// module.exports = typeDefs