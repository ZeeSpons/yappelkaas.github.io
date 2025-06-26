// Kaasklikker met geluid en highscore
const cheese = document.getElementById('cheese');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');
const clickSound = document.getElementById('click-sound');

let score = 0;
let highscore = localStorage.getItem('kaasklikker-highscore') || 0;
highscoreDisplay.textContent = highscore;

if (cheese) {
  cheese.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;

    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    if (score > highscore) {
      highscore = score;
      highscoreDisplay.textContent = highscore;
      localStorage.setItem('kaasklikker-highscore', highscore);
    }
  });
}

