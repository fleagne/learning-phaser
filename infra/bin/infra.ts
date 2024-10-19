import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { AppParameter, devParameter, prdParameter } from "./parameter";
import { LearningPhaserStack } from "../lib/stack/LearningPhaserStack";
const app = new cdk.App();

// Dynamic ID Pattern
const argContext = "environment";

// https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/get_context_var.html
// cdk synth -c environment=dev
const envKey = app.node.tryGetContext(argContext);
const parameters = [devParameter, prdParameter];
const appParameter: AppParameter = parameters.filter(
  (obj: AppParameter) => obj.envName.toLocaleLowerCase() === envKey
)[0];

new LearningPhaserStack(app, `${appParameter.envName}LearningPhaserStack`, {
  ...appParameter,
});
