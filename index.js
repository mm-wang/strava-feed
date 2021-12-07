#!/usr/bin/env node

import dotenv from "dotenv";
import chalk from "chalk";

import { Strava } from "./modules/Strava.js";
import { Collator } from "./modules/Collator.js";
import { Calendar } from "./modules/Calendar.js";

/*
ENVIRONMENT VARIABLES
*/
dotenv.config({
    path: ".env"
});
console.log(chalk.yellow("Environment variables loaded"));

console.log(chalk.magenta("Saving auth token"));
let strava = new Strava();
await strava.saveAuthToken();

console.log(chalk.magenta("Collecting activities"));
let collator = new Collator();
await collator.saveAll();

console.log(chalk.magenta("Creating calendar events"));
let calendar = new Calendar();
calendar.saveCalendar();
