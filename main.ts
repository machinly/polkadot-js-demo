import { ApiPromise, WsProvider} from '@polkadot/api';
import '@polkadot/api-augment';
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';


const WEB_SOCKET_URL = 'ws://localhost:9944';
const connect = async () => {
  const wsProvider = new WsProvider(WEB_SOCKET_URL);
  const api = await ApiPromise.create({ provider: wsProvider, types: {} });
  await api.isReady;
  return api;
}

const subscribeToEvents = async (api: ApiPromise) => {
    api.query.system.events((events) => {
        events.forEach((event) => {
            const { event: { data, method, section }, phase } = event;
            if (section === 'templateModule' && method === 'SomethingStored') {
                console.log(`new Something is: ${data}`);
            }
        });
    });
}


const main = async () => {
    const api = await connect();
    // accept event from the chain always


    // subscribe to events
    await subscribeToEvents(api);

    // block for 60 seconds
    await new Promise((resolve) => setTimeout(resolve, 600000));

}

main()
.then(() => {
    console.log('done');
    process.exit(0);
})
.catch(console.error)
.finally(() => process.exit());

