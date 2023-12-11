export interface RadioQuestion {
  title: string;
  subtitle: string;
  question_name: string;
  options: {
    id: string;
    title: string;
    description?: string;
  }[];
}

//Dakisolatie
export const DakisolatieQuestion: RadioQuestion = {
  title: "Is je dak al geïsoleerd?",
  subtitle:
    "De eerste stap in het verduurzamen van een woning is dakisolatie. Omdat warmte stijgt, kan een groot deel van de warmte via het dak ontsnappen als het niet goed geïsoleerd is. Zonde! Door het dak te isoleren, verminder je het warmteverlies en daardoor heb je lagere stookkosten.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "dakisolatie",
};
export const DakisolatieAfwerkingQuestion: RadioQuestion = {
  title: "Is je dak van binnen afgewerkt?",
  subtitle:
    "Het is belangrijk om te weten of je dak van binnen is afgewerkt. Als je dak niet afgewerkt is, kijk je direct tegen hout of tegen de dakpannen aan. Als je dak wel afgewerkt is, kijk je waarschijnlijk tegen gipsplaten of een andere afwerking aan.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "dakisolatie_afwerking",
};
export const DakisolatieAfwerkingDetailsQuestion: RadioQuestion = {
  title: "Wil je dakisolatie afgewerkt hebben?",
  subtitle:
    'Het dak wordt bij isolatie alsnog van binnen afgewerkt met gips of platen. Dan is schilderen niet nodig.\n\nAls je alleen isolatieplaten wil zonder afwerking, kies dan voor "Nee".',
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "dakisolatie_afwerking_details",
};

//Spouwmuurisolatie
export const SpouwmuurisolatieQuestion: RadioQuestion = {
  title: "Is je spouwmuur al geïsoleerd?",
  subtitle:
    "Top! Omdat je dak al is geïsoleerd, is de volgende stap spouwmuurisolatie. Eén van de belangrijkste redenen voor spouwmuurisolatie is de vermindering van warmteverlies door de muren van het huis. Door de spouw te isoleren, wordt de warmte beter vastgehouden. Zo is er minder energie nodig om het huis te verwarmen en heb je lagere stookkosten.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "spouwmuurisolatie",
};
export const SpouwmuurisolatieAanbouwQuestion: RadioQuestion = {
  title: "Heeft je woning een aanbouw?",
  subtitle:
    "Heb je woning een aanbouw die eventueel meegeïsoleerd moet worden? Om je een accuraat advies te geven willen we graag weten of je woning een aanbouw heeft.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "spouwmuurisolatie_aanbouw",
};
export const SpouwmuurisolatieKruipruimteQuestion: RadioQuestion = {
  title: "Heeft de woning een kruipruimte dieper dan 45cm?",
  subtitle:
    'Als je kruipruimte diep genoeg is, kunnen de installateurs beter bij de spouwmuur. Dat maakt het makkelijker om isolatiemateriaal aan te brengen. Als je geen kruipruimte hebt, druk dan op "Nee".',
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "spouwmuurisolatie_kruipruimte",
};

//Vloerisolatie
export const VloerisolatieQuestion: RadioQuestion = {
  title: "Is je vloer al geïsoleerd?",
  subtitle:
    "De volgende stap is vloerisolatie. Met vloerisolatie heb je, behalve warmere voeten, een stuk minder warmteverlies via de vloer naar de ondergrond. Je hebt dus minder energie nodig om je huis te verwarmen en krijgt een lagere energierekening.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "vloerisolatie",
};

export const VloerisolatieKruipruimteQuestion: RadioQuestion = {
  title: "Heeft de woning een kruipruimte dieper dan 45cm?",
  subtitle:
    'Een kruipruimte biedt toegang tot de onderkant van de vloer, waardoor het voor installateurs mogelijk wordt om isolatiemateriaal aan te brengen zonder de bovenkant van de vloer te hoeven openbreken. Als je geen kruipruimte hebt, Druk dan op "Nee".',
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "vloerisolatie_kruipruimte",
};

//Glasisolatie
export const GlasisolatieQuestion: RadioQuestion = {
  title: "Heb je al glasisolatie?",
  subtitle:
    "Dan komen we bij glasisolatie. Goed geïsoleerd glas (bijvoorbeeld HR+ of Triple) vermindert het warmteverlies door ramen enorm. Je hebt dus minder energie nodig om je huis te verwarmen in de winter en te koelen in de zomer. En je raadt het al: een lagere energierekening.\n",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "glasisolatie",
};

//Warmtepomp
export const WarmtepompQuestion: RadioQuestion = {
  title: "Heb je al een warmtepomp?",
  subtitle:
    "Ook een warmtepomp is een goede manier om energie te besparen. Deze is meestal efficiënter dan gebruikelijke verwarmings- en koelsystemen, omdat ze energie verplaatsen in plaats van deze te produceren. Je kan er dus een hoop energiekosten mee besparen.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "warmtepomp",
};

//Zonnepanelen
export const ZonnepanelenQuestion: RadioQuestion = {
  title: "Heb je al zonnepanelen?",
  subtitle:
    "Zonnepanelen zijn vaak de laatste stap in het energiezuinig maken van een woning. Het is een geweldige manier om te besparen. Uit onderzoek blijkt ook dat huizen met zonnepanelen vaak een hogere waarde hebben en sneller verkopen dan huizen zonder zonnepanelen.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "zonnepanelen",
};

export const ZonnepanelenExtraQuestion: RadioQuestion = {
  title: "Uitbereiden",
  subtitle: "Wil je dit systeem uitbreiden met extra zonnepanelen?",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "zonnepanelen_extra",
};

export const ZonnepanelenTypeDakQuestion: RadioQuestion = {
  title: "Welk type dak heb je?",
  subtitle:
    "Wat voor dak je hebt beïnvloedt de hoeveelheid zonlicht die de panelen ontvangen. Denk aan een schuin of plat dak en de richting waarin de zonnepanelen komen te liggen.",
  options: [
    {
      id: "schuin",
      title: "Schuin dak",
    },
    {
      id: "plat",
      title: "Plat dak",
    },
    {
      id: "allebei",
      title: "Allebei",
    },
  ],
  question_name: "zonnepanelen_type_dak",
};

export const ZonnepanelenSchaduwDakQuestion: RadioQuestion = {
  title: "Valt er schaduw op het dak?",
  subtitle:
    "Een boom, naburig gebouw, schoorsteen of dakkapel kan wat zonlicht wegnemen op je dak.",
  options: [
    {
      id: "true",
      title: "Ja",
    },
    {
      id: "false",
      title: "Nee",
    },
  ],
  question_name: "zonnepanelen_schaduw_dak",
};
