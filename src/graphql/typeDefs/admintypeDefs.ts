const typeDefs =`

type Admin {
    _id:ID
    adminId:String
    phoneNumber:String
    profileImage:String
    address:Address
    firstName:String
    lastName:String
    email:String
    subscribs:[String]
    subRole:String
}

input AdminInput {
    _id:String
    adminId:String
    phoneNumber:String
    profileImage:String
    address:AddressInput
    firstName:String
    lastName:String
    email:String
    subscribs:[String]
    subRole:String
}

type Query {
    adminCount : Int!
    admins:[Admin]
    adminById(_id: ID!): Admin
    adminByCognitoId(cognitoId: String!): Admin
}

type Mutation {

    postAdmin(input: AdminInput): Admin
    
    updateAdmin(
        _id:ID!
        input:AdminInput
    ):Admin
  
    deleteAdmin(_id:ID!):Message!

}
`

export default typeDefs