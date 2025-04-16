
const commandInput = document.getElementById('commandInput');
const commandList = document.getElementById('commandList');
const output = document.getElementById('mainOutput');
const unlockMessage = document.getElementById('unlockMessage');
const puzzleOverlay = document.getElementById('puzzleOverlay');
const puzzleInput = document.getElementById('puzzleInput');
const hackerNoise = document.getElementById('hackerNoise');

let voiceUnlocked = false;
let puzzlesSolved = 0;

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('voiceFeedback').innerText = "Speech recognition not supported.";
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log("🧠 VOICE RECOGNITION DEBUG:", transcript);
    if (transcript.includes("we listen to silence")) {
      document.getElementById('voiceFeedback').innerText = "Access granted.";
      voiceUnlocked = true;
      showHelp();
      document.getElementById('startBtn').remove();
      document.getElementById('clue').remove();
    } else {
      document.getElementById('voiceFeedback').innerText = "Access denied. Try again.";
    }
  };
  recognition.start();
}

function showHelp() {
  commandList.style.display = 'block';
}

commandInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const cmd = commandInput.value.trim().toLowerCase();
    commandInput.value = '';
    runCommand(cmd);
  } else if (e.key === 'Tab') {
    e.preventDefault();
    autoCompleteCommand();
  }
});

function autoCompleteCommand() {
  const val = commandInput.value.toLowerCase();
  const commands = ['trace', 'vox.status', 'decrypt node', 'access.redacted', 'vox.protocol.init'];
  const match = commands.find(c => c.startsWith(val));
  if (match) commandInput.value = match;
}

function runCommand(cmd) {
  if (!voiceUnlocked) {
    output.innerHTML += `> ${cmd}<br>ACCESS DENIED<br>`;
    return;
  }

  output.innerHTML += `> ${cmd}<br>`;
  switch(cmd) {
    case 'help':
      showHelp(); break;
    case 'trace':
      output.innerHTML += 'NODE TRACE: SIGIL-1134 ACTIVE<br>'; break;
    case 'vox.status':
      output.innerHTML += 'UPLINK: STABLE<br>GRID: INTERFERENCE DETECTED<br>'; break;
    case 'decrypt node':
    case 'access.redacted':
      openPuzzle(); break;
    case 'vox.protocol.init':
      if (puzzlesSolved >= 2) {
        runFinalSequence();
      } else {
        output.innerHTML += 'Command Locked. Solve required puzzles.<br>';
      }
      break;
    default:
      output.innerHTML += 'Unknown command. Type "help".<br>';
  }
}

function openPuzzle() {
  puzzleOverlay.style.display = 'block';
}

function closePuzzle() {
  puzzleOverlay.style.display = 'none';
}

function checkPuzzleSolution() {
  const answer = puzzleInput.value.trim().toLowerCase();
  if (answer === 'redact' || answer === 'silence') {
    output.innerHTML += `PUZZLE SOLVED: ${answer.toUpperCase()}<br>`;
    puzzlesSolved++;
    closePuzzle();
    if (puzzlesSolved >= 2) {
      unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
    }
  } else {
    puzzleOverlay.querySelector('#puzzleOutput').innerHTML += '<br>Incorrect. Try again.';
  }
}

function runFinalSequence() {
  output.innerHTML = '';
  let log = '';
  let count = 0;
  const lines = Array.from({ length: 30 }, (_, i) => `TRACE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  const interval = setInterval(() => {
    const code = lines[count];
    log += `> ${code} .......... LINK STABILIZED<br>`;
    output.innerHTML = log;
    count++;
    if (count >= lines.length) {
      clearInterval(interval);
      setTimeout(revealFinal, 1000);
    }
  }, 100);
}

function revealFinal() {
  const audio = document.getElementById('dropSFX');
  if (audio) audio.play();
  document.getElementById('mainTerminal').style.display = 'none';
  document.body.innerHTML += `
    <div class="vox-id-card">
      <div class="crt"></div>
      <div style="font-weight: bold; color: #0f0;">:: VOX IDENT CARD ::</div>
      <div style="margin-top: 8px;">
        <span style="color:#999;">Designation:</span> <span style="color:#0f0;">Cipher-9</span><br>
        <span style="color:#999;">Rank:</span> <span style="color:#0f0;">Initiate Node</span><br>
        <span style="color:#999;">Status:</span> <span style="color:#0f0;">Activated</span><br>
        <span style="color:#999;">ID Code:</span> <span style="color:#0f0;">VX-███-93X</span>
      </div>
      <div style="margin-top: 12px; font-size: 0.75rem; color:#999;">
        Transmission secured.<br>
        Echo node authentication confirmed.
      </div>
    </div>
  `;
}
