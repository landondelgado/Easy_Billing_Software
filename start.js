const { exec } = require("child_process");

if (process.env.NODE_ENV === "production") {
  // Only start the backend (Render)
  require('./server');
} else {
  // Start both frontend and backend (dev)
  exec("npx concurrently \"npm run backend\" \"npm run billingsoftware\"", (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
}