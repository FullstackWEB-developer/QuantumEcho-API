

const typeDefs = `
type Protocol {
    _id:ID!
    coordinator:String
    teamOperators:[String]
    protocolName:String
    createdDate:String
}
input ProtocolInput {
    coordinator:String!
    teamOperators:[String]
    protocolName:String
}

type Query {
    protocolCount : Int!
    protocols(input:ProtocolInput, sort:String):[Protocol]
    protocol(_id: ID!): Protocol
  }
  
  type Mutation {
  
    postProtocol(input: ProtocolInput): Message!
    
    updateProtocol(
      _id:ID!
      input:ProtocolInput
    ):Protocol
  
    deleteProtocol(_id:ID!):Message!
  }
  
`

export default typeDefs;