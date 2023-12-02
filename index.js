let currentIndex = 0; // 현재 재생 중인 곡의 인덱스
let isPlaying = false; // 현재 재생 상태
let audioPlayer = document.getElementById('audioPlayer');
let songList = document.getElementById('songList');
let songs = [];
let artists = []; // 추가: 아티스트 정보를 저장할 배열

// 노래 정보 엘리먼트
const songTitleElement = document.getElementById('songTitle');
const songImageElement = document.getElementById('songImage');

async function fetchSongs() {
  try {
    // 음악 목록 가져오기
    const responseSongs = await fetch('https://api.larang.dev/api/music-server/songs');
    const dataSongs = await responseSongs.json();
    songs = dataSongs.songs;

    // 아티스트 목록 가져오기
    const responseArtists = await fetch('https://api.larang.dev/api/music-server/artist');
    const dataArtists = await responseArtists.json();
    artists = dataArtists.artist;

    songs.forEach((song, index) => {
      const row = document.createElement('tr');
      const titleCell = document.createElement('td');
      const artistCell = document.createElement('td');

      // 곡 정보 설정
      titleCell.textContent = song.title;

      // 아티스트 정보 설정: artist 목록에서 가져옴
      const artistObjects = artists.filter(artist => song.artist.includes(artist.id));
      const artistNames = artistObjects.map(artist => Array.isArray(artist.name) ? artist.name.join(', ') : artist.name);
      artistCell.textContent = artistNames.join(' feat. ');

      row.appendChild(titleCell);
      row.appendChild(artistCell);

      // 클릭 이벤트 등록
      row.addEventListener('click', () => {
        playSong(index);
        updateSongInfo(song.title, song.img);
      });

      songList.appendChild(row);
    });

    // 초기 곡 재생
    playSong(currentIndex);
  } catch (error) {
    console.error('Error fetching songs:', error);
  }
}

function playSong(index) {
  currentIndex = index;
  const selectedSong = songs[index];

  // 노래가 이미 재생 중이라면 처음부터 다시 재생
  if (isPlaying) {
    audioPlayer.currentTime = 0;
  }

  audioPlayer.src = selectedSong.streamUrl;
  audioPlayer.play();
  isPlaying = true;

  // 노래가 끝날 때 다음 곡 재생
  audioPlayer.addEventListener('ended', () => {
    playNextSong();
  });

  // 현재 재생 중인 노래 정보 업데이트
  updateSongInfo(selectedSong.title, selectedSong.img);
}

function playNextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
}

function playPreviousSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
}

function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
  } else {
    audioPlayer.play();
  }
  isPlaying = !isPlaying;
}

function setVolume(volume) {
  audioPlayer.volume = volume / 100;
}

// 이벤트 리스너 추가
audioPlayer.addEventListener('play', () => {
  isPlaying = true;
});

audioPlayer.addEventListener('pause', () => {
  isPlaying = false;
});

// 초기화 및 곡 로딩
fetchSongs();

// 현재 재생 중인 노래 정보 업데이트
function updateSongInfo(title, imageUrl) {
  songTitleElement.textContent = title;
  songImageElement.src = imageUrl;
}
