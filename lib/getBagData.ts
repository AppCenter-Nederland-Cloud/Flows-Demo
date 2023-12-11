
async function getBag(query: string) {
    const BAG_API_KEY = process.env.BAG_API_KEY;

    const url = 'https://api.bag.kadaster.nl/lvbag/individuelebevragingen/v2/adressen';
    const options: any = {
        method: "GET",
        headers: {
            "x-api-key": BAG_API_KEY,
        }
    };

    return await fetch(`${url}?q=${query}&expand=true`, options).then((a) => {
        return a.json();
    });
}
async function getEnergieLabel(adresseerbaarObjectIdentificatie: string) {
    const ENERGIELABEL_API_KEY = process.env.EP_ONLINE_API_KEY;
    const url = 'https://public.ep-online.nl/api/v3/PandEnergielabel/AdresseerbaarObject';
    const options: any = {
        method: "GET",
        headers: {
            "Authorization": ENERGIELABEL_API_KEY,
        }
    };

    return await fetch(`${url}/${adresseerbaarObjectIdentificatie}`, options).then((a) => {
        return a.json();
    });
}
async function getBronhouder(url: string) {
    const BAG_API_KEY = process.env.BAG_API_KEY;

    const options: any = {
        method: "GET",
        headers: {
            "x-api-key": BAG_API_KEY
        }
    };

    return await fetch(url, options).then((a) => { return a.json(); });
}
export async function getBagInformation(query: string) {


    const bag = await getBag(query);

    if (!bag || !bag['_embedded']) {
        return {
            success: false,
            data: null
        };
    }

    if (!bag || bag.status && bag.status == 404) {
        return {
            success: false,
            data: null
        };
    }

    const bagData = bag['_embedded'].adressen[0];
    const pandData = bagData['_embedded'].panden[0].pand;
    const objectData = bagData['_embedded'].adresseerbaarObject.verblijfsobject.verblijfsobject;

    const adresseerbaarObjectIdentificatie = bagData.adresseerbaarObjectIdentificatie;

    const straatnaam = bagData.openbareRuimteNaam;
    const huisnummer = bagData.huisletter ? `${bagData.huisnummer}${bagData.huisletter}`: `${bagData.huisnummer}`;
    const postcode = bagData.postcode;
    const woonplaats = bagData.woonplaatsNaam;
    const bouwjaar = pandData.oorspronkelijkBouwjaar;
    const oppervlakte = objectData.oppervlakte;

    let gemeente = 'Onbekend', provincie = 'Onbekend';

    const bronhouderUrl = bagData['_embedded'].woonplaats['_links'].bronhouders[0].href;

    if (bronhouderUrl) {
        const bronhouder = await getBronhouder(bronhouderUrl);

        gemeente = bronhouder.bronhouder.naam;
        provincie = bronhouder.bronhouder.provincie.naam;
    }

    const energieLabel = await getEnergieLabel(adresseerbaarObjectIdentificatie);

    const woningtype = energieLabel && energieLabel.length > 0 && energieLabel[0].gebouwtype ? energieLabel[0].gebouwtype : "Onbekend";
    const label = energieLabel && energieLabel.length > 0 && energieLabel[0].labelLetter ?  energieLabel[0].labelLetter : "Onbekend";

    return {
        success: true,
        data: {
            straatnaam: straatnaam,
            huisnummer: huisnummer,
            postcode: postcode,
            bouwjaar: bouwjaar,
            woonplaats: woonplaats,
            oppervlakte: oppervlakte,
            woningtype: woningtype,
            energielabel: label,
            gemeente: gemeente,
            provincie: provincie
        }
    };
}