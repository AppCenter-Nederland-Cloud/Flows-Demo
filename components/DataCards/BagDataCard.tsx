import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BagDataCardProps {
  BAG: {
    straatnaam: string;
    huisnummer: number;
    postcode: string;
    woonplaats: string;
    gemeente: string;
    provincie: string;
    oppervlakte: number;
    bouwjaar: number;
    energielabel: string;
  };
}
export function BagDataCard(props: BagDataCardProps) {
  const { BAG } = props;
  const {
    straatnaam,
    huisnummer,
    postcode,
    woonplaats,
    gemeente,
    provincie,
    oppervlakte,
    bouwjaar,
    energielabel,
  } = BAG;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adresgegevens</CardTitle>
        <CardDescription>Adresgegevens ingevuld</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>
            Adres: {straatnaam} {huisnummer}
          </li>
          <li>Postcode: {postcode}</li>
          <li>Woonplaats: {woonplaats}</li>
          <li>Gemeente: {gemeente}</li>
          <li>Provincie: {provincie}</li>
          <li>Oppervlakte: {oppervlakte}</li>
          <li>Bouwjaar: {bouwjaar}</li>
          <li>
            Energielabel: <Badge>{energielabel}</Badge>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
