import fs from 'fs';
import util from 'util';
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(import.meta.url);
const fileLog = path.join(path.dirname(__dirname), "debug.log");

const log_file = fs.createWriteStream(fileLog, { flags: 'w+' });
const log_stdout = process.stdout;

const tags = {
    INFO: "INFO",
    ERROR: "ERROR",
    WARN: "WARN",
}

/**
 * 
 * @param {String} tag tag in tags array
 * @param {any[]} messages 
 */
function Print(tag, ...messages) {
    const date = new Date()
    const formatString = util.format(date.toISOString(), tag, ...messages)

    log_file.write(formatString + '\n');
    log_stdout.write(formatString + '\n');
}

export default {
    Info: (...messages) => Print(tags.INFO, ...messages),
    Error: (...messages) => Print(tags.ERROR, ...messages),
    Warn: (...messages) => Print(tags.WARN, ...messages),
}