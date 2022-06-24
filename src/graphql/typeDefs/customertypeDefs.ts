
const typeDefs = `
type Customer{
    _id:ID!
    customerId:String
    firstName:String
    lastName:String
    placeOfBirth:String
    dateOfBirth:String
    contactInfo:ContactInfo
    kingdom:String
    species:String
    profileImage:String
    email:String
    bioSex:String
    lastAccess:String
    dailySurveys:[DailySurvey]
    projects:[Project]
}

input CustomerInput{
    _id:ID
    customerId:String
    firstName:String
    lastName:String
    placeOfBirth:String
    dateOfBirth:String
    contactInfo:ContactInfoInput
    kingdom:String
    species:String
    profileImage:String
    email:String
    bioSex:String
    lastAccess:String
    dailySurveys:[String]
    projects:[String]
}

type CustomersResult{
    lists:[Customer]
    totalCount:Int
    perCount:Int
  }

type CustomerResultMessage {
    message:String!
    _id:String
    profilePath:String
}

type Query {
    customerCount : Int!
    customers(condition:CustomerInput, pageNum:Int):CustomersResult
    customer(_id: ID!): Customer
}

type Mutation {

    postCustomer(input: CustomerInput): CustomerResultMessage
    
    updateCustomer(
      _id:ID!
      input:CustomerInput
    ):CustomerResultMessage
  
    deleteCustomer(_id:ID!):Message!

}
`

export default typeDefs;