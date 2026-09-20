const fs = require("fs");
const path = require("path");


const filename = process.argv[2];


if (!filename) {

    console.log(
        "Usage: node scripts/newSong.js song_name.md"
    );

    process.exit(1);

}



if (!filename.endsWith(".md")) {

    console.log(
        "Filename must end with .md"
    );

    process.exit(1);

}



const filePath = path.join(
    __dirname,
    "../songs",
    filename
);



if (fs.existsSync(filePath)) {

    console.log(
        `${filename} already exists`
    );

    process.exit(1);

}



const template = `TITLE: abc


ARTIST: abc


CHORDS:
abc

STRUM:
dudud

CAPO:
no

---

[] ... abc

`;



fs.writeFileSync(
    filePath,
    template
);



console.log(
    `Created songs/${filename}`
);