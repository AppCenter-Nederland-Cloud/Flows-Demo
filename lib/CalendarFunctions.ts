export async function GetCalendarSuggestions(preferenceDate?: number) {
  const digitalOceanUrl = process.env.DIGITAL_OCEAN_URL;
  const digitalOceanAuth = process.env.DIGITAL_OCEAN_AUTH;
  const communiqateApiKey = process.env.COMMUNIQATE_API_KEY;
  const communiqateOrganizationId = process.env.COMMUNIQATE_ORGANIZATION_ID;

  const appointmentDuration = parseInt(
    process.env.CALENDAR_APPOINTMENT_DURATION || "0",
  );
  const timeBetweenAppointments = parseInt(
    process.env.CALENDAR_TIME_BETWEEN || "0",
  );
  const timeInAdvance = parseInt(process.env.CALENDAR_TIME_ADVANCE || "0");

  const googleCalendarId = process.env.GOOGLE_CALENDAR_ID;

  const suggestionsRes = await fetch(
    `${digitalOceanUrl}/Calendar/sendSuggestions`,
    {
      method: "POST",
      body: JSON.stringify({
        contactId: "08bc403b-68af-47a9-8676-bd52b718765c",
        sendMessage: "false",
        MESSAGE: "test",
        GOOGLE_CALENDAR_ID: googleCalendarId,
        CALENDAR_APPOINTMENT_DURATION: appointmentDuration,
        CALENDAR_TIME_BETWEEN_APPOINTMENTS: timeBetweenAppointments,
        CALENDAR_TIME_IN_ADVANCE: timeInAdvance,
        COMMUNIQATE_API_KEY: communiqateApiKey,
        COMMUNIQATE_ORGANIZATION_ID: communiqateOrganizationId,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-Require-Whisk-Auth": digitalOceanAuth ?? "",
      },
    },
  ).then((r) => r.json());

  return suggestionsRes["sendSuggestions"]["weeks"];
}

export async function CreateCalendarAppointment(
  start: string,
  end: string,
  title: string,
  description: string,
) {
  const digitalOceanUrl = process.env.DIGITAL_OCEAN_URL;
  const digitalOceanAuth = process.env.DIGITAL_OCEAN_AUTH;
  const communiqateApiKey = process.env.COMMUNIQATE_API_KEY;
  const communiqateOrganizationId = process.env.COMMUNIQATE_ORGANIZATION_ID;

  const appointmentDuration = parseInt(
    process.env.CALENDAR_APPOINTMENT_DURATION || "0",
  );
  const timeBetweenAppointments = parseInt(
    process.env.CALENDAR_TIME_BETWEEN || "0",
  );
  const timeInAdvance = parseInt(process.env.CALENDAR_TIME_ADVANCE || "0");

  const googleCalendarId = process.env.GOOGLE_CALENDAR_ID;

  return await fetch(`${digitalOceanUrl}/Calendar/createAppointment`, {
    method: "POST",
    body: JSON.stringify({
      contactId: "08bc403b-68af-47a9-8676-bd52b718765c",
      startDate: start,
      endDate: end,
      title: title,
      description: description,
      COMMUNIQATE_API_KEY: communiqateApiKey,
      COMMUNIQATE_ORGANIZATION_ID: communiqateOrganizationId,
      GOOGLE_CALENDAR_ID: googleCalendarId,
      REMINDER_TEMPLATE_TIME: "30",
      reminderMessage: {},
      //     type: "TEMPLATE",
      //     template: {
      //         template_variant_version_id: "reminder_template_id",
      //         body_params: [
      //             "communiqate.contact.first_name",
      //             "communiqate.attributes.naam-adviseur-dbp.value",
      //             "parsedString"
      //         ]
      //     }
      // }
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Require-Whisk-Auth": digitalOceanAuth ?? "",
    },
  }).then((r) => r.json());
}
