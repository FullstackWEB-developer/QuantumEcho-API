const {gql} = require('apollo-server-express')

const typeDefs = gql`
type Transaction{
    _id:ID!
    subscriptions:[Subscription]
    operatorBuyer:Operator
}

input TransactionInput{
    subscriptions:[SubscriptionInput]
    operatorBuyer:OperatorInput
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

module.exports = typeDefs