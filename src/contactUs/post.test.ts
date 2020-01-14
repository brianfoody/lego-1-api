import "ts-jest";
import { ContactUsRepo, ContactUsRequest } from "../models/contactUs";
import { handler } from "./post";
import { APIGatewayEvent } from "aws-lambda";

describe("post", () => {
  let mockRepo: jest.Mocked<ContactUsRepo>;
  let sampleRequest: ContactUsRequest = {
    message: "Hello",
    company: "Bamboo",
    contactedAt: +new Date(),
    name: "Brian Foody"
  };

  beforeEach(() => {
    mockRepo = {
      save: jest.fn()
    } as any;
  });

  it("returns a 400 when no body is supplied", async () => {
    const emptyPayload: APIGatewayEvent = generateMockPayload(null);
    const response = await handler(emptyPayload, mockRepo);
    expect(response.statusCode).toEqual(400);
  });

  it("saves the payload when supplied", async () => {
    const requestPayload: APIGatewayEvent = generateMockPayload(
      JSON.stringify(sampleRequest)
    );
    await handler(requestPayload, mockRepo);
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockRepo.save.mock.calls[0][0]).toEqual(sampleRequest);
  });

  it("responds with a 200 when a payload is supplied", async () => {
    const requestPayload: APIGatewayEvent = generateMockPayload(
      JSON.stringify(sampleRequest)
    );
    const response = await handler(requestPayload, mockRepo);
    expect(response.statusCode).toEqual(200);
  });
});

const generateMockPayload = (body: string | null): APIGatewayEvent => ({
  headers: {},
  pathParameters: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  requestContext: {} as any,
  resource: "",
  httpMethod: "POST",
  isBase64Encoded: false,
  multiValueHeaders: {},
  path: "/post",
  stageVariables: {},
  body
});
