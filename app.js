const hamburger_menu = document.querySelector(".menu");
const sidebar = document.querySelector(".sidebar");
let isSidebar = false;
hamburger_menu.addEventListener("click" , ()=>{
    if(isSidebar == false){
        sidebar.classList.remove("hide");
        sidebar.classList.add("show");
        isSidebar = true;
    }
    else{
        sidebar.classList.add("hide");
        sidebar.classList.remove("show");
        isSidebar = false;
    }
})


// Song class

class Song {
    constructor(title , artist , path , cover){
        this.title = title;
        this.artist = artist;
        this.path = path;
        this.cover = cover;
        this.duration = "";
    }
}

// DOM element selection
    const mobileTitle = document.querySelector(".m-title");
    const mobileArtist = document.querySelector(".m-artist");
    const laptopTitle = document.querySelector(".l-title");
    const laptopArtist = document.querySelector(".l-artist");
    const mobileCoverImage = document.querySelector(".mobile-cover");
    const laptopCoverImage = document.querySelector(".laptop-cover");
    const playBtn = document.querySelectorAll(".playbtn");
    const progress = document.querySelector("#progress");
    const volume = document.querySelector("#volume");
    const backwardBtn = document.querySelector(".backbtn");
    const forwardBtn = document.querySelector(".nextbtn");
    const liveVolume = document.querySelector(".total-volume");
    const songList = document.querySelector(".song-list");
    const searchInput = document.querySelector(".search-input");
    const resumeButton = document.getElementById("resume");
    
    
// add songs here
const song1 = new Song("Motivate-Me" , "Mixaund" , "assets/music/motivate-me.mp3" , "assets/posters/mixaund-motivate-me.jpg");
const song2 = new Song("Happy Days" , "FSM Team" , "assets/music/happy-days.mp3" , "assets/posters/fsm-team-happy-days.jpg");

// MusicPlayer class
class MusicPlayer{
    constructor(){
        this.songs = [];
        const savedSong = localStorage.getItem("lastSong");
        this.currentSongIdx = savedSong != null ? Number(savedSong) : 0;
        this.audio = new Audio();
        this.updateTime();
        this.handleSongEnd();
        this.handleMetaData();
    }
    addSong(song) {
        this.songs.push(song);
        this.loadSongDuration(song);
    }
    loadSongDuration(song){
        let tempAudio = new Audio();
        tempAudio.src = song.path;
        tempAudio.addEventListener("loadedmetadata" , ()=>{
            song.duration = tempAudio.duration;
            this.displaySong(song);
        })
    }
    displaySong(song){
        const totalDuration = Math.floor(song.duration);
        const minute = Math.floor(totalDuration / 60);
        let second = totalDuration % 60;
        if(second < 10){ second = "0" + second}
        let index = this.songs.indexOf(song);
        const songCard = ` 
            <section class="song" data-index="${index}" >
                <div class="details">
                    <img src=${song.cover} alt="cover image">
                    <div class="name">
                        <h5>${song.title}</h5>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="duration">
                    <p>${minute}:${second}</p>
                </div>
            </section>
        `;
        songList.insertAdjacentHTML("beforeend" , songCard);
    }
    loadSong(){
        if (this.currentSongIdx < 0 || this.currentSongIdx >= this.songs.length){
            this.currentSongIdx = 0;
        }

        let currentSong = this.songs[this.currentSongIdx];
        mobileTitle.innerText = currentSong.title;
        mobileArtist.innerText = currentSong.artist;
        mobileCoverImage.src = currentSong.cover;

        laptopTitle.innerText = currentSong.title;
        laptopArtist.innerText = currentSong.artist;
        laptopCoverImage.src = currentSong.cover;
        // add code to change cover page similerly

        this.saveSong(this.currentSongIdx);
        this.audio.src = currentSong.path;
        this.audio.load();

        this.audio.addEventListener("loadedmetadata", () => {
            this.loadTime();
        }, { once: true });
    }
    saveSong(song){
        localStorage.setItem("lastSong", song);
    }
    play(){
        this.audio.play();
        this.updatePlayIcon(true);
        this.highlightPlayingSong();
    }
    pause(){
        this.audio.pause();
        this.updatePlayIcon(false);
    }
    togglePlay(){
        if(this.audio.paused){
            this.play();
        }
        else{
            this.pause();
        }
    }
    updatePlayIcon(isPlaying){
        playBtn.forEach((btn)=>{
            if(isPlaying){
                btn.classList.remove("ri-play-circle-fill");
                btn.classList.add("ri-pause-circle-fill");
            }
            else{
                btn.classList.remove("ri-pause-circle-fill");
                btn.classList.add("ri-play-circle-fill");
            }
        })
    }
    next(){
        this.currentSongIdx++;
        if(this.currentSongIdx > this.songs.length - 1){
            this.currentSongIdx = 0;
        }
        this.loadSong();
        this.play();
    }
    previous(){
        this.currentSongIdx--;
        if(this.currentSongIdx < 0){
            this.currentSongIdx = this.songs.length - 1;
        }
        this.loadSong();
        this.play();
    }
    progressBar(){
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        if(isNaN(duration) || duration == 0){
            return;
        }
        this.saveTime(currentTime);
        let percentage =(currentTime / duration) * 100;
        progress.value = percentage;                 // for mobile progress bar
        progress.style.setProperty("--progress" , `${percentage}%`);
    }
    loadTime(){
        const savedData = localStorage.getItem("songProgress");
        if(savedData != null){
            const data = JSON.parse(savedData);

            if (data.index === this.currentSongIdx) {
                this.audio.currentTime = data.time;
            }
        }

    }
    saveTime(time){
        const data = {
            index: this.currentSongIdx,
            time: time
        };

        localStorage.setItem("songProgress", JSON.stringify(data));
    }
    updateTime(){
        this.audio.addEventListener("timeupdate" , ()=>{
            this.progressBar();
        })
    }
    seek(percentage){
        const duration =  this.audio.duration;
        let newTime = (percentage * duration) / 100;
        this.audio.currentTime = newTime;
    }
    updateVolume(value){
        this.audio.volume = value;
        this.saveVolume(value);
        liveVolume.textContent = `${Math.floor(value * 100)}%`;
    }

