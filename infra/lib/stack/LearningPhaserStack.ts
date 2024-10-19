import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { S3Construct } from "../construct/s3";
import { CloudFrontConstruct } from "../construct/cloudfront";
import { S3DeployConstruct } from "../construct/s3-deploy";
import { DynamoDBConstruct } from "../construct/dynamodb";
import { LambdaConstruct } from "../construct/lambda";
import { ApiGatewayConstruct } from "../construct/api-gateway";

interface LearningPhaserStackProps extends cdk.StackProps {
  envName: string;
}

export class LearningPhaserStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LearningPhaserStackProps) {
    super(scope, id, props);

    // 1. S3 Bucketを作成する
    const bucket = new S3Construct(this, "S3Construct", {
      envName: props.envName.toLocaleLowerCase(),
    });

    // 2. CloudFrontを作成し、S3 Bucketと紐づける
    const cloudfront = new CloudFrontConstruct(this, "CloudFrontConstruct", {
      bucket: bucket.bucket,
      envName: props.envName,
    });

    // 3. S3 Bucketにfrontendのリソースを配置する
    new S3DeployConstruct(this, "S3DeployConstruct", {
      bucket: bucket.bucket,
      envName: props.envName,
    });

    // 4. DynamoDBを作成する
    const dynamoUser = new DynamoDBConstruct(this, "DynamoDBConstruct", {
      tableName: "User",
      envName: props.envName.toLocaleLowerCase(),
    });

    // 5. Lambdaを作成する
    const lambda = new LambdaConstruct(this, "LambdaConstruct", {
      table: dynamoUser.table,
      envName: props.envName,
    });

    // 6. API Gatewayを作成し、Lambdaとの紐づけを行う
    const apiGateway = new ApiGatewayConstruct(this, "ApiGatewayConstruct", {
      lambda: lambda,
      envName: props.envName,
    });

    // cdk deploy後、コンソールにCloudFrontのURLを出力する
    new cdk.CfnOutput(this, "CfnOutCloudFrontUrl", {
      value: `https://${cloudfront.distribution.distributionDomainName}`,
      description: "The CloudFront URL",
    });
  }
}
