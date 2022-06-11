
import { gql } from 'apollo-server-express'

const typeDefs = gql`
type ContactInfo{
    address:String
    city:String
    province:String
    country:String
    CAP:String
    website:String
    phoneNumber:String
}
input ContactInfoInput{
    address:String
    city:String
    province:String
    country:String
    CAP:String
    website:String
    phoneNumber:String
}
`

export default typeDefs
// module.exports = typeDefs