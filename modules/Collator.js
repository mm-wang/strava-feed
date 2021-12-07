import { Strava } from "./Strava.js";
import fs from 'fs';

function Collator() {
    const strava = new Strava();

    const generateAll = async () => {
        const per = 200;
        let activities = [];
        let page = 1;
        let length = 1;

        while (length > 0) {
            console.log(`Activities so far: ${activities.length}, page: ${page}, per page: ${per}`);
            let data = await strava.getAthleteActivities(page, per);
            activities = activities.concat(data);
            page++;
            length = data.length;
        }

        return activities;
    };

    const saveAll = async () => {
        let activities = await generateAll();
        fs.writeFileSync(process.env.DATA_DIR + "/" + process.env.DATA_FILE, JSON.stringify(activities));
    }

    return {
        generateAll,
        saveAll
    }
}

export { Collator };