    loadVolume(){
        const savedVolume = localStorage.getItem("volume");
        if(savedVolume !== null){
            const volumeValue = Number(savedVolume);

            this.audio.volume = volumeValue;
            volume.value = volumeValue;
            
            liveVolume.textContent = `${Math.floor(volumeValue * 100)}%`;
        }
        else{
            liveVolume.textContent = `${Math.floor(volume.value * 100)}%`;
        }
    }
    saveVolume(volume){
        localStorage.setItem("volume" , volume);
    }
    handleMetaData(){
        this.audio.addEventListener("loadedmetadata" , ()=>{
            this.loadVolume();
        })
    }
    handleSongEnd(){
        this.audio.addEventListener("ended" , ()=>{
            this.next();
        })
    }
    songPlayOnClick(song){
        this.currentSongIdx = Number(song.dataset.index);
        this.loadSong();
        this.play();
    }
    highlightPlayingSong(){
        const cards = document.querySelectorAll(".song");

        cards.forEach((card) => {
            card.classList.remove("song-highlight");
        });

        const currentCard = document.querySelector(
            `.song[data-index="${this.currentSongIdx}"]`
        );

        currentCard.classList.add("song-highlight");
    }
    searchHandle(){
        searchInput.addEventListener("input" , (e) => {
            const searchText = e.target.value;

            const filterSongs = this.songs.filter(song =>{ 
                return song.title.toLowerCase().includes(searchText.toLowerCase())
            });

            songList.innerHTML = "";

            filterSongs.forEach(song => this.displaySong(song));

        });
    }
}

// adding songs
const player = new MusicPlayer;

player.addSong(song1);
player.addSong(song2);

player.loadSong();
// play & pause system
playBtn[0].addEventListener("click" , ()=>{
   player.togglePlay(); 
});
playBtn[1].addEventListener("click" , ()=>{
   player.togglePlay(); 
});

// progress bar update on drag
progress.addEventListener("input", ()=>{
    player.seek(progress.value);
})

// volume update on drag
volume.addEventListener("input" , ()=>{
    player.updateVolume(volume.value);
})

// volume load from local storage
player.loadVolume();

// next and previous song button logic
backwardBtn.addEventListener("click" , ()=>{
    player.previous();
})

forwardBtn.addEventListener("click" , ()=>{
    player.next();
})

// song play on click on any song
songList.addEventListener("click" ,(e) =>{
    const song = e.target.closest(".song");
    if (!song) return;

    player.songPlayOnClick(e.target.closest(".song"));
})

// Search feature
player.searchHandle();

//Resume button on top
const icon = document.querySelector(".top-icon");
let state = 0;
resumeButton.addEventListener("click" , ()=>{
    
    if(state == 0){
        icon.classList.remove("ri-play-mini-fill");
        icon.classList.add("ri-pause-mini-fill");
        state = 1;
        player.play();
    }
    else{
        icon.classList.remove("ri-pause-mini-fill");
        icon.classList.add("ri-play-mini-fill");
        state = 0;
        player.pause();
    }
    
});


// update greeting message according to time

const greetingMessage = document.querySelector(".message");

const currentTime = new Date().getHours();

if(currentTime >= 5 && currentTime < 12){
    greetingMessage.innerText = "Good Morning👋";
}
else if(currentTime >= 12 && currentTime < 17){
    greetingMessage.innerText = "Good Afternoon👋";
}
else if(currentTime >= 17 && currentTime < 22){
    greetingMessage.innerText = "Good Evening👋";
}
else {
    greetingMessage.innerText = "Good Night👋";
}