// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    showAppVersionOnTitle: " - *** DEVELOPMENT VERSION ***",
    firebase: {
        apiKey: "AIzaSyBlOPmH-hJfaSiRurOf-VGAX6g5eeEa2nc",
        authDomain: "football-b1017.firebaseapp.com",
        databaseURL: "https://football-b1017.firebaseio.com",
        projectId: "football-b1017",
        storageBucket: "football-b1017.appspot.com",
        messagingSenderId: "218113412729"
    }
};
