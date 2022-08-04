
const typeDefs = `
type Transaction{
    _id:ID
    subscribs:[Subscrib]
    operatorBuyer:Operator
}

input TransactionInput{
    subscribs: String
    operatorBuyer: String
    paymentIntentClientSecret: String
    paymentIntent: String
}

type Query {
    transactionCount : Int!
    transactions:[Transaction]
    transaction(_id: ID!): Transaction
}

type Mutation {

    postTransaction(input: TransactionInput): Message
    
    updateTransaction(
        _id:ID!
        input:TransactionInput
    ):Transaction
  
    deleteTransaction(_id:ID!):Message!

}

`

export default typeDefs;