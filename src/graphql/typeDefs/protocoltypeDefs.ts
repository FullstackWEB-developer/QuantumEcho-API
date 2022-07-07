

const typeDefs = `
type Protocol {
    _id:ID
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

type ProtocolResult{
  lists:[Protocol]
  totalCount:Int
  perCount:Int
}

type Query {
    protocolCount : Int!
    protocols(condition:ProtocolInput, pageNum:Int):ProtocolResult
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