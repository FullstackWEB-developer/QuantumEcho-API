
const typeDefs = `

type Subscrib{
    _id:ID
    coverImage:String
    description:String
    typology:String
    status:String
    roles:[String]
    features:Module
    monthlyPrice:Float
    termPeriod:String
    creator:Admin
    createdAt:String
}

input SubscribInput {
    coverImage:String
    description:String
    typology:Typology
    status:Status
    roles:[String]
    features:String
    monthlyPrice:Float
    termPeriod:String
    creator:String
}

enum Typology {
    Public
    Custom
}  
enum Status {
    Published
    Unpublished
}
enum Role {
    general_manager
    project_manager
    wellness_operator
}

type SubscribResult{
    lists:[Subscrib]
    totalCount:Int
    perCount:Int
}

type PaymentIntentResult {
    client_secret: String
}

type Query {
    subscribCount : Int!
    subscribs(condition:SubscribInput, pageNum:Int): SubscribResult
    subscrib(_id: ID!): Subscrib
}

type Mutation {

    postSubscrib(input: SubscribInput): Message

    createPaymentIntent(subscribId: String!, buyerId: String, paymentType: String): PaymentIntentResult
    createCustomerPaymentIntent(buyerId: String, paymentType: String): PaymentIntentResult
    
    updateSubscrib(
        _id:ID!
        input:SubscribInput
    ):Subscrib
  
    deleteSubscrib(_id:ID!):Message!

}
`

export default typeDefs;