"use server";

import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@smithy/types";

const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.DO_KEY || "",
  secretAccessKey: process.env.DO_SECRET || "",
};
const s3Client = new S3({
  forcePathStyle: false,
  endpoint: process.env.DO_ENDPOINT,
  region: "us-east-1",
  credentials: credentials,
});

export async function getInvocation(flow_token: string) {
  const bucketName = process.env.DO_BUCKET_NAME || "";
  const fileKey = process.env.DO_FILE_KEY || "";

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  try {
    const response = await s3Client.send(command);
    //@ts-ignore
    const str = await response.Body.transformToString();
    let fileDataJson = JSON.parse(str);

    return fileDataJson[flow_token];
  } catch (err) {
    return undefined;
  }
}

export async function createDatabaseInvocation(
  flow_token: string,
  phoneNumber: string,
) {
  const bucketName = process.env.DO_BUCKET_NAME || "";
  const fileKey = process.env.DO_FILE_KEY || "";

  //getDatabase

  try {
    let data = await getFullDatabase();

    data[flow_token] = {
      phoneNumber,
    };

    const updateCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: JSON.stringify(data),
    });
    const updateResponse = await s3Client.send(updateCommand);

    return true;
  } catch (err) {
    console.error("createDatabaseInvocation", err);
    return false;
  }
}

//updateCurrentScreen (screen) (screen)

//updateContactInformation (contact) (firstname, lastname, email)

//update Utility (utility)

//updateRadioQuestion (ky)

//updateBagInformation BAG === value

export async function getFullDatabase() {
  const bucketName = process.env.DO_BUCKET_NAME || "";
  const fileKey = process.env.DO_FILE_KEY || "";

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  try {
    const response = await s3Client.send(getCommand);
    //@ts-ignore
    const str = await response.Body.transformToString();
    return JSON.parse(str);
  } catch (err) {
    console.error("getFullDatabase", err);
    return null;
  }
}

export async function updateDatabaseProperty(
  flow_token: string,
  key: string,
  value: any,
) {
  const bucketName = process.env.DO_BUCKET_NAME || "";
  const fileKey = process.env.DO_FILE_KEY || "";

  try {
    let data = await getFullDatabase();

    data[flow_token][key] = value;

    const updateCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: JSON.stringify(data),
    });
    const updateResponse = await s3Client.send(updateCommand);

    return true;
  } catch (err) {
    console.error("updateProperty", err);
    return false;
  }
}

export async function updateDatabaseObject(
  flow_token: string,
  key: string,
  subKey: string,
  value: any,
) {
  const bucketName = process.env.DO_BUCKET_NAME || "";
  const fileKey = process.env.DO_FILE_KEY || "";

  try {
    let data = await getFullDatabase();

    data[flow_token][key] = {
      ...data[flow_token][key],
      [subKey]: value,
    };

    const updateCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: JSON.stringify(data),
    });
    const updateResponse = await s3Client.send(updateCommand);

    return true;
  } catch (err) {
    console.error("updateObject", err);
    return false;
  }
}
