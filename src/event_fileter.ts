import {
  IconService,
  Block,
  BigNumber,
  Wallet,
  SignedTransaction,
  ConfirmedTransaction,
  TransactionResult,
  HttpProvider,
} from "icon-sdk-js";
import * as dotenv from "dotenv";
import { AppConfig, loadConfigFromEnv } from "./config_files";

dotenv.config();
export const config: AppConfig = loadConfigFromEnv();

// Create an instance of IconService with the HTTP provider
const iconService = new IconService(new HttpProvider(config.endpoint));

export async function waitEvent(sig: string[], cb: (e: EventLog[]) => void) {
  let latest = await iconService.getLastBlock().execute();
  let height = latest.height - 1;
  console.log(latest);
  const heights = BigNumber.isBigNumber(height)
    ? height
    : new BigNumber(height as number);
  let block = await iconService.getBlockByHeight(heights).execute();
  while (true) {
    while (height < latest.height) {
      const events = await filterEventFromBlock(
        block,
        sig,
        config.contract_address
      );
      if (events.length > 0) {
        cb(events);
      }
      height++;
      if (height === latest.height) {
        block = latest;
      } else {
        const heightss = BigNumber.isBigNumber(height)
          ? height
          : new BigNumber(height as number);
        block = await iconService.getBlockByHeight(heightss).execute();
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    latest = await iconService.getLastBlock().execute();
  }
}

async function filterEventFromBlock(
  block: Block,
  sig: string[],
  address?: string | undefined
): Promise<EventLog[]> {
  return Promise.all(
    block
      .getTransactions()
      .map((tx: ConfirmedTransaction) =>
        iconService.getTransactionResult(tx.txHash).execute()
      )
  ).then((results) => {
    return results
      .map((result: TransactionResult) => {
        return filterEvent(result.eventLogs as Array<EventLog>, sig, address);
      })
      .flat();
  });
}

export class EventLog {
  scoreAddress: string | undefined;
  indexed: string[] | undefined;
  data: string[] | undefined;
}

function filterEvent(
  eventLogs: any,
  sig: string[],
  address?: string
): Array<EventLog> {
  const filteredEvents: Array<EventLog> = [];
  <Array<EventLog>>eventLogs.filter((eventLog) => {
    for (let i = 0; i < sig.length; i++) {
      if (eventLog.indexed && eventLog.indexed[0].includes(sig[i])) {
        console.log(eventLog.indexed && eventLog.indexed[0].includes(sig[i]));
        filteredEvents.push(eventLog);
      }
    }
  });
  return filteredEvents;
}
