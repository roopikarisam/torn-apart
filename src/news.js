// import parse from "csv-parse";
import EventEmitter from "events";
import { stdout, stdin } from "process";
import apiKey from "./news/api-key";

const emitter = new EventEmitter();

stdin.setEncoding("utf8");

stdout.write("Welcome to the Torn Apart/Separados Google news sniffer.\n");
apiKey(emitter);
