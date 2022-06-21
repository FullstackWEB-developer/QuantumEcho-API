
const typeDefs = `
type Operator{
  _id:ID!
  operatorId:String!
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
  kingdom:String
  species:String
  store:[Subscrib]
  customers:[Customer]
  protocols:[Protocol]
}

input OperatorInput{
  operatorId:String!
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
  kingdom:String
  species:String
  store:[String]
  customers:[String]
  protocols:[String]
}

enum Sex {
  male
  female
  other
}  

type Query {
  operatorCount : Int!
  operators:[Operator]
  operator(operatorId: String!): Operator
}

type Mutation {

  postOperator(input: OperatorInput): Message!
  
  updateOperator(
    operatorId:String!
    input:OperatorInput
  ):Operator

  deleteOperator(operatorId:String!):Message!
}

`

export default typeDefs;