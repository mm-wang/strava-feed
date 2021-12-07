# strava-feed

Hacking together Strava's API to create a calendar feed that is hosted on a server and runs on a cron. This code needs some cleanup, although it will work as it stands.

### How it works
* The script will save an auth token to a file called `.access_token` and a refresh token called `.refresh_token`. 
* The script will use either the access token or the refresh token to get all the athlete activities
* Then it will collate those activities, save them to a file in a data directory
* Once those activities are saved, it will create a calendar of those events to be pulled and used. It will output a `.ics` file to be used either as an import or as a source if you have a server to read from. `run_start.sh` can be used to run the script if on a server.

// TODO: Check that `saveAuthToken` returns anything, and is callable within the script as is

### Getting Strava Data

1. Set up a Developer account with Strava: https://developers.strava.com/docs/getting-started/#account

2. Get OAuth set up with your athlete profile: https://developers.strava.com/docs/getting-started/#oauth
* Make sure scope is `&scope=activity:read_all,profile:read_all` to see all of your activity

```
http://localhost/exchange_token?state=&code=[STRAVA_AUTHORIZATION_CODE]&scope=read,activity:read_all,profile:read_all
```

### Setup

Set up environment variables to run the script. Create a `.env` file with the following variables:

**Strava**
* `STRAVA_CLIENT_ID` - from your developer account
* `STRAVA_CLIENT_SECRET` - from your developer account
* `STRAVA_AUTHORIZATION_CODE` - from the redirect auth above. Note that once you use the authorization code once, you will need a new one for a refresh token.

* `DATA_DIR` - for all of your data to live, something like `./data`. Make sure to create the folder too.
* `DATA_FILE` - for the JSON data file for the activities, something like `all.json`
* `CAL_FILE` - for the iCal file that you will generate, something like `all.ics`

Run `npm i` to install node modules, and once installed, `npm start` to run the script.

### Progress Output

Output will look something like this:

```
Environment variables loaded
Saving auth token
Collecting activities
Activities so far: 0, page: 1, per page: 200
Activities so far: 200, page: 2, per page: 200
Activities so far: 400, page: 3, per page: 200
Activities so far: 600, page: 4, per page: 200
Activities so far: 773, page: 5, per page: 200
Creating calendar events
Calendar saved!
```
