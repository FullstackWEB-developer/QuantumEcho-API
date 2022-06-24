
const typeDefs = `

  type File {
    filePath: String!
  }

  type Query {
    otherFields: Boolean!    
  }

  type Mutation {
    singleUpload(base64Str: String!, id:String!, filename:String!, type:String!): File!    
  
    deleteFile(imgPath:String!):Message!
  }

`;

export default typeDefs;