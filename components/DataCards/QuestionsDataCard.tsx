import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionsDataCardProps {
  questions: {
    [key: string]: any;
  };
}
export function QuestionsDataCard(props: QuestionsDataCardProps) {
  const { questions } = props;
  const keys = Object.keys(questions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vragen</CardTitle>
        <CardDescription>Ingevulde vragen</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          {keys.map((k, key) => (
            <li key={key}>
              {k}:{" "}
              <Badge>
                {questions[k] == "true" || questions[k] == "false"
                  ? questions[k] == "true"
                    ? "Ja"
                    : "Nee"
                  : questions[k]}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
