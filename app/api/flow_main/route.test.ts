import {expect, test} from "@jest/globals";
import {mainRouterActions} from "./route";

test('Screen Router', async () => {
    const decryptedBody = {
        screen: 'WELCOME',
        data: {
            keuze: 'Direct Plannen'
        },
        flow_token: 'jest-test'
    }
    const cal = await mainRouterActions(decryptedBody);
    expect(cal.screen).toBe("GEGEVENS");
});
