"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SendFlowMessage } from "@/lib/WhatsApp";
import { DisplayInvocations } from "@/components/DisplayInvocations";
import { Badge } from "@/components/ui/badge";

export function SendMessageComponent() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [flowToken, setFlowToken] = useState<string>();
  const [message, setMessage] = useState<any>();

  const onSend = () => {
    if (!phoneNumber || phoneNumber === "") {
      return;
    }

    const flowTokenT = crypto.randomUUID();
    setFlowToken(flowTokenT);

    SendFlowMessage(phoneNumber, flowTokenT).then((a) => setMessage(a));
  };

  return (
    <div style={{ margin: "25px" }}>
      <Input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder={"Telefoonnummer"}
        style={{ width: 250 }}
      />
      <Button onClick={onSend} disabled={!phoneNumber || phoneNumber === ""}>
        verstuur flow
      </Button>
      {message && (
        <h3>
          Status:{" "}
          <Badge variant={message.error ? "destructive" : "default"}>
            {message.error ? "Geen geldig telefoonnummer" : "Bericht verstuurd"}
          </Badge>
        </h3>
      )}
      <div style={{ paddingTop: "25px" }}>
        {flowToken && <DisplayInvocations flow_token={flowToken} />}
      </div>
    </div>
  );
}
