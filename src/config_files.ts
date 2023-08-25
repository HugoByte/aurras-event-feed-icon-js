import * as dotenv from "dotenv";
dotenv.config();

export interface AppConfig {
  chain_name: string | undefined;
  endpoint: string;
  contract_address: string | undefined;
  kafka_brokers: string[];
  openwhisk_api_key: string;
  openwhisk_namespace: string;
  openwhisk_host: string;
  event_reciever: string;
  event_processor: string;
  event_names: string[];
}

export function loadConfigFromEnv(): AppConfig {
  const chain_name = process.env.CHAIN_NAME;
  const endpoint = process.env.CHAIN_ENDPOINT;
  const contract_address = process.env.CONTRACT_ADRESS;
  const kafka_broker = process.env.KAFKA_BROKERS;
  const openwhisk_api_key = process.env.OPENWHISK_API_KEY;
  const openwhisk_namespace = process.env.OPENWHISK_NAMESPACE;
  const openwhisk_host = process.env.OPENWHISK_API_HOST;
  const event_reciever = process.env.EVENT_RECEIVER;
  const event_processor = process.env.EVENT_PROCESSOR;
  const event_name = process.env.EVENT_NAME;

  if (!endpoint) {
    throw new Error("Missing CHAIN_ENDPOINT environment variables.");
  }
  if (!event_name) {
    throw new Error("Missing EVENT_NAME environment variables.");
  }
  if (
    !openwhisk_api_key ||
    !openwhisk_namespace ||
    !openwhisk_host ||
    !kafka_broker
  ) {
    throw new Error(
      "Missing openwhisk environment variables. (openwhisk_api_key, openwhisk_namespace,openwhisk_host,kafka_broker)"
    );
  }

  if (!event_reciever || !event_processor) {
    throw new Error(
      "Missing action environment variables.(event_reciever,event_processor)"
    );
  }
  const event_names = event_name.split(";");
  const kafka_brokers = kafka_broker.split(";");

  return {
    chain_name,
    endpoint,
    contract_address,
    kafka_brokers,
    openwhisk_api_key,
    openwhisk_namespace,
    openwhisk_host,
    event_reciever,
    event_processor,
    event_names,
  };
}
