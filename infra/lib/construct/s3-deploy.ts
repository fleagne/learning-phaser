import * as cdk from "aws-cdk-lib";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import * as path from "path";

export interface S3DeployConstructProps extends cdk.StackProps {
  bucket: cdk.aws_s3.Bucket;
  envName: string;
}

export class S3DeployConstruct extends Construct {
  constructor(scope: Construct, id: string, props: S3DeployConstructProps) {
    super(scope, id);

    new s3Deploy.BucketDeployment(this, "LearningPhaserBucketDeployment", {
      sources: [
        s3Deploy.Source.asset(path.join(__dirname, "../../../frontend/dist")),
      ],
      destinationBucket: props.bucket,
    });
  }
}
