import { Stack, App, StackProps } from "@aws-cdk/core";
import { ServerResources } from "./ServerResources";

export class ServiceStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    new ServerResources(this, "API");
  }
}

const app = new App();

new ServiceStack(app, "ApiStack");

app.synth();
