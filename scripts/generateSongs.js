const fs = require("fs");
const path = require("path");


const songsFolder = path.join(__dirname, "../songs");


const files = fs.readdirSync(songsFolder)
    .filter(file => file.endsWith(".md"));


fs.writeFileSync(
    path.join(__dirname, "../songs.json"),
    JSON.stringify(files, null, 2)
);


console.log(
    `Generated songs.json with ${files.length} songs`
);