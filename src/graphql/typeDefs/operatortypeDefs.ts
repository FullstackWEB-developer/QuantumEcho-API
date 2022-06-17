
const typeDefs = `
type Operator{
  _id:ID!
  username:String!
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
  # store:[String]
  # customers:[String]
  # protocols:[String]
}

input OperatorInput{
  username:String
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
  # store:[String]
  # customers:[String]
  # protocols:[String]
}

enum Sex {
  male
  female
  other
}  

type Query {
  operatorCount : Int!
  operators:[Operator]
  operator(username: String!): Operator
}

type Mutation {

  postOperator(input: OperatorInput): Message!
  
  updateOperator(
    username:String!
    input:OperatorInput
  ):Operator

  deleteOperator(username:String!):Message!
}

`

export default typeDefs;