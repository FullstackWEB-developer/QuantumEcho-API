
const typeDefs = `
type Customer{
    _id:ID
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
    createdAt:String
    paid: Boolean
    planType: String
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
    paid: Boolean
    planType: String
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

type CustomerOperatorsResult{
    lists: [CustomerOperator]
    totalCount: Int
    perCount: Int
}

type CustomerOperator {
    _id:String
    operator: Operator
    treatmentName: String
    from: String
    to: String
    actual: String
    delay: String
    duration: String
    progress: Int
}

input FilterInput {
    nameFilters: [String]
    lastAccessFilter: String
    performanceFilter: String
    qualityFilter: String
    sexFilter: String    
    kingdomFilter: String    
    speciesFilter: String
}

input CustomerSortInput {
    clientName: String
    lastaccess: String
    performance: String
    quality: String
    treatments: String
    sex: String
    kingdom: String
    species: String
}

input ConditionInput {
    filters: FilterInput
    sort: CustomerSortInput
}

type Query {
    customerCount : Int!
    customers(condition:ConditionInput, pageNum:Int):CustomersResult
    customer(customerId: String!): Customer
    customerById(_id: ID!): Customer
    customerOperators(_id:String!, pageNum:Int):CustomerOperatorsResult
}

type Mutation {

    postCustomer(input: CustomerInput): CustomerResultMessage
    
    updateCustomer(
      customerId:String!
      input:CustomerInput
      authCheck: Boolean
    ):Customer

    updateCustomerById(
        _id:String!
        input:CustomerInput
      ):Customer
  
    deleteCustomer(_id:ID!):Message!

}
`

export default typeDefs;