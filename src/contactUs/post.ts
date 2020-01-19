import { APIGatewayEvent } from "aws-lambda";

import { ContactUsRepo } from "../models/contactUs";

const repo = new ContactUsRepo();

export const main = async (event: APIGatewayEvent) => handler(event, repo);

export const handler = async (event: APIGatewayEvent, repo: ContactUsRepo) => {
  if (event.body === null) {
    return {
      statusCode: 400
    };
  }

  // Just for demo - remove in your code
  await new Promise(resolve => {
    setTimeout(resolve, 2500);
  });
  // End Just for demo

  await repo.save(JSON.parse(event.body));

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ message: "okay" })
  };
};
