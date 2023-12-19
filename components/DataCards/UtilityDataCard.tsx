import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UtilityDataCardProps {
  utility: {
    energieverbruik: number;
    gasverbruik: number;
  };
}
export function UtilityDataCard(props: UtilityDataCardProps) {
  const { utility } = props;
  const { energieverbruik, gasverbruik } = utility;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verbruik</CardTitle>
        <CardDescription>Verbruik ingevuld</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>Energieverbruik: {energieverbruik}</li>
          <li>Gasverbruik: {gasverbruik}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
