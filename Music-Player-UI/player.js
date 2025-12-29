// Music Data
const songs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:45",
        plays: 2450,
        albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        album: "F*CK LOVE 3",
        duration: "2:23",
        plays: 1890,
        albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        duration: "2:58",
        plays: 2150,
        albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:24",
        plays: 1980,
        albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Save Your Tears",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:35",
        plays: 1760,
        albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Heat Waves",
        artist: "Glass Animals",
        album: "Dreamland",
        duration: "3:59",
        plays: 2210,
        albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        title: "Industry Baby",
        artist: "Lil Nas X",
        album: "MONTERO",
        duration: "3:32",
        plays: 1950,
        albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        title: "Easy On Me",
        artist: "Adele",
        album: "30",
        duration: "3:44",
        plays: 1870,
        albumArt: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// Player State
let currentSongIndex = 0;
let isPlaying = false;
let currentTime = 90; // 1:30 in seconds
let totalTime = 225; // 3:45 in seconds
let volume = 0.7;
let isShuffle = false;
let isRepeat = false;
let progressInterval;

// DOM Elements
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const volumeSlider = document.getElementById('volume-slider');
const miniSongTitle = document.getElementById('mini-song-title');
const miniSongArtist = document.getElementById('mini-song-artist');
const miniPlayBtn = document.getElementById('mini-play');
const miniPrevBtn = document.getElementById('mini-prev');
const miniNextBtn = document.getElementById('mini-next');

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update time display
function updateTimeDisplay() {
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
    if (totalTimeEl) totalTimeEl.textContent = formatTime(totalTime);
    
    // Update progress bar
    const progressPercent = (currentTime / totalTime) * 100;
    if (progress) progress.style.width = `${progressPercent}%`;
    
    // Update mini player progress
    const miniProgress = document.querySelector('.mini-progress-fill');
    if (miniProgress) miniProgress.style.width = `${progressPercent}%`;
}

// Load a song
function loadSong(index) {
    const song = songs[index];
    
    // Update main player
    if (currentSongTitle) currentSongTitle.textContent = song.title;
    if (currentSongArtist) currentSongArtist.textContent = song.artist;
    
    // Update mini player
    if (miniSongTitle) miniSongTitle.textContent = song.title;
    if (miniSongArtist) miniSongArtist.textContent = song.artist;
    
    // Update album art in main player
    const albumArtImg = document.querySelector('.album-art-large img');
    if (albumArtImg) albumArtImg.src = song.albumArt;
    
    // Update total time from song data
    const timeParts = song.duration.split(':');
    totalTime = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
    currentTime = 0;
    
    updateTimeDisplay();
    
    // Update active song in library if on that page
    updateActiveSongInLibrary(index);
}

// Update active song in library
function updateActiveSongInLibrary(index) {
    const songRows = document.querySelectorAll('.song-row');
    songRows.forEach(row => row.classList.remove('active'));
    
    if (songRows[index]) {
        songRows[index].classList.add('active');
    }
}

// Play/pause toggle
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        // Update main player
        if (playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }
        
        // Update mini player
        const miniPlayIcon = miniPlayBtn?.querySelector('i');
        if (miniPlayIcon) {
            miniPlayIcon.classList.remove('fa-play');
            miniPlayIcon.classList.add('fa-pause');
        }
        
        // Start progress simulation
        startProgressSimulation();
        
        // Add playing class to album art
        const albumArt = document.querySelector('.album-art-large');
        if (albumArt) albumArt.classList.add('playing');
    } else {
        // Update main player
        if (playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
        
        // Update mini player
        const miniPlayIcon = miniPlayBtn?.querySelector('i');
        if (miniPlayIcon) {
            miniPlayIcon.classList.remove('fa-pause');
            miniPlayIcon.classList.add('fa-play');
        }
        
        // Stop progress simulation
        stopProgressSimulation();
        
        // Remove playing class from album art
        const albumArt = document.querySelector('.album-art-large');
        if (albumArt) albumArt.classList.remove('playing');
    }
}

// Start progress simulation
function startProgressSimulation() {
    stopProgressSimulation();
    
    progressInterval = setInterval(() => {
        if (isPlaying && currentTime < totalTime) {
            currentTime += 1;
            updateTimeDisplay();
            
            // If song ended
            if (currentTime >= totalTime) {
                if (isRepeat) {
                    currentTime = 0;
                    updateTimeDisplay();
                } else {
                    nextSong();
                }
            }
        }
    }, 1000);
}

// Stop progress simulation
function stopProgressSimulation() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

