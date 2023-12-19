import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppointmentDataCardProps {
  appointment: { date: string; type: string; comment?: string };
}
export function AppointmentDataCard(props: AppointmentDataCardProps) {
  const { appointment } = props;
  const { date, type, comment } = appointment;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Afspraak</CardTitle>
        <CardDescription>Afspraak gemaakt</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>Datum: {date}</li>
          <li>Afspraak type: {type}</li>
          {comment && <li>Opmerking: {comment}</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
