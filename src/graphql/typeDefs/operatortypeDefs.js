
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
  bioSex:String
  email:String
  activity:String
  company:String
  store:[String]
  customers:[String]
  protocols:[String]
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
  bioSex:String
  email:String
  activity:String
  company:String
  store:[String]
  customers:[String]
  protocols:[String]
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