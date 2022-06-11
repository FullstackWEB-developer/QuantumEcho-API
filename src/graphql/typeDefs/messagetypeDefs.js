import { gql } from 'apollo-server-express'

const typeDefs = gql`
type Message{
    message:String!
}
`

export default typeDefs
// module.exports = typeDefs