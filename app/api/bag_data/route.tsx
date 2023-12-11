import { getBagInformation } from "@/lib/getBagData";
import {
  DecryptFlowRequest,
  EncryptFlowResponse,
  getPrivateKey,
} from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("initialBody", body);

  const privateKey = getPrivateKey();

  const { decryptedBody, aesKeyBuffer, initialVectorBuffer } =
    DecryptFlowRequest(body, privateKey);

  console.log("body", decryptedBody);

  const { screen, data, version, action } = decryptedBody;

  if (decryptedBody["action"] && decryptedBody["action"] === "ping") {
    const pingData: any = {
      version,
      screen: "BAG_RESULT_SCREEN",
      data: {
        status: "active",
      },
    };

    const pingRes = EncryptFlowResponse(
      pingData,
      aesKeyBuffer,
      initialVectorBuffer,
    );

    return new Response(pingRes);
  }

  //get bag data
  const query = `${data["postcode"]} ${data["huisnummer"]}`;
  const { success, data: bagData } = await getBagInformation(query);

  let screenData: any;

  console.log("bag", bagData);

  if (!success || !bagData) {
    screenData = {
      version,
      screen: "BAG_INPUT_SCREEN",
      data: {
        bag_error: true,
      },
    };
  } else {
    screenData = {
      version,
      screen: "BAG_RESULT_SCREEN",
      data: {
        bag_data: {
          ...bagData,
          oppervlakte: `${bagData.oppervlakte}`,
        },
      },
    };
  }
  //set screen data

  // Return the response as plaintext
  const res = EncryptFlowResponse(
    screenData,
    aesKeyBuffer,
    initialVectorBuffer,
  );
  console.log(res);

  return new Response(res);
}
