import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FlowDataCardProps {
  phoneNumber: string;
  screen: string;
  flow_token: string;
}
export function FlowDataCard(props: FlowDataCardProps) {
  const { phoneNumber, screen, flow_token } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flow</CardTitle>
        <CardDescription>De flow is actief</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>Gestart door: {phoneNumber}</li>
          <li>
            Laatste scherm: <Badge>{screen}</Badge>
          </li>
          <li>Flow token: {flow_token}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
