import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { addCorsOptions } from "../../utils/add-cors-options";
import { LambdaConstruct } from "./lambda";

export interface ApiGatewayConstructProps extends cdk.StackProps {
  lambda: LambdaConstruct;
  envName: string;
}

export class ApiGatewayConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayConstructProps) {
    super(scope, id);

    // Lambda関数とAPI Gatewayリソースを統合する
    const getAllIntegration = new apiGateway.LambdaIntegration(props.lambda.getAllLambda);
    const createOneIntegration = new apiGateway.LambdaIntegration(props.lambda.createOneLambda);
    const getOneIntegration = new apiGateway.LambdaIntegration(props.lambda.getOneLambda);
    const updateOneIntegration = new apiGateway.LambdaIntegration(props.lambda.updateOneLambda);
    const deleteOneIntegration = new apiGateway.LambdaIntegration(props.lambda.deleteOneLambda);


    // 各CRUD操作用のAPI Gatewayリソースを作成する。
    const api = new apiGateway.RestApi(this, 'usersApi', {
      restApiName: `Users Service ${props.envName}`
    });

    const users = api.root.addResource('users');
    users.addMethod('GET', getAllIntegration);
    users.addMethod('POST', createOneIntegration);
    addCorsOptions(users);

    const singleItem = users.addResource('{id}');
    singleItem.addMethod('GET', getOneIntegration);
    singleItem.addMethod('PATCH', updateOneIntegration);
    singleItem.addMethod('DELETE', deleteOneIntegration);
    addCorsOptions(singleItem);
  }
}

