"use server";

import { createDatabaseInvocation } from "@/lib/DigitalOcean";
type Mode = "draft" | "published";

/**
 * Send an interactive flow message (draft or published) using the Meta Graph API
 */
export async function SendFlowMessage(
  phoneNumber: string,
  flowToken: string,
  mode: Mode = "draft",
) {
  const phoneNumberId = process.env.NEXT_PUBLIC_META_PHONE_NUMBER_ID;
  const apiKey = process.env.NEXT_PUBLIC_META_API_KEY;
  const flowId = process.env.NEXT_PUBLIC_META_FLOW_ID;

  if (!phoneNumberId || !apiKey || !flowId) {
    return {
      error: ".env not set!",
    };
  }

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "flow",
      body: {
        text: "dit is een flow",
      },
      action: {
        name: "flow",
        parameters: {
          flow_message_version: "3",
          flow_token: flowToken,
          flow_id: flowId,
          flow_cta: "Open flow",
          mode: mode,
          flow_action: "data_exchange",
        },
      },
    },
  };

  await createDatabaseInvocation(flowToken, phoneNumber);

  return await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    },
  ).then((res) => res.json());
}
