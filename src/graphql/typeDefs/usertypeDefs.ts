
const typeDefs = `

type User {
    _id:ID!
    cognitoId:String
    email:String!
    password:String
    role:[String]!
    accessToken:String
    status:String
}

input UserInput{
    email:String
    cognitoId:String
    password:String
    role:[String]
    accessToken:String
    status:String
}

type Query {
    userCount : Int!
    users:[User]
    user(email: String!): User
}

type Mutation {

    postUser(input: UserInput): Message
    
    updateUser(
        email:String!
        input:UserInput
    ):Operator

    updateUserWithCustomer(
        email:String!
        input:UserInput
    ):Customer
  
    deleteUser(email:String!):Message!

}
`

export default typeDefs;