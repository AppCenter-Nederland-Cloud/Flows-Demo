"use client";

import { getInvocation } from "@/lib/DigitalOcean";
import { useEffect, useState } from "react";
import { QuestionsDataCard } from "@/components/DataCards/QuestionsDataCard";
import { BagDataCard } from "@/components/DataCards/BagDataCard";
import { ContactDataCard } from "@/components/DataCards/ContactDataCard";
import { UtilityDataCard } from "@/components/DataCards/UtilityDataCard";
import { FlowDataCard } from "@/components/DataCards/FlowDataCard";
import { AppointmentDataCard } from "@/components/DataCards/AppointmentDataCard";

export interface InvocationData {
  [index: string]: any;
}

interface DisplayInvocationsProps {
  flow_token: string;
}

export function DisplayInvocations(props: DisplayInvocationsProps) {
  const { flow_token } = props;

  const [data, setData] = useState<InvocationData>();

  useEffect(() => {
    setInterval(async () => {
      setData(await getInvocation(flow_token));
    }, 5000);
  }, [flow_token]);

  return data ? (
    <DisplayInvocationData data={data} flow_token={flow_token} />
  ) : (
    <>Data ophalen...</>
  );
}

interface DisplayInvocationDataProps {
  data: InvocationData;
  flow_token: string;
}
function DisplayInvocationData(props: DisplayInvocationDataProps) {
  const { data, flow_token } = props;

  return (
    <div>
      {data["screen"] && (
        <FlowDataCard
          phoneNumber={data["phoneNumber"]}
          screen={data["screen"]}
          flow_token={flow_token}
        />
      )}
      {data["BAG"] && <BagDataCard BAG={data["BAG"]} />}
      {data["contact"] && <ContactDataCard contact={data["contact"]} />}
      {data["utility"] && <UtilityDataCard utility={data["utility"]} />}
      {data["questions"] && <QuestionsDataCard questions={data["questions"]} />}
      {data["appointment"] && (
        <AppointmentDataCard appointment={data["appointment"]} />
      )}
    </div>
  );
}
