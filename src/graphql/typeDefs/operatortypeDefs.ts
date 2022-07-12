
const typeDefs = `
type Operator{
  _id:ID
  operatorId:String
  firstName:String
  lastName:String
  placeOfBirth:String
  dateOfBirth:String  
  contactInfo:ContactInfo
  profileImage:String
  bioSex:String
  email:String
  activity:String
  company:String
  kingdom:String
  species:String
  store:[Subscrib]
  customers:[Customer]
  protocols:[Protocol]
  createdAt:String
}

input OperatorInput{
  operatorId:String
  firstName:String
  lastName:String
  placeOfBirth:String
  dateOfBirth:String  
  contactInfo:ContactInfoInput
  profileImage:String
  bioSex:String
  email:String
  activity:String
  company:String
  kingdom:String
  species:String
  store:[String]
  customers:[String]
  protocols:[String]
}

enum Sex {
  male
  female
  other
}  

type AggregateType{
  general_aggregate:GeneralAggregate
  subscriptions_aggregate:SubscriptionAggregate
  trend_aggregate:AreaChartType
  age_aggregate:CricleChartType
  sex_aggregate:CricleChartType
  kingdom_aggregate:CricleChartType
  weekly_aggregate:AreaChartType
  current_users_aggregate:CricleChartType
  current_clients_aggregate:CricleChartType
  treatment_aggregate:AreaChartType
  income_trend_aggregate:AreaChartType
}

type GeneralAggregate {
  user_from:String
  subscriptions:Int
  current_credits:Int
  earned_credits:Int
}

type SubscriptionAggregate{
  online_clients:Int
  active_treatments:Int
  saved_sessions:Int
  defined_protocols:Int
}

input AggregateInput {
  client_trend_date:String
  weekly_date:WeeklyInput
  treatment_date:String
  incom_date:WeeklyInput
}

type Query {
  operatorCount : Int!
  operators:[Operator]
  operator(operatorId: String!): Operator
  operatorById(_id: String!): Operator

  operatorAggregates(_id:String!, condition:AggregateInput):AggregateType
}

type Mutation {

  postOperator(input: OperatorInput): Message!
  
  updateOperator(
    operatorId:String!
    input:OperatorInput
  ):Operator

  deleteOperator(operatorId:String!):Message!
}

`

export default typeDefs;