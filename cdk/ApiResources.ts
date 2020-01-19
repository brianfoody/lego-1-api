import { Function, Runtime, Code, LayerVersion } from "@aws-cdk/aws-lambda";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { AttributeType, Table, BillingMode } from "@aws-cdk/aws-dynamodb";
import { Construct, RemovalPolicy, CfnOutput } from "@aws-cdk/core";

export class ApiResources extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);

    // Tables
    const contactUsTable = new Table(this, "ContactUsTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "contactedAt",
        type: AttributeType.NUMBER
      },
      removalPolicy: RemovalPolicy.RETAIN,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    // Functions
    const layer = new LayerVersion(this, "LambdaLayer", {
      code: Code.asset("./lib/layers"),
      compatibleRuntimes: [Runtime.NODEJS_10_X],
      license: "Apache-2.0",
      description: "Library layers."
    });

    const handler = new Function(this, "EventHandler", {
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset("./lib/src"),
      handler: "contactUs/post.main",
      layers: [layer],
      environment: {
        CONTACT_US_TABLE_NAME: contactUsTable.tableName
      }
    });

    // API
    const api = new RestApi(this, "WebApi");

    const resource = api.root.addResource("contact");
    resource.addMethod(
      "POST",
      new LambdaIntegration(handler, {
        allowTestInvoke: false
      })
    );

    new CfnOutput(this, "ApiUrl", {
      value: api.url
    });
  }
}
