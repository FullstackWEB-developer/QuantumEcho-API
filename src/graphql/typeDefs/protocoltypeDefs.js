import { gql } from 'apollo-server-express'

const typeDefs = gql`
type Protocol {
    _id:ID!
    coordinator:Operator
    teamOperators:[Operator]
    protocolName:String
}
input ProtocolInput {
    coordinator:OperatorInput
    teamOperators:[OperatorInput]
    protocolName:String
}

type Query {
    protocolCount : Int!
    protocols:[Protocol]
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

export default typeDefs
// module.exports = typeDefs