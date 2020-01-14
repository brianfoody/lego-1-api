import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import {
  hashKey,
  table,
  attribute,
  rangeKey
} from "@aws/dynamodb-data-mapper-annotations";

@table(process.env.CONTACT_US_TABLE_NAME!)
export class ContactUsModel {
  @hashKey()
  id: string;

  @rangeKey()
  contactedAt: number;

  @attribute()
  name: string;

  @attribute()
  company: string;

  @attribute()
  message: string;
}

export type ContactUsRequest = Omit<ContactUsModel, "id">;

export class ContactUsRepo {
  constructor(
    private mapper = new DataMapper({
      client: new AWS.DynamoDB({ region: process.env.AWS_REGION! })
    })
  ) {}

  async save(request: ContactUsRequest) {
    return await this.mapper.put(contactUsModel({ id: uuid(), ...request }));
  }
}

const contactUsModel = (s: ContactUsModel) =>
  Object.assign(new ContactUsModel(), { ...s });
