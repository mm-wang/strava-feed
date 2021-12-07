import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ical from 'ical-generator';

function Calendar() {
    const dirname = path.resolve();

    const loadData = () => {
        // To start, read from file
        const filepath = path.join(dirname, process.env.DATA_DIR + "/" + process.env.DATA_FILE);
        let data = fs.readFileSync(filepath, { encoding: 'utf-8' });
        let json = JSON.parse(data);
        return json;
    }

    const generateCalendar = () => {
        const cal = ical({
            prodId: {
                company: "Margaret Wang",
                product: "Strava Feed",
                language: "EN"
            },
            name: "Strava"
        });
        let activities = loadData();

        activities.forEach((each) => {
            let date = new Date(Date.parse(each.start_date));
            let duration = each.elapsed_time * 1000; //in milliseconds

            let end = new Date(date.getTime() + duration);
            let description = `Location: https://google.com/maps/place/${each.start_latitude},${each.start_longitude}\n` +
            `Timezone: ${each.timezone}\n` +
            `Distance: ${each.distance && (each.distance/1600).toFixed(2)} mi\n` + 
            `Moving time: ${each.moving_time && (each.moving_time/60).toFixed(2)} min\n` + 
            `Suffer: ${each.suffer_score}`;
            let location = each.start_latlng.length ? {
                title: `${each.start_latitude.toFixed(5)}, ${each.start_longitude.toFixed(5)}`,
                geo: {
                    lat: each.start_latitude,
                    lon: each.start_longitude,
                }
            } : null;
            cal.createEvent({
                start: date,
                end: end,
                summary: each.type,
                description: description,
                url: `https://strava.com/activities/${each.id}`,
                location: location
            });   
        });

        return cal;
    }

    const saveCalendar = () => {
        let calendar = generateCalendar();
        const filepath = path.join(dirname, process.env.DATA_DIR + "/" + process.env.CAL_FILE);
        calendar.saveSync(filepath);
        console.log(chalk.green("Calendar saved!"));

    }

    return {
        loadData,
        generateCalendar,
        saveCalendar
    }
}

export { Calendar }
