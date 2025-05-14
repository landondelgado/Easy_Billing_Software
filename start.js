const { exec } = require("child_process");

if (process.env.NODE_ENV === "production") {
  console.log("Starting backend only (production mode)");
  exec("node server.js", (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
} else {
  console.log("Starting backend + frontend dev servers (dev mode)");
  exec('npx concurrently "node server.js" "npm run start --workspace=billingsoftware"', (err, stdout, stderr) => {
    if (err) console.error(err);
    else console.log(stdout);
  });
}