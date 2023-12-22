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
  //const privateKey = process.env.PRIVATE_KEY || "";

  return crypto.createPrivateKey({
    key: `-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: DES-EDE3-CBC,0B9089B8D71E2AB3

4XujRjpnq7KunWqQMcb4Mgx6lSSI/wWiu1dgwlTxULwW0NNOoJOeovwqUpqO/rc9
63dfuy9NMV1sNXTb7VlmbXSBF7/YLywz63lvPc7L3EyL56SUkYt60HRbmiuZT25w
wtPJ6M5UJiAJ9Ky4w2Z7giAL3PFDZCLY8JC9G8/5xNlhlZ3uwiigzHAL/UCq0HsY
9lQdjwvHmiWmmEh7nIIT0uzjOVO63RL5OGDJLkTQLd18A8YnaKQJXhm22LEFwJpH
jU44wxeDAVjhToJQgbMrL09efMnV0jdsSjCP/SSZR0Nzu0eFi/mGV80hlaPP1IzR
dlJ9QuLSzf2z3PDWo93sJLgm5eQVuoex+u2hYBF27GUtjOhEOFcejncrLyDbZ3gP
ReRDzLUuhNDa4Dwfh373Vjgw9m06ruvP3kDJNWMJtXAecc28TyHQq/nJTdIq4Y1G
c5zDNHLUXb7/exLKZB7c6ofR0b5oK3BMsuVOvITuLWlvyD37sbG7Z3NWBL+z+mmJ
tHhiF0cKuv9D4AXSuwg5YwGngB8xLSkj4iHbDO6ywZmfIPYcq6/JQuhQWiAijk6i
L20aB5nvAIL7ZsOG96yT2n1gEeiq1OFYSFoWub5C6/v0u07iQobBrIEvcelAkNyz
2C7Q9LRh+wM29FUiAPyVFODd1uUt3h4Ethita+3it7L08hwu87sBBC1zx1kEB06x
3+MggrIOBcfY2uvuVcWLJDcrWfRfll1JizLjv0K3T7TzA92k1CYft26G+Un8G070
HB4HcA55silzpTRDanwyhb06GkNDfVq/J5C0yNZzmq9S+uOx4iEzG9upm1Bg5aKF
GZ0q4qsGfshKr3AQr3dibjHki0IF59OGXS8WUZUamShzFpW1AMfk5kKHWw8S+xyg
tszybcFV4ez5NlAEyWbTt8efyPigccCy2jj/NAXnfcMNAwlLdhgRstHj6ET+yfuh
WgT4K8UYOqWdappuprI9xGefsvkLN663lGv8fc9cEQ0gf0t5duA6pdMJO3wAnoiX
1r4Hi1shqqpTvzRrh0Z+e8YqYvY7chOV7RkUFBF+IQSJCODUypyuehmkuvQSgaiY
Ei0u0Qaz+0av1UTAw2v/yYNYyw2GDxgmpBPmVUZMbEjFBAkmGtIvMO3Z6ExzB2mg
dta2XPrPlUY81EmfIuCfk+0YgljG5gMaaLrJqIksaq1FuIrf4Gqdp/7ol5HG+JSH
HQC8Yo65EkF5WJd/2YK14biPfJ4bANDWfa95Z5wox4b+Z2dwF9sQV246iDxIVlDE
1J2OQUJTZqO/exca+FbQ6jPPn7s6Wub/H6Ks5lOBJhCR5nbTktisZBw/6q4QBdoB
BHL7xY8hVuTnG6MbAOEXrVjE+ae2VuuQLZrhbAce9zeq7NWVdsX39K9Uw9DbN70l
w4yem49vqQeYlWcnxuvc6U+rCZ8K4C0311J1CPhgTmyW0Mue6SnMhswW6yaeV262
VpICYOJK3wXSLvVpY5hoAMyyhVooX9Y90M1ZxeUEHlCD5TBD9jnabeLrbN7y5bIa
TOBcdfu6ha3MtDlLyzOxPxzMvQ7uXyklFzrltL35Nux1MeJewlzZtP6uboJNWj5L
-----END RSA PRIVATE KEY-----
`,
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
