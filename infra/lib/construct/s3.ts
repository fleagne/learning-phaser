import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface S3ConstructProps extends cdk.StackProps {
  envName: string;
}

export class S3Construct extends Construct {
  public readonly bucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: S3ConstructProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, "LearningPhaserBucket", {
      bucketName: `learning-phaser-${props.envName}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
