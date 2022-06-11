
import { gql } from 'apollo-server-express'

const typeDefs = gql`
type Operator{
  _id:ID!
  firstName:String
  lastName:String
  placeOfBirth:String
  dateOfBirth:String  
  contactInfo:ContactInfo
  profileImage:String
  bioSex:Sex
  email:String
  activity:String
  company:String
  store:[Subscription]
  customers:[Customer]
  protocols:[Protocol]
  kingdom:String
  species:String
}

input OperatorInput{
  firstName:String
  lastName:String
  placeOfBirth:String
  dateOfBirth:String  
  contactInfo:ContactInfoInput
  profileImage:String
  bioSex:Sex
  email:String
  activity:String
  company:String
  store:[SubscriptionInput]
  customers:[CustomerInput]
  protocols:[ProtocolInput]
  kingdom:String
  species:String
}

enum Sex {
  male
  female
  other
}  

type Query {
  operatorCount : Int!
  operators:[Operator]
  operator(_id: ID!): Operator
}

type Mutation {

  postOperator(input: OperatorInput): Message!
  
  updateOperator(
    _id:ID!
    input:OperatorInput
  ):Operator

  deleteOperator(_id:ID!):Message!
}

`

export default typeDefs
// module.exports = typeDefs