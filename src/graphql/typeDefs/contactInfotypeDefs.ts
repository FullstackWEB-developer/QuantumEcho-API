
const typeDefs =`
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

export default typeDefs;