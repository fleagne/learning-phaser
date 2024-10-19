import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface DynamoDBConstructProps extends cdk.StackProps {
  tableName: string;
  envName: string;
}

export class DynamoDBConstruct extends Construct {
  public readonly table: cdk.aws_dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamoDBConstructProps) {
    super(scope, id);

    this.table = new dynamodb.Table(this, props.tableName, {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      tableName: `${props.tableName}-${props.envName}`,

      /**
       * デフォルトの削除ポリシーはRETAIN
       * 新しいテーブルは手動で削除されるまでアカウントに残る
       * DESTROYに設定すると、cdk destroyはテーブルを削除する（テーブル内にデータがある場合であっても）
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 本番用コードには推奨しない
    });
  }
}

