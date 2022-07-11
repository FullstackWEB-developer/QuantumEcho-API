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

type AdminGeneralDashboard {
    user_aggregate:UserAggregate
    trend_aggregate:AreaChartType
    age_aggregate:CricleChartType
    sex_aggregate:CricleChartType
    kingdom_aggregate:CricleChartType
    online_aggregate:AreaChartType
    current_users_aggregate:CricleChartType
    current_clients_aggregate:CricleChartType
    treatment_quality_aggregate:AreaChartType
}

type AdminAccountingDashboard{
    subscriptions_aggregate:SubscriptionsAggregate
    trend_aggregate:AreaChartType
    payments_status_aggregate:CricleChartType
    payments_methods_aggregate:CricleChartType
}

type UserAggregate {
    general_managers:Int
    project_managers:Int
    operators:Int
    clients:Int
}

type SubscriptionsAggregate{
    subscriptions:Int
    new_subscriptions:Int
    credits:Int
    earned_credits:Int
}

type Series{
    name:String
    data:[Int]
}

type AreaChartType {
    series:[Series]
    colors:[String]
    categories:[String]
}

type CricleChartType {
    colors:[String]
    labels:[String]
    values:[Int]
}

type Query {
    adminCount : Int!
    admins:[Admin]
    adminById(_id: ID!): Admin
    adminByCognitoId(cognitoId: String!): Admin
    adminGneralDashboard(trendDate:String, userType:UserTypeInput, treatmentsDate:String):AdminGeneralDashboard
    adminAccountingDashboard(trendDate:String):AdminAccountingDashboard
}

input UserTypeInput{
    userType:String
    dateFrom:String
    dateTo:String
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