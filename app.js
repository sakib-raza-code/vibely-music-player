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
    }
}

// DOM element selection
    const mobileTitle = document.querySelector(".m-title");
    const mobileArtist = document.querySelector(".m-artist");
    const laptopTitle = document.querySelector(".l-title");
    const laptopArtist = document.querySelector(".l-artist");
    const playBtn = document.querySelectorAll(".playbtn");
    // const pauseBtn = document.querySelector(".pausebtn");
    const progress = document.querySelector("#progress");
    const volume = document.querySelector("#volume");

// adding object of some songs
const song1 = new Song("Tajdar-e-Haram" , "Atif Aslam" , "assets/Tajdar-e-Haram.mp3" , "none");
const song2 = new Song("Taare" , "Farak" , "assets/Taare.mp3" , "none");
const song3 = new Song("Beqarar Yeh Dil" , "Shuja Haider" , "assets/Beqarar Yeh Dil.mp3" , "none");
const song4 = new Song("Idhar Zara Sa Dekh Lo" , "Shikhar" , "assets/Idhar Zara Sa Dekh Lo.mp3" , "none");

// MusicPlayer class
class MusicPlayer{
    constructor(){
        this.songs = [];
        this.currentSongIdx = 3;
        this.audio = new Audio();
        this.updateTime();
        this.handleSongEnd();
    }
    addSong(song) {
        this.songs.push(song);
    }
    loadSong(){
        let currentSong = this.songs[this.currentSongIdx];
        mobileTitle.innerText = currentSong.title;
        mobileArtist.innerText = currentSong.artist;

        laptopTitle.innerText = currentSong.title;
        laptopArtist.innerText = currentSong.artist;
        // add code to change cover page similerly

        this.audio.src = currentSong.path;
        this.audio.load();
    }
    play(){
        this.audio.play();
    }
    pause(){
        this.audio.pause();
    }
    togglePlay(){
        if(this.audio.paused){
            this.play();
            this.updatePlayIcon(true);
        }
        else{
            this.pause();
            this.updatePlayIcon(false);
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
    progresBar(){
        let currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        let percentage =(currentTime / duration) * 100;
        progress.value = percentage;
    }
    updateTime(){
        this.audio.addEventListener("timeupdate" , ()=>{
            this.progresBar();
        })
    }
    seek(percentage){
        const duration =  this.audio.duration;
        let newTime = (percentage * duration) / 100;
        this.audio.currentTime = newTime;
    }
    updateVolume(value){
        this.audio.volume = value;
    }
    handleSongEnd(){
        this.audio.addEventListener("ended" , ()=>{
            this.next();
        })
    }
}

// adding songs
const player = new MusicPlayer;

player.addSong(song1);
player.addSong(song2);
player.addSong(song3);
player.addSong(song4);

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