import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export interface LambdaConstructProps extends cdk.StackProps {
  table: cdk.aws_dynamodb.Table;
  envName: string;
}

export class LambdaConstruct extends Construct {
  public readonly getOneLambda: lambdaNodejs.NodejsFunction;
  public readonly getAllLambda: lambdaNodejs.NodejsFunction;
  public readonly createOneLambda: lambdaNodejs.NodejsFunction;
  public readonly updateOneLambda: lambdaNodejs.NodejsFunction;
  public readonly deleteOneLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const nodeJsFunctionProps: lambdaNodejs.NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Lambda Runtimeで利用可能な「aws-sdk」を使用する。
        ],
      },
      depsLockFilePath: path.join(__dirname, '../../lambda', 'pnpm-lock.yaml'),
      environment: {
        PRIMARY_KEY: 'userId',
        TABLE_NAME: props.table.tableName,
      },
      runtime: lambda.Runtime.NODEJS_20_X,
    }

    // CRUD操作ごとにラムダ関数を作成する
    this.getOneLambda = new lambdaNodejs.NodejsFunction(this, 'getOneUserFunction', {
      entry: path.join(__dirname, '../../lambda', 'get-one.ts'),
      ...nodeJsFunctionProps,
    });
    this.getAllLambda = new lambdaNodejs.NodejsFunction(this, 'getAllUsersFunction', {
      entry: path.join(__dirname, '../../lambda', 'get-all.ts'),
      ...nodeJsFunctionProps,
    });
    this.createOneLambda = new lambdaNodejs.NodejsFunction(this, 'createUserFunction', {
      entry: path.join(__dirname, '../../lambda', 'create.ts'),
      ...nodeJsFunctionProps,
    });
    this.updateOneLambda = new lambdaNodejs.NodejsFunction(this, 'updateUserFunction', {
      entry: path.join(__dirname, '../../lambda', 'update-one.ts'),
      ...nodeJsFunctionProps,
    });
    this.deleteOneLambda = new lambdaNodejs.NodejsFunction(this, 'deleteUserFunction', {
      entry: path.join(__dirname, '../../lambda', 'delete-one.ts'),
      ...nodeJsFunctionProps,
    });

    // Lambda関数にDynamoDBテーブルへの読み取りアクセスを許可する
    props.table.grantReadWriteData(this.getAllLambda);
    props.table.grantReadWriteData(this.getOneLambda);
    props.table.grantReadWriteData(this.createOneLambda);
    props.table.grantReadWriteData(this.updateOneLambda);
    props.table.grantReadWriteData(this.deleteOneLambda);
  }
}

