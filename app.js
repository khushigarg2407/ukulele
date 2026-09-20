let songs = [];

let currentSong = null;


// Load songs

async function loadSongs(){

    let files = [
        "husn.md"
    ];


    for(let file of files){

        let response = await fetch(
            "songs/" + file
        );

        let text = await response.text();

        songs.push(parseSong(text));

    }


    displaySongs(songs);

}



function parseSong(text){

    let lines = text.split("\n");


    let song = {

        title:"",
        artist:"",
        chords:[],
        lyrics:[]

    };


    lines.forEach(line=>{

        if(line.startsWith("TITLE:")){

            song.title =
            line.replace("TITLE:","").trim();

        }


        if(line.startsWith("ARTIST:")){

            song.artist =
            line.replace("ARTIST:","").trim();

        }


        if(line.startsWith("CHORDS:")){

            song.chords =
            lines[
                lines.indexOf(line)+1
            ].trim().split(" ");

        }


        if(line.includes("[")){

            let chord =
            line.match(/\[(.*?)\]/)[1];


            let text =
            line.replace(/\[(.*?)\]/,"");


            song.lyrics.push({

                chord,
                text

            });

        }


    });


    return song;

}



function displaySongs(list){

    let div =
    document.getElementById("songList");


    div.innerHTML="";


    list.forEach(song=>{


        let card =
        document.createElement("div");


        card.className="songCard";


        card.innerHTML=

        `
        <b>${song.title}</b>
        <br>
        ${song.artist}
        <br>
        &#127928; ${song.chords.join(" ")}
        `;


        card.onclick=()=>openSong(song);


        div.appendChild(card);


    });

}


function openSong(song){

    currentSong = song;

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("songPage")
        .classList.remove("hidden");


    document.getElementById("songTitle").innerText = song.title;

    document.getElementById("songArtist").innerText = song.artist;


    document.getElementById("songChords").innerText =
        song.chords.join("   ");


    let lyricsDiv = document.getElementById("lyrics");

    lyricsDiv.innerHTML = "";


    song.lyrics.forEach(line => {

        lyricsDiv.innerHTML +=

        `
        <div class="line">

            <span class="chord">
                ${line.chord}
            </span>

            <br>

            ${line.text}

        </div>
        `;

    });

}

function goBack(){

    document
    .getElementById("songPage")
    .classList.add("hidden");


    document
    .getElementById("homePage")
    .classList.remove("hidden");


    window.scrollTo(0,0);

}



search.oninput=function(){

    let value =
    search.value.toLowerCase();


    displaySongs(

        songs.filter(song=>

            song.title.toLowerCase().includes(value)

            ||

            song.artist.toLowerCase().includes(value)

            ||

            song.chords.join(" ")
            .toLowerCase()
            .includes(value)

        )

    );

}



// Auto Scroll



function startScroll(){

    stopScroll();

    scrollInterval=setInterval(()=>{

        window.scrollBy(
            0,
            scrollSpeed
        );

    },50);

}



function increaseSpeed(){

    scrollSpeed += 0.5;

    updateSpeed();

}



function decreaseSpeed(){

    if(scrollSpeed > 0.5){

        scrollSpeed -= 0.5;

    }

    updateSpeed();

}



function updateSpeed(){

    document.getElementById(
        "scrollSpeed"
    ).innerText =
    scrollSpeed.toFixed(1)+"x";

}

let scrollSpeed = 1;
let scrollInterval = null;


function toggleScroll(){

    let button = document.getElementById("scrollButton");


    if(scrollInterval){

        clearInterval(scrollInterval);

        scrollInterval = null;

        button.innerText = "▶";

    }
    else{

        scrollInterval = setInterval(()=>{

            window.scrollBy(
                0,
                scrollSpeed
            );

        },50);


        button.innerText = "Ⅱ";

    }

}



function increaseSpeed(){

    scrollSpeed += 0.5;

    updateSpeed();

}



function decreaseSpeed(){

    if(scrollSpeed > 0.5){

        scrollSpeed -= 0.5;

    }

    updateSpeed();

}



function updateSpeed(){

    document.getElementById("scrollSpeed")
    .innerText =
    scrollSpeed.toFixed(1)+"x";

}


loadSongs();