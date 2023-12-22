import {expect, test} from '@jest/globals';
import {getBagInformation} from "./getBagData";
import {GetCalendarSuggestions} from "./CalendarFunctions";
import {UpdateCommuniQateContact} from "./CommuniQate";
import {createDatabaseInvocation} from "./DigitalOcean";


test('Integratie - BAG', async () => {
    const bagInformation = await getBagInformation('7546PD 412');
    expect(bagInformation.success).toEqual(true);
}, 5000);

test('Integratie - Google Calendar', async () => {
    const cal = await GetCalendarSuggestions();
    expect(cal).toBeDefined();
}, 15000);

test('Integratie - Digital Ocean', async () => {
    const cal = await createDatabaseInvocation('jest-test', '31614926018');
    expect(cal).toBeDefined();
}, 5000);


test('Integratie - CommuniQate', async () => {
    const cal = await UpdateCommuniQateContact('Justin', 'ACN', 'justin@appcenternederland.nl', 'jest-test');
    expect(cal).toBeDefined();
}, 5000);

