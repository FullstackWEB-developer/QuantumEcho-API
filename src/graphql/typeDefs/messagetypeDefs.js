const {gql} = require('apollo-server-express')

const typeDefs = gql`
type Message{
    message:String!
}
`

module.exports = typeDefs