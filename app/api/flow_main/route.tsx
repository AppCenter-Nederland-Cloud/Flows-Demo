import {
  DecryptFlowRequest,
  EncryptFlowResponse,
  getAppointmentString,
  getPrivateKey,
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
  GlasisolatieQuestion,
  SpouwmuurisolatieAanbouwQuestion,
  SpouwmuurisolatieKruipruimteQuestion,
  SpouwmuurisolatieQuestion,
  VloerisolatieKruipruimteQuestion,
  VloerisolatieQuestion,
  WarmtepompQuestion,
  ZonnepanelenExtraQuestion,
  ZonnepanelenQuestion,
  ZonnepanelenSchaduwDakQuestion,
  ZonnepanelenTypeDakQuestion,
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
  const { screen, data, version, action, flow_token } = decryptedBody;

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
        screen: "GEGEVENS",
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
      data: {},
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
          error_message:
            "We kunnen je adresgegevens niet automatisch ophalen. Check je postcode / huisnummer of vul je adresgegevens handmatig in.",
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

  //GEGEVENS
  if (screen == "ADVIES") {
    return {
      screen: "GEGEVENS",
      data: {},
    };
  }
  if (screen == "GEGEVENS") {
    return await GetCalendarItemResponse();
  }

  if (screen == "APPOINTMENT_SLOTS") {
    const appointment = data["slot"].split("/");
    const appointmentString = getAppointmentString(
      appointment[0],
      appointment[1],
    );

    return {
      screen: "FINAL",
      data: {
        slot: data["slot"],
        appointmentString: appointmentString,
        appointmentType: data["appointmentType"],
      },
    };
  }

  if (screen == "FINAL") {
    return await CreateAppointmentResponse(decryptedBody);
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

    //Vloerisolatie
    if (data["question_name"] == "vloerisolatie") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: GlasisolatieQuestion,
        };
      } else {
        return {
          screen: "RADIO_QUESTION",
          data: VloerisolatieKruipruimteQuestion,
        };
      }
    }
    if (data["question_name"] == "vloerisolatie_kruipruimte") {
      return {
        screen: "ADVIES",
        data: {
          advies:
            "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
            "Je hebt aangegeven dat je dak al is geïsoleerd. Je spouwmuur is reeds geïsoleerd! Je bent dus al flink op weg met energie besparen. Je vloer is nog niet geïsoleerd, we willen je graag helpen om je woning nòg duurzamer te maken.",
        },
      };
    }

    //Glasisolatie
    if (data["question_name"] == "glasisolatie") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: WarmtepompQuestion,
        };
      } else {
        return {
          screen: "ADVIES",
          data: {
            advies:
              "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
              "Je hebt aangegeven dat je dak al is geïsoleerd. Je spouwmuur is reeds geïsoleerd! Je bent dus al flink op weg met energie besparen. Daarnaast heb je je vloer ook al geïsoleerd. Glasisolatie heb je nog niet. Dit is een goede manier om je huis optimaal te isoleren!",
          },
        };
      }
    }

    //Warmtepomp
    if (data["question_name"] == "warmtepomp") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: ZonnepanelenQuestion,
        };
      } else {
        return {
          screen: "ADVIES",
          data: {
            advies:
              "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
              "Je hebt aangegeven dat je dak al is geïsoleerd. Je spouwmuur is reeds geïsoleerd! Je bent dus al flink op weg met energie besparen. Daarnaast heb je je vloer ook al geïsoleerd. Glasisolatie heb je al goed voor elkaar. Je geeft aan dat je nog geen warmtepomp hebt. Wist je dat die vanaf 2026 verplicht is bij vervanging van de CV-ketel? Maak er direct werk van!",
          },
        };
      }
    }

    //Zonnepanelen
    if (data["question_name"] == "zonnepanelen") {
      if (data["answer"] == "true") {
        return {
          screen: "RADIO_QUESTION",
          data: ZonnepanelenExtraQuestion,
        };
      } else {
        return {
          screen: "RADIO_QUESTION",
          data: ZonnepanelenTypeDakQuestion,
        };
      }
    }
    if (data["question_name"] == "zonnepanelen_extra") {
      if (data["answer"] == "true") {
        return {
          screen: "ADVIES",
          data: {
            advies:
              "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
              "Je hebt aangegeven dat je dak al is geïsoleerd. Je spouwmuur is reeds geïsoleerd! Je bent dus al flink op weg met energie besparen. Daarnaast heb je je vloer ook al geïsoleerd. Glasisolatie heb je al goed voor elkaar. Je hebt al een warmtepomp. Goed bezig! De zonnepanelen liggen al op het dak, maar je hebt aangegeven het systeem te willen uitbreiden. Dit is een fantastische manier om te besparen.",
          },
        };
      } else {
        return {
          screen: "HEEFT_ALLES",
          data: {},
        };
      }
    }
    if (data["question_name"] == "zonnepanelen_type_dak") {
      return {
        screen: "RADIO_QUESTION",
        data: ZonnepanelenSchaduwDakQuestion,
      };
    }
    if (data["question_name"] == "zonnepanelen_schaduw_dak") {
      return {
        screen: "ADVIES",
        data: {
          advies:
            "Bedankt voor het beantwoorden van de vragen. We geven je direct een advies. \n\n" +
            "Je hebt aangegeven dat je dak al is geïsoleerd. Je spouwmuur is reeds geïsoleerd! Je bent dus al flink op weg met energie besparen. Daarnaast heb je je vloer ook al geïsoleerd. Glasisolatie heb je al goed voor elkaar. Je hebt al een warmtepomp. Goed bezig! Dan blijven er alleen nog zonnepanelen over. Je eigen energie opwekken is een fantastische manier om te besparen.",
        },
      };
    }
  }
}

async function GetCalendarItemResponse() {
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

  return {
    screen: "APPOINTMENT_SLOTS",
    data: {
      all_slots: items,
    },
  };
}

async function CreateAppointmentResponse(decryptedBody: any) {
  const { screen, data, version, action, flow_token } = decryptedBody;

  const slot = data["slot"].split("/");

  const start = slot[0];
  const end = slot[1];

  const opmerking = data["opmerking"] ? data["opmerking"] : "Geen opmerking";

  const phoneNumber = "31614926018";

  const a = await CreateCalendarAppointment(
    start,
    end,
    `Afspraak met ${phoneNumber}`,
    `Afspraak via WhatsApp. Opmerking: ${opmerking}`,
  );

  console.log("a", a);

  return {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token,
          //...data,
        },
      },
    },
  };
}
