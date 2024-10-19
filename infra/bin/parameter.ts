import { Environment } from "aws-cdk-lib";

export interface AppParameter {
  envName: string;
  env?: Environment;
}
export const devParameter: AppParameter = {
  envName: "Dev",
  env: { account: process.env.AWS_ACCOUNT_ID, region: "ap-northeast-1" },
};

export const prdParameter: AppParameter = {
  envName: "Prd",
  env: { account: process.env.AWS_ACCOUNT_ID, region: "ap-northeast-1" },
};
