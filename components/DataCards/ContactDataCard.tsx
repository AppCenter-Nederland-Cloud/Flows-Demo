import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactDataCardProps {
  contact?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}
export function ContactDataCard(props: ContactDataCardProps) {
  const { contact } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contactgegevens</CardTitle>
        <CardDescription>Contactgegevens ingevuld</CardDescription>
      </CardHeader>
      <CardContent>
        {contact && (
          <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
            <li>Voornaam: {contact.first_name}</li>
            <li>Achternaam: {contact.last_name}</li>
            <li>E-Mailadres: {contact.email}</li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
