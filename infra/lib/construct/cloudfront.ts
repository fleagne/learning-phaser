import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

export interface CloudFrontConstructProps extends cdk.StackProps {
  bucket: cdk.aws_s3.Bucket;
  envName: string;
}

export class CloudFrontConstruct extends Construct {
  public readonly distribution: cdk.aws_cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: CloudFrontConstructProps) {
    super(scope, id);

    this.distribution = new cloudfront.Distribution(
      this,
      "LearningPhaserDistribution",
      {
        defaultBehavior: {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          compress: true,
          origin:
            cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(props.bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: "/error.html",
            ttl: cdk.Duration.minutes(30),
          },
        ],
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      }
    );
  }
}
