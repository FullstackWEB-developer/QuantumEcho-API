
const typeDefs = `

  type File {
    filePath: String!
  }

  type Query {
    otherFields: Boolean!    
  }

  type Mutation {
    singleUpload(base64Str: String!, username:String!, filename:String!, type:String!): File!    
  }
`;

export default typeDefs;