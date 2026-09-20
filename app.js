let songs = [];
let currentSong = null;

let scrollSpeed = 1;
let scrollInterval = null;


// Load songs

let files = [];


async function loadSongs(){

    let response = await fetch("songs.json");

    files = await response.json();


    for(let file of files){

        let songResponse = await fetch(
            "songs/" + file
        );

        let text = await songResponse.text();

        songs.push(parseSong(text));

    }


    displaySongs(songs);

}




function parseSong(text){

    let lines = text
        .split("\n");


    let song = {

        title:"",
        artist:"",
        chords:[],
        strum:"",
        capo:"",
        lyrics:[],
        mode:"raw"

    };


    let lyricsStarted = false;
    let rawLyrics = [];



    lines.forEach((line,index)=>{


        if(line.trim() === "---"){

            lyricsStarted = true;
            return;

        }


        if(lyricsStarted){

            rawLyrics.push(line);

            return;

        }



        let clean = line.trim();



        if(clean.startsWith("TITLE:")){

            song.title =
            clean.replace("TITLE:","").trim();

        }



        if(clean.startsWith("ARTIST:")){

            song.artist =
            clean.replace("ARTIST:","").trim();

        }



        if(clean.startsWith("CHORDS:")){

            song.chords =
            clean.replace("CHORDS:","")
            .trim()
            .split(" ");

        }



        if(clean.startsWith("STRUM:")){

            if(clean.length > 6){

                song.strum =
                clean.replace("STRUM:","").trim();

            }
            else{

                song.strum =
                getNextValue(lines,index);

            }

        }



        if(clean.startsWith("CAPO:")){

            if(clean.length > 5){

                song.capo =
                clean.replace("CAPO:","").trim();

            }
            else{

                song.capo =
                getNextValue(lines,index);

            }

        }


    });



    song.mode =
    rawLyrics.some(
        line => /\[.*?\]/.test(line)
    )
    ?
    "chord"
    :
    "raw";



    song.lyrics =
    song.mode === "raw"
    ?
    rawLyrics.join("\n")
    :
    rawLyrics;



    return song;

}




function getNextValue(lines,index){

    for(let i=index+1;i<lines.length;i++){

        if(lines[i].trim() !== ""){

            return lines[i].trim();

        }

    }

    return "";

}





function displaySongs(list){

    let div =
    document.getElementById("songList");


    div.innerHTML="";


    list.forEach(song=>{


        let card =
        document.createElement("div");


        card.className="songCard";


        card.innerHTML=`

        <h3>🎵 ${song.title}</h3>

        <div class="artist">
        ${song.artist}
        </div>

        <div class="cardChords">
        🎸 ${song.chords.join(" ")}
        </div>

        `;


        card.onclick=()=>openSong(song);


        div.appendChild(card);


    });

}




function openSong(song){

    currentSong = song;


    document
    .getElementById("homePage")
    .classList.add("hidden");


    document
    .getElementById("songPage")
    .classList.remove("hidden");



    document.getElementById("songTitle")
    .innerText=song.title;


    document.getElementById("songArtist")
    .innerText=song.artist;



    document.getElementById("songChords")
    .innerHTML=`

    🎸 ${song.chords.join(" ")}

    <br>

    🥁 ${song.strum}

    <br>

    🎤 Capo: ${song.capo}

    `;



    let lyricsDiv =
    document.getElementById("lyrics");


    lyricsDiv.innerHTML="";



    if(song.mode==="raw"){


        lyricsDiv.innerHTML=`

        <pre class="rawLyrics">
        ${song.lyrics}
        </pre>

        `;


    }
    else{


        song.lyrics.forEach(line=>{


            let formatted =
            line.replace(
                /\[(.*?)\]/g,
                `<span class="chord">$1</span>`
            );


            lyricsDiv.innerHTML +=`

            <div class="line">
            ${formatted}
            </div>

            `;


        });


    }


}




function goBack(){

    document
    .getElementById("songPage")
    .classList.add("hidden");


    document
    .getElementById("homePage")
    .classList.remove("hidden");


    stopScroll();

}




function stopScroll(){

    if(scrollInterval){

        clearInterval(scrollInterval);

        scrollInterval=null;

    }

}




function toggleScroll(){

    let button =
    document.getElementById("scrollButton");


    if(scrollInterval){

        stopScroll();

        button.innerText="▶";

    }
    else{


        scrollInterval=setInterval(()=>{

            window.scrollBy(
                0,
                scrollSpeed
            );

        },50);


        button.innerText="Ⅱ";

    }

}




function increaseSpeed(){

    scrollSpeed+=0.5;

    updateSpeed();

}



function decreaseSpeed(){

    if(scrollSpeed>0.5){

        scrollSpeed-=0.5;

    }

    updateSpeed();

}



function updateSpeed(){

    document.getElementById("scrollSpeed")
    .innerText=
    scrollSpeed.toFixed(1)+"x";

}





document
.getElementById("search")
.oninput=function(){

    let value =
    this.value.toLowerCase();


    displaySongs(

        songs.filter(song=>

            song.title.toLowerCase()
            .includes(value)

            ||

            song.artist.toLowerCase()
            .includes(value)

        )

    );


};





loadSongs();