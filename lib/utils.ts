import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto, { KeyObject } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encrypt flow response (by Meta example)
 */
export function EncryptFlowResponse(
  response: any,
  aesKeyBuffer: Buffer,
  initialVectorBuffer: Buffer,
) {
  // Flip the initialization vector
  const flipped_iv = [];
  for (const pair of initialVectorBuffer.entries()) {
    flipped_iv.push(~pair[1]);
  }
  // Encrypt the response data
  const cipher = crypto.createCipheriv(
    "aes-128-gcm",
    aesKeyBuffer,
    Buffer.from(flipped_iv),
  );
  return Buffer.concat([
    cipher.update(JSON.stringify(response), "utf-8"),
    cipher.final(),
    cipher.getAuthTag(),
  ]).toString("base64");
}

/**
 * Decrypt flow request (by Meta example)
 */
export function DecryptFlowRequest(body: any, privateKey: KeyObject) {
  const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;

  // Decrypt the AES key created by the client
  const decryptedAesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encrypted_aes_key, "base64"),
  );

  // Decrypt the Flow data
  const flowDataBuffer = Buffer.from(encrypted_flow_data, "base64");
  const initialVectorBuffer = Buffer.from(initial_vector, "base64");

  const TAG_LENGTH = 16;
  const encrypted_flow_data_body = flowDataBuffer.subarray(0, -TAG_LENGTH);
  const encrypted_flow_data_tag = flowDataBuffer.subarray(-TAG_LENGTH);

  const decipher = crypto.createDecipheriv(
    "aes-128-gcm",
    decryptedAesKey,
    initialVectorBuffer,
  );
  decipher.setAuthTag(encrypted_flow_data_tag);

  const decryptedJSONString = Buffer.concat([
    decipher.update(encrypted_flow_data_body),
    decipher.final(),
  ]).toString("utf-8");

  return {
    decryptedBody: JSON.parse(decryptedJSONString),
    aesKeyBuffer: decryptedAesKey,
    initialVectorBuffer,
  };
}

/**
 * Get KeyObject of private key used for encryption
 */
export function getPrivateKey(passphrase?: string) {

  const privateKey = "PRIVATE_KEY_HERE";

  return crypto.createPrivateKey({
    key: privateKey,
    passphrase: passphrase,
  });
}

/**
 * Gets the date string as specified in the options
 */
export function dateString(
  date: string | Date,
  locale = "nl-NL",
  timeZone = "Europe/Amsterdam",
  options: any = undefined,
) {
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: timeZone,
  }).format(new Date(date));
}

/**
 * Gets the date string as example: "10 oktober 2022
 */
export function getDateString(
  date: string,
  locale = "nl-NL",
  timeZone = "Europe/Amsterdam",
) {
  return dateString(date, locale, timeZone, { dateStyle: "long" });
}

/**
 * Gets a time range from 2 date strings
 */
export function getTimeRange(startDate: string, endDate: string) {
  const startTime = dateString(startDate, "nl-NL", "Europe/Amsterdam", {
    timeStyle: "short",
  });
  const endTime = dateString(endDate, "nl-NL", "Europe/Amsterdam", {
    timeStyle: "short",
  });

  return `${startTime} - ${endTime}`;
}

/**
 * gets the appointment string as "woensdag 18 januari 2023 tussen 16:00 en 16:30"
 */
export function getAppointmentString(
  start: string,
  end: string,
  locale = "nl-NL",
  timeZone = "Europe/Amsterdam",
) {
  const date = dateString(start, locale, timeZone, {
    dateStyle: "full",
  });
  const startTime = dateString(start, locale, timeZone, {
    timeStyle: "short",
  });
  // const endTime = dateString(end, locale, timeZone, {
  //   timeStyle: 'short',
  // });

  return `${date} om ${startTime}`;
}