// Next song
function nextSong() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex && songs.length > 1);
        
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    
    loadSong(currentSongIndex);
    
    // If player was playing, keep playing
    if (isPlaying) {
        startProgressSimulation();
    }
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    
    // If player was playing, keep playing
    if (isPlaying) {
        startProgressSimulation();
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    if (shuffleBtn) {
        shuffleBtn.style.color = isShuffle ? 'var(--primary-color)' : 'var(--text-primary)';
    }
}

// Toggle repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    if (repeatBtn) {
        repeatBtn.style.color = isRepeat ? 'var(--primary-color)' : 'var(--text-primary)';
    }
}

// Update volume
function updateVolume(value) {
    volume = value / 100;
    if (volumeSlider) {
        volumeSlider.value = value;
    }
}

// Populate recently played songs on home page
function populateRecentSongs() {
    const recentSongsContainer = document.getElementById('recent-songs');
    if (!recentSongsContainer) return;
    
    recentSongsContainer.innerHTML = '';
    
    // Get 4 random songs for recent
    const recentSongs = [...songs].sort(() => Math.random() - 0.5).slice(0, 4);
    
    recentSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.innerHTML = `
            <div class="song-card-img">
                <img src="${song.albumArt}" alt="${song.title}">
            </div>
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;
        
        songCard.addEventListener('click', () => {
            const index = songs.findIndex(s => s.id === song.id);
            if (index !== -1) {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                
                if (!isPlaying) {
                    togglePlayPause();
                }
            }
        });
        
        recentSongsContainer.appendChild(songCard);
    });
}

// Populate songs list in library
function populateSongsList() {
    const songsListContainer = document.getElementById('songs-list');
    if (!songsListContainer) return;
    
    songsListContainer.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songRow = document.createElement('div');
        songRow.className = `song-row ${index === currentSongIndex ? 'active' : ''}`;
        songRow.innerHTML = `
            <div class="song-row-index">${index + 1}</div>
            <div class="song-row-title">
                <div class="song-row-img">
                    <img src="${song.albumArt}" alt="${song.title}">
                </div>
                <div>
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-row-artist">${song.artist}</div>
            <div class="song-row-album">${song.album}</div>
            <div class="song-row-duration">${song.duration}</div>
            <div class="song-row-actions">
                <button class="song-row-btn like-btn" title="Like">
                    <i class="far fa-heart"></i>
                </button>
                <button class="song-row-btn menu-btn" title="More">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
        
        songRow.addEventListener('click', (e) => {
            if (!e.target.closest('.song-row-actions')) {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                
                if (!isPlaying) {
                    togglePlayPause();
                }
            }
        });
        
        // Like button
        const likeBtn = songRow.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const icon = likeBtn.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.style.color = icon.classList.contains('fas') ? 'var(--danger-color)' : '';
        });
        
        // Menu button
        const menuBtn = songRow.querySelector('.menu-btn');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert(`Options for "${song.title}"`);
        });
        
        songsListContainer.appendChild(songRow);
    });
}

// Initialize player
function initPlayer() {
    // Load first song
    loadSong(currentSongIndex);
    
    // Populate content based on page
    populateRecentSongs();
    populateSongsList();
    
    // Set initial volume
    if (volumeSlider) {
        volumeSlider.value = volume * 100;
    }
    
    // Event listeners for main player
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSong);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSong);
    }
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', toggleShuffle);
    }
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    // Progress bar click
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            
            let newTime = (clickX / width) * totalTime;
            newTime = Math.max(0, Math.min(totalTime, newTime));
            
            currentTime = newTime;
            updateTimeDisplay();
        });
    }
    
    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            updateVolume(e.target.value);
        });
    }
    
    // Mini player controls
    if (miniPlayBtn) {
        miniPlayBtn.addEventListener('click', togglePlayPause);
    }
    
    if (miniNextBtn) {
        miniNextBtn.addEventListener('click', nextSong);
    }
    
    if (miniPrevBtn) {
        miniPrevBtn.addEventListener('click', prevSong);
    }
    
    // Mini player progress bar
    const miniProgressBar = document.querySelector('.mini-progress-bar');
    if (miniProgressBar) {
        miniProgressBar.addEventListener('click', (e) => {
            const rect = miniProgressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            
            let newTime = (clickX / width) * totalTime;
            newTime = Math.max(0, Math.min(totalTime, newTime));
            
            currentTime = newTime;
            updateTimeDisplay();
        });
    }
    
    // Settings page toggles
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            console.log(`${this.id} is now ${this.checked ? 'on' : 'off'}`);
        });
    });
    
    // Settings page range sliders
    document.querySelectorAll('.range-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const valueDisplay = this.parentElement.querySelector('p');
            if (valueDisplay) {
                valueDisplay.textContent = `${this.value} seconds`;
            }
        });
    });
    
    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayer);