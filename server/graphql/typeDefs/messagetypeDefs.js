const {gql} = require('apollo-server')

const typeDefs = gql`
type Message{
    message:String!
}
`

module.exports = typeDefs