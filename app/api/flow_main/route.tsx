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
import { getBagInformation } from "@/lib/getBagData";
import {
  DakisolatieAfwerkingDetailsQuestion,
  DakisolatieAfwerkingQuestion,
  DakisolatieQuestion,
  SpouwmuurisolatieAanbouwQuestion,
  SpouwmuurisolatieKruipruimteQuestion,
  SpouwmuurisolatieQuestion,
  VloerisolatieQuestion,
} from "@/app/api/flow_main/questions";

//route to get the next page
//route functions to fetch data for each given route

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

  //main router actions:
  let screenData: any = await mainRouterActions(decryptedBody);

  screenData = {
    version: version,
    ...screenData,
  };

  // Return the response as plaintext
  const res = EncryptFlowResponse(
    screenData,
    aesKeyBuffer,
    initialVectorBuffer,
  );

  return new Response(res);
}

async function mainRouterActions(decryptedBody: any) {
  const { screen, data, version, action } = decryptedBody;

  //START
  if (screen == "START") {
    return {
      screen: "WELCOME",
      data: {},
    };
  }

  //WELCOME
  if (screen == "WELCOME") {
    if (data["keuze"] == "Direct Plannen") {
      return {
        screen: "FINAL",
        data: {},
      };
    }

    if (data["keuze"] == "FAQ") {
      return {
        screen: "FAQ",
        data: {},
      };
    }

    return {
      screen: "BAG_INPUT_SCREEN",
      data: {
        bag_error: false,
      },
    };
  }

  //BAG SCREEN
  if (screen == "BAG_INPUT_SCREEN") {
    const bagQuery = `${data["postcode"]} ${data["huisnummer"]}`;
    const { success, data: bag_data } = await getBagInformation(bagQuery);

    if (!success || !bag_data) {
      return {
        screen: "BAG_INPUT_SCREEN",
        data: {
          bag_error: true,
        },
      };
    }

    return {
      screen: "BAG_RESULT_SCREEN",
      data: {
        bag_data,
      },
    };
  }

  //QUESTIONS
  if (screen == "UTILITY_USAGE_SCREEN" || screen == "RADIO_QUESTION") {
    return questionsRouter(decryptedBody);
  }
}

function questionsRouter(decryptedBody: any): any {
  //current

  const { screen, data } = decryptedBody;

  if (screen == "UTILITY_USAGE_SCREEN") {
    return {
      screen: "RADIO_QUESTION",
      data: DakisolatieQuestion,
    };
  }

  if (screen == "RADIO_QUESTION") {
    //Dakisolatie
    if (data["question_name"] == "dakisolatie") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: SpouwmuurisolatieQuestion,
        };
      }
      return {
        screen: "RADIO_QUESTION",
        data: DakisolatieAfwerkingQuestion,
      };
    }
    if (data["question_name"] == "dakisolatie_afwerking") {
      if (data["answer"] == "true") {
        return {
          screen: "ADVIES",
          data: {
            advies:
              "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
              "Je hebt aangegeven dat je dak nog niet is geïsoleerd. Dit is een geweldige stap om mee te beginnen.",
          },
        };
      }

      return {
        screen: "RADIO_QUESTION",
        data: DakisolatieAfwerkingDetailsQuestion,
      };
    }
    if (data["question_name"] == "dakisolatie_afwerking_details") {
      return {
        screen: "ADVIES",
        data: {
          advies:
            "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
            "Je hebt aangegeven dat je dak nog niet is geïsoleerd. Dit is een geweldige stap om mee te beginnen.",
        },
      };
    }

    //Spouwmuurisolatie
    if (data["question_name"] == "spouwmuurisolatie") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: VloerisolatieQuestion,
        };
      }

      return {
        screen: "RADIO_QUESTION",
        data: SpouwmuurisolatieAanbouwQuestion,
      };
    }

    if (data["question_name"] == "spouwmuurisolatie_aanbouw") {
      return {
        screen: "RADIO_QUESTION",
        data: SpouwmuurisolatieKruipruimteQuestion,
      };
    }

    if (data["question_name"] == "spouwmuurisolatie_kruipruimte") {
      return {
        screen: "ADVIES",
        data: {
          advies:
            "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
            "Je hebt nog geen spouwmuurisolatie. Wist je dat er veel warmte verloren kan gaan? Dit kun je eenvoudig aanpakken.",
        },
      };
    }

    //TODO: Alles vanaf en inclusief vloerisolatie
  }
}
