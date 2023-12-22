"use server";

import { getInvocation, updateDatabaseProperty } from "@/lib/DigitalOcean";

/**
 * Updates a contact in CommuniQate for the organization defined in the .env
 */
export async function UpdateCommuniQateContact(
  first_name: string,
  last_name: string,
  email: string,
  flow_token: string,
) {
  const invocation = await getInvocation(flow_token);

  const phoneNumber = invocation["phoneNumber"];

  await updateDatabaseProperty(flow_token, "contact", {
    first_name,
    last_name,
    email,
  });

  const apiUrl = process.env.COMMUNIQATE_API_URL;
  const apiKey = process.env.COMMUNIQATE_API_KEY;
  const orgId = process.env.COMMUNIQATE_ORGANIZATION_ID;

  return await fetch(
    `${apiUrl}/${orgId}/communiqate/contacts/+${phoneNumber}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": `application/json`,
      },
    },
  ).then((a) => a.json());
}
