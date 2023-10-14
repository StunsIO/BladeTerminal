const express = require("express");
const { exec } = require("child_process");
const cmd = require("node-cmd");
const path = require("path");
const ejs = require("ejs");
var bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8013;
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use("/login", bodyParser.json());
app.use(
  "/login",
  bodyParser.urlencoded({
    extended: true,
  })
);
const longToken = generateToken(64);

let authenticated = false;

function requireAuth(req, res, next) {
  if (authenticated) {
    return next();
  } else {
    return res.redirect("/login");
  }
}

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  if (!req.body || !req.body.token) {
    res.status(401).json({
      success: false,
      message: "Authentication failed. Missing token field.",
    });
    return;
  }

  const { token } = req.body;
  if (token === longToken) {
    authenticated = true;
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please enter the correct token.",
    });
  }
});
app.post("/logout", (req, res) => {
  authenticated = false;
  res.redirect("/login");
});

app.get("/", requireAuth, (req, res) => {
  const platform = process.platform;
  res.render("index", { platform: platform });
});

app.post("/execute", [requireAuth, express.json()], (req, res) => {
  const command = req.body.command;
  const isWindows = process.platform === "win32";

  const actualCommand = isWindows ? `${command}` : command;

  const executeCommand = isWindows ? cmd.run : exec;

  executeCommand(actualCommand, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ output: stdout || stderr });
  });
});

app.get("/serverinfo", requireAuth, (req, res) => {
  let platform = process.platform;

  let commands = {
    win32: "systeminfo",
    linux: "free -h && df -h",
  };

  let command = commands[platform];

  if (!command) {
    res.status(500).json({ error: "Unsupported platform" });
    return;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    let info = stdout || stderr;

    if (platform === "win32") {
      info = info
        .replace(/^( +)/gm, (match) => "&nbsp;".repeat(match.length))
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");
    } else if (platform === "linux") {
      info = info
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");
    }

    res.send(info);
  });
});
function generateToken(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Your login token is: ${longToken}`);
});
