import {
  DecryptFlowRequest,
  EncryptFlowResponse,
  getAppointmentString,
  getDateString,
  getPrivateKey,
  getTimeRange,
} from "@/lib/utils";
import {
  CreateCalendarAppointment,
  GetCalendarSuggestions,
} from "@/lib/CalendarFunctions";

export async function POST(request: Request) {
  const body = await request.json();

  const privateKey = getPrivateKey();

  const { decryptedBody, aesKeyBuffer, initialVectorBuffer } =
    DecryptFlowRequest(body, privateKey);

  console.log("decrypted request:", decryptedBody);

  const { screen, data, version, action } = decryptedBody;

  //handle default actions:
  if (action === "INIT") {
    const initData: any = {
      version,
      screen: "START",
      data: {},
    };

    const initRes = EncryptFlowResponse(
      initData,
      aesKeyBuffer,
      initialVectorBuffer,
    );

    return new Response(initRes);
  } else if (action === "ping") {
    const pingData: any = {
      version,
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

  //handle actions:
  let screenData: any;

  if (screen == "START") {
    const items: any[] = [];

    const preferenceDate = Date.now();
    const weeks = await GetCalendarSuggestions(preferenceDate);

    weeks.map((week: any) => {
      items.push({
        id: `Week ${week["week"]}`,
        title: `Week ${week["week"]}`,
        description: week["weekString"],
        enabled: false,
      });

      const days: any[] = week["days"];

      days.map((day: any) => {
        if (day["slots"].length > 0) {
          day["slots"].map((slot: any) => {
            items.push({
              id: `${slot["start"]}/${slot["end"]}`,
              title: getAppointmentString(slot["start"], slot["end"], "nl-NL"),
            });
          });
        }
      });
    });

    screenData = {
      version,
      screen: "CAL_INPUT_SCREEN",
      data: {
        all_slots: items,
      },
    };
  } else if (screen == "CAL_INPUT_SCREEN") {
    const slotId: string = data["slot"];

    const start = slotId.split("/")[0];
    const end = slotId.split("/")[1];

    const dateString = getDateString(start);
    const timeString = getTimeRange(start, end);

    screenData = {
      version,
      screen: "CONFIRM",
      data: {
        dateString,
        timeString,
        start,
        end,
      },
    };
  } else if (screen == "CONFIRM") {
    const start = data["start"];
    const end = data["end"];

    const a = await CreateCalendarAppointment(start, end, "", "");
    console.log("a", a);
    //console.log("AFSPRAAK:");
    //console.info(start);
    //console.error(end);

    screenData = {
      version,
      screen: "FINAL",
      data: {
        start,
        end,
      },
    };
  }

  // Return the response as plaintext
  const res = EncryptFlowResponse(
    screenData,
    aesKeyBuffer,
    initialVectorBuffer,
  );
  console.log(res);

  return new Response(res);
}
