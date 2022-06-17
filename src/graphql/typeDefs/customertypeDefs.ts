
const typeDefs = `
type Customer{
    _id:ID!
    firstName:String
    lastName:String
    placeOfBirth:String
    dateOfBirth:String
    contactInfo:ContactInfo
    kingdom:String
    species:String
    profileImage:String
    email:String
    bioSex:Sex
    lastAccess:String
    dailySurveys:[DailySurvey]
    projects:[Project]
}

input CustomerInput{
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
    dailySurveys:[DailySurveyInput]
    projects:[ProjectInput]
}

type Query {
    customerCount : Int!
    customers:[Customer]
    customer(_id: ID!): Customer
}

type Mutation {

    postCustomer(input: CustomerInput): Message
    
    updateCustomer(
      _id:ID!
      input:CustomerInput
    ):Customer
  
    deleteCustomer(_id:ID!):Message!

}
`

export default typeDefs;