import { Stack, App, StackProps } from "@aws-cdk/core";
import { ApiResources } from "./ApiResources";

export class ServiceStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    new ApiResources(this, "API");
  }
}

const app = new App();

new ServiceStack(app, "LambdaLego1ApiStack");

app.synth();
