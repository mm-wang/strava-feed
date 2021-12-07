import fetch from 'node-fetch';
import fs from 'fs';

function Strava() {
    // https://www.strava.com/oauth/authorize?client_id=74964&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all,profile:read_all to auth
    // Copy `code` param and use for STRAVA_AUTHORIZATION_CODE
    const getAuthToken = async () => {
        const url = 'https://www.strava.com/api/v3/oauth/token';
        const params = new URLSearchParams();
        params.append('client_id', process.env.STRAVA_CLIENT_ID);
        params.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        params.append('code', process.env.STRAVA_AUTHORIZATION_CODE);
        params.append('grant_type', 'authorization_code');

        let response = await fetch(url, {
            method: "POST",
            body: params
        });
        let data = await response.json();
        let code = await response.status;

        if (code >= 400) {
            console.log("Error with the auth request: ", url, code, data);
            return null;
        }

        return data;
    };

    const refreshAuthToken = async () => {
        let refresh = fs.readFileSync("./.refresh_token").toString();

        const url = 'https://www.strava.com/api/v3/oauth/token';
        const params = new URLSearchParams();
        params.append('client_id', process.env.STRAVA_CLIENT_ID);
        params.append('client_secret', process.env.STRAVA_CLIENT_SECRET);
        params.append('refresh_token', refresh);
        params.append('grant_type', 'refresh_token');

        let response = await fetch(url, {
            method: "POST",
            body: params
        });
        let data = await response.json();
        let code = await response.status;

        if (code >= 400) {
            console.log("Error with the refresh request: ", url, code, data);
            return null;
        }

        return data;

    }

    const saveAuthToken = async () => {
        let authed = await getAuthToken();
        if (!authed) return null;
        // let type = authed.token_type;
        // let until = authed.expires_at;
        // let expires = authed.expires_in;
        
        // let athlete = authed.athlete;

        let refresh = authed.refresh_token;
        let token = authed.access_token;
        fs.writeFileSync('./.refresh_token', refresh);
        fs.writeFileSync('./.access_token', token);
        return token;
    }

    const saveRefreshedToken = async () => {
        let refreshed = await refreshAuthToken();
        if (!refreshed) return null;

        console.log("Saving refreshed token: ", refreshed);
        let refresh = refreshed.refresh_token;
        let token = refreshed.access_token;
        fs.writeFileSync('./.refresh_token', refresh);
        fs.writeFileSync('./.access_token', token);

        fs.writeFileSync('./.update_token', JSON.stringify(refreshed));
        return token;
    }

    const getAthleteActivities = async (page, per, before, after) => {
        const url = 'https://www.strava.com/api/v3/athlete/activities?';
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (per) params.append('per_page', per);
        if (before) params.append('before', before);
        if (after) params.append('after', after);

        let requestFromStrava = async (token) => {
            return await fetch(url + params, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            });
        }
        // Yeah... I hacked it.
        let token = fs.readFileSync("./.access_token").toString();
        let response = await requestFromStrava(token);

        if (!(response && response.ok)) {
            token = await saveRefreshedToken();
            response = await requestFromStrava(token);
        }

        let data = await response.json();

        return data;
    };

    return {
        getAuthToken,
        refreshAuthToken,
        saveAuthToken,
        saveRefreshedToken,
        getAthleteActivities,
    }
}

export { Strava };
