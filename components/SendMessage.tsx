"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SendFlowMessage } from "@/lib/WhatsApp";

export function SendMessageComponent() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [message, setMessage] = useState<any>();

  const onSend = async () => {
    if (!phoneNumber || phoneNumber === "") {
      return;
    }

    const message = await SendFlowMessage(phoneNumber);
    setMessage(message);
  };

  return (
    <div>
      <Input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder={"Telefoonnummer"}
      />
      <Button onClick={onSend} disabled={!phoneNumber || phoneNumber === ""}>
        verstuur flow
      </Button>
      {message && (
        <>
          <h3>Status:</h3>
          <p>
            {message.error ? "Geen geldig telefoonnummer" : "Bericht verstuurd"}
          </p>
        </>
      )}
    </div>
  );
}
