import {Injectable} from '@angular/core';
import {LogEntry, LogLevel} from "./logging.api";

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  level: LogLevel = LogLevel.All;
  logWithDate: boolean = true;

  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (!this.shouldLog(level)) return;

    const entry = new LogEntry();
    entry.message = msg;
    entry.level = level;
    entry.extraInfo = params;
    entry.logWithDate = this.logWithDate;

    console.log(entry.buildLogString());
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.level === LogLevel.Off) return false;
    if (this.level === LogLevel.All) return true;
    return level <= this.level
  }


}
