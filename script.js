// ------ CORE VARIABLES & FUNCTIONS ------
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
  // Add a button that says "Type password instead"
  const typeOption = document.createElement('button');
  typeOption.textContent = "Type password instead";
  typeOption.className = "button-terminal";
  typeOption.onclick = function() {
    const password = prompt("Enter the secret phrase:");
    if (password && password.toLowerCase().includes("we listen to silence")) {
      document.getElementById('voiceFeedback').innerText = "Access granted.";
      voiceUnlocked = true;
      showHelp();
      document.getElementById('startBtn').remove();
      document.getElementById('clue').remove();
      typeOption.remove();
    } else {
      document.getElementById('voiceFeedback').innerText = "Access denied. Try again.";
    }
  };
  document.getElementById('mainTerminal').appendChild(typeOption);
  
  // Original voice recognition code
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

function openPuzzle() {
  puzzleOverlay.style.display = 'block';
}

function closePuzzle() {
  puzzleOverlay.style.display = 'none';
}

// Original checkPuzzleSolution function (will be overridden by enhanced version)
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

// ------ ENHANCED TERMINAL FUNCTIONS ------

// 1. NEON GRID GLOW FLICKER
function addGridFlicker() {
  // Create and add the flicker element
  const flickerOverlay = document.createElement('div');
  flickerOverlay.className = 'grid-flicker';
  document.body.appendChild(flickerOverlay);
  
  // Start the random flickers
  setInterval(() => {
    if (Math.random() > 0.8) {
      flickerOverlay.style.opacity = (Math.random() * 0.5).toString();
      setTimeout(() => {
        flickerOverlay.style.opacity = '0';
      }, 100 + Math.random() * 200);
    }
  }, 2000);
}

// 2. TERMINAL BOOT SEQUENCE
function runBootSequence() {
  const terminal = document.getElementById('mainTerminal');
  terminal.classList.add('booting');
  
  // Add boot text to the output
  const bootMessages = [
    '> SYSTEM INITIALIZATION',
    '> LOADING VOX PROTOCOLS...',
    '> ESTABLISHING SECURE CONNECTION',
    '> SCANNING FOR ACTIVE NODES',
    '> ACTIVATING TERMINAL INTERFACE'
  ];
  
  let count = 0;
  const bootInterval = setInterval(() => {
    if (count < bootMessages.length) {
      output.innerHTML += bootMessages[count] + '<br>';
      playTypeSound();
      count++;
    } else {
      clearInterval(bootInterval);
      terminal.classList.remove('booting');
      terminal.classList.add('boot-complete');
      
      // Show the initial prompt after boot
      setTimeout(() => {
        document.querySelector('.clue-text').style.opacity = '1';
        document.getElementById('startBtn').style.opacity = '1';
      }, 500);
    }
  }, 700);
}

// 3. HACKING ANIMATION WITH GLYPHS
function simulateHacking(duration = 3000, callback = null) {
  hackerNoise.style.display = 'block';
  hackerNoise.innerHTML = '';
  
  const glyphs = "⌘⌥⎇⎋⌫⌦⌁⌄↵⏎⎮░▒▓█▓▒░◢◣◤◥■□●○◆◇▣▢▪▫●✱✲✳✴✵✶✷✸❖⨁⨂";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
  const all = glyphs + characters;
  let count = 0;
  
  const interval = setInterval(() => {
    let line = '';
    // Occasionally inject VOX related words
    if (Math.random() < 0.2) {
      const words = ["VOX", "SILENCE", "CIPHER", "NODE", "ECHO", "PROTOCOL", "SIGNAL", "TRACE", "REDACT"];
      const word = words[Math.floor(Math.random() * words.length)];
      const pos = Math.floor(Math.random() * 40);
      
      for (let i = 0; i < 60; i++) {
        if (i >= pos && i < pos + word.length) {
          line += word[i - pos];
        } else {
          line += all.charAt(Math.floor(Math.random() * all.length));
        }
      }
    } else {
      for (let i = 0; i < 60; i++) {
        line += all.charAt(Math.floor(Math.random() * all.length));
      }
    }
    
    hackerNoise.innerHTML += `${line}<br>`;
    hackerNoise.scrollTop = hackerNoise.scrollHeight;
    
    count++;
    if (count > 20 || (duration && count > duration / 100)) {
      clearInterval(interval);
      setTimeout(() => {
        hackerNoise.style.display = 'none';
        if (callback) callback();
      }, 500);
    }
  }, 100);
}

// 4. DATA PARTICLE CLOUD
function initializeParticles() {
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  document.body.appendChild(particleContainer);
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'data-particle';
    
    // Random initial position
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    
    // Random size
    const size = 2 + Math.random() * 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    const duration = 10 + Math.random() * 20;
    particle.style.animationDuration = duration + 's';
    
    // Random delay
    particle.style.animationDelay = Math.random() * 10 + 's';
    
    particleContainer.appendChild(particle);
  }
}

// 5. SCANNER LINE EFFECT
function activateScannerLine() {
  const scanner = document.querySelector('.scanner-line');
  scanner.style.display = 'block';
  
  setTimeout(() => {
    scanner.style.top = '100%';
    
    // Hide after scan completes
    setTimeout(() => {
      scanner.style.display = 'none';
      scanner.style.top = '0';
    }, 2000);
  }, 100);
}

// 6. PULSE EFFECT FOR SUCCESS
function createSuccessPulse(element) {
  const pulseElement = document.createElement('div');
  pulseElement.className = 'success-pulse';
  
  // Position relative to element
  const rect = element.getBoundingClientRect();
  pulseElement.style.left = (rect.left + rect.width / 2) + 'px';
  pulseElement.style.top = (rect.top + rect.height / 2) + 'px';
  
  document.body.appendChild(pulseElement);
  
  // Remove after animation
  setTimeout(() => {
    pulseElement.remove();
  }, 2000);
}

// 7. NETWORK NODE VISUALIZATION
function visualizeNetworkConnection(callback) {
  const canvas = document.createElement('canvas');
  canvas.className = 'network-canvas';
  canvas.width = 400;
  canvas.height = 200;
  
  output.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const nodes = [];
  
  // Create nodes
  for (let i = 0; i < 8; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 4 + Math.random() * 4,
      connected: false
    });
  }
  
  // Target node (VOX node)
  const targetNode = {
    x: canvas.width * 0.8,
    y: canvas.height * 0.5,
    size: 8,
    connected: false
  };
  nodes.push(targetNode);
  
  let frameCount = 0;
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Draw connections
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].connected) {
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
        ctx.stroke();
      }
    }
    
    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      ctx.fillStyle = i === nodes.length - 1 ? '#ff0' : '#0f0';
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, nodes[i].size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add pulse effect to target node
      if (i === nodes.length - 1) {
        ctx.strokeStyle = 'rgba(255, 255, 0, ' + (0.5 + Math.sin(frameCount * 0.1) * 0.5) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].size + 5 + Math.sin(frameCount * 0.1) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Connect nodes gradually
    if (frameCount % 15 === 0 && frameCount < nodes.length * 15) {
      const nodeIndex = Math.floor(frameCount / 15);
      if (nodeIndex < nodes.length) {
        nodes[nodeIndex].connected = true;
        playNodeConnectSound();
      }
    }
    
    frameCount++;
    
    // Check if completed
    if (frameCount < 200) {
      requestAnimationFrame(animate);
    } else {
      // Draw final "connected" state
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (callback) callback();
    }
  };
  
  animate();
}

// 8. SHOW HIDDEN MESSAGE (that requires highlighting)
function addHiddenMessage() {
  const hiddenDiv = document.createElement('div');
  hiddenDiv.textContent = "THE SILENT ONES ARE WATCHING";
  hiddenDiv.className = 'hidden-message';
  
  output.appendChild(hiddenDiv);
  output.innerHTML += '<br><small style="color: #555">[Select text above to reveal hidden message]</small><br>';
}

// 9. TYPE WRITER EFFECT FOR RESPONSES
function typeWriterEffect(element, text, speed = 30, callback = null) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback();
    }
  }
  
  type();
}

// 10. COUNTDOWN TIMER EFFECT
function addCountdownTimer(seconds, onComplete = null) {
  const timerElement = document.createElement('div');
  timerElement.className = 'countdown-timer';
  timerElement.textContent = `SECURITY LOCKDOWN IN: ${seconds} SECONDS`;
  
  document.getElementById('mainTerminal').appendChild(timerElement);
  
  let timeLeft = seconds;
  
  const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `SECURITY LOCKDOWN IN: ${timeLeft} SECONDS`;
    
    if (timeLeft <= 10) {
      timerElement.classList.add('critical');
    }
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerElement.textContent = 'LOCKDOWN INITIATED';
      
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000);
  
  // Return a function to cancel the timer
  return function cancelTimer() {
    clearInterval(timerInterval);
    timerElement.textContent = 'SECURITY OVERRIDE SUCCESSFUL';
    timerElement.className = 'countdown-timer success';
  };
}

// 11. SOUND EFFECTS
function playTypeSound() {
  // Simple keyboard click sound
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f8ad054.mp3?filename=keyboard-typing-102351.mp3');
  audio.volume = 0.2;
  audio.play();
}

function playErrorSound() {
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_749a8ec0fd.mp3?filename=incorrect-buzz-1-131657.mp3');
  audio.volume = 0.3;
  audio.play();
}

function playSuccessSound() {
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2021/08/09/audio_12b0c19614.mp3?filename=success-1-6297.mp3');
  audio.play();
}

function playNodeConnectSound() {
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_3324a21ffe.mp3?filename=ping-1-141270.mp3');
  audio.volume = 0.1;
  audio.play();
}

function playAlarmSound() {
  const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_add7c36093.mp3?filename=alarm-clock-short-6402.mp3');
  audio.loop = true;
  audio.play();
  
  return function stopAlarm() {
    audio.pause();
    audio.loop = false;
  };
}

// 12. DECRYPT TEXT ANIMATION
function decryptTextEffect(element, finalText, duration = 2000) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
  let iterations = 0;
  const maxIterations = 10;
  
  const interval = setInterval(() => {
    element.innerText = finalText
      .split("")
      .map((char, index) => {
        if (index < iterations / (maxIterations / finalText.length)) {
          return finalText[index];
        }
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("");
    
    iterations++;
    
    if (iterations >= maxIterations) {
      clearInterval(interval);
      element.innerText = finalText;
    }
  }, duration / maxIterations);
}

// 13. ENHANCED PUZZLE SYSTEM
const puzzles = [
  {
    id: 'cipher1',
    prompt: "Decrypt this: R1 E2 D3 A4 C5 T6<br>Rearrange to unlock.",
    answer: "redact",
    hint: "Look at the position numbers..."
  },
  {
    id: 'cipher2',
    prompt: "I am the guardian that cannot be seen.<br>I travel through wires but make no sound.<br>What am I?",
    answer: "firewall",
    hint: "I protect systems from intrusion."
  },
  {
    id: 'binary',
    prompt: "Convert binary to find the key:<br>01110011 01101000 01100001 01100100 01101111 01110111",
    answer: "shadow",
    hint: "Each group of 8 represents one ASCII letter."
  },
  {
    id: 'sequence',
    prompt: "Complete the sequence:<br>VOID, ECHO, GHOST, ____",
    answer: "silence",
    hint: "Things that are empty or lacking sound..."
  },
  {
    id: 'encryption',
    prompt: "ENCRYPTED DATA BLOCK:<br>MRIIOW -> HELLO<br>GSVOB -> THEM<br>XZMG -> CANT<br>SVZI -> ?<br><br>Decrypt the final message.",
    answer: "hear",
    hint: "Look at how each letter shifts in the alphabet."
  }
];

function startRandomPuzzle() {
  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  const puzzleOutput = document.getElementById('puzzleOutput');
  
  // Set the puzzle text
  puzzleOutput.innerHTML = randomPuzzle.prompt;
  
  // Add hint button
  const hintButton = document.createElement('button');
  hintButton.textContent = "Request Hint";
  hintButton.onclick = function() {
    puzzleOutput.innerHTML += `<br><span style="color: #ff0">[HINT]: ${randomPuzzle.hint}</span>`;
    hintButton.disabled = true;
  };
  
  puzzleOutput.appendChild(document.createElement('br'));
  puzzleOutput.appendChild(hintButton);
  
  // Override the check function for this puzzle
  window.currentPuzzleAnswer = randomPuzzle.answer;
}

// Modified checkPuzzleSolution
function checkPuzzleSolution() {
  const answer = puzzleInput.value.trim().toLowerCase();
  const currentAnswer = window.currentPuzzleAnswer || "redact"; // Fallback
  
  if (answer === currentAnswer) {
    playSuccessSound();
    output.innerHTML += `PUZZLE SOLVED: ${answer.toUpperCase()}<br>`;
    puzzlesSolved++;
    closePuzzle();
    
    if (puzzlesSolved >= 2) {
      unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
      createSuccessPulse(unlockMessage);
    }
  } else {
    playErrorSound();
    puzzleOverlay.querySelector('#puzzleOutput').innerHTML += '<br><span style="color: #f00">Incorrect. Try again.</span>';
  }
}

// 14. LOG FILES WITH STORY ELEMENTS
const voxLogs = [
  {
    id: "log142",
    content: `
    <div class="vox-log">
      <div class="log-header">LOG: ENTRY 142</div>
      <div class="log-content">
        The VOX collective grows stronger. We've placed nodes in all major cities now.
        The signal spreads like whispers between sleeping minds. Soon, we'll be ready 
        for phase two. Keep this channel secure.
      </div>
      <div class="log-signature">-- Commander Iris</div>
    </div>
    `
  },
  {
    id: "log157",
    content: `
    <div class="vox-log">
      <div class="log-header">LOG: ENTRY 157</div>
      <div class="log-content">
        Warning to all VOX agents: Cipher anomalies detected in sectors 3, 7, and 9.
        Something is trying to break through. Strengthen your mental barriers. Do not
        engage directly if encountered. Report all sightings to Nexus Control.
      </div>
      <div class="log-signature">-- Security Protocol Delta</div>
    </div>
    `
  },
  {
    id: "log183",
    content: `
    <div class="vox-log">
      <div class="log-header">LOG: ENTRY 183</div>
      <div class="log-content">
        The Silence Protocol has been initiated. All nodes must maintain radio discipline.
        We've detected unauthorized scans of our network. Someone knows we're here.
        Remember: we listen to silence, we speak through echoes, we move through shadows.
      </div>
      <div class="log-signature">-- Nexus Command</div>
    </div>
    `
  }
];

function displayRandomLog() {
  const randomLog = voxLogs[Math.floor(Math.random() * voxLogs.length)];
  output.innerHTML += randomLog.content;
}

// 15. MODIFIED CORE FUNCTIONS

// Enhanced runCommand with animations
function enhancedRunCommand(cmd) {
  if (!voiceUnlocked) {
    output.innerHTML += `> ${cmd}<br>ACCESS DENIED<br>`;
    playErrorSound();
    return;
  }

  output.innerHTML += `> ${cmd}<br>`;
  playTypeSound();

  switch(cmd) {
    case 'help':
      showHelp();
      break;
      
    case 'trace':
      simulateHacking(2000, () => {
        output.innerHTML += 'NODE TRACE: SIGIL-1134 ACTIVE<br>';
        visualizeNetworkConnection(() => {
          output.innerHTML += 'NODE CONNECTION ESTABLISHED<br>';
        });
      });
      break;
      
    case 'vox.status':
      const statusOutput = document.createElement('div');
      statusOutput.className = 'status-output';
      output.appendChild(statusOutput);
      
      typeWriterEffect(statusOutput, 'UPLINK: STABLE\nGRID: INTERFERENCE DETECTED\nNODES ACTIVE: 6/7\nSECURITY: NOMINAL', 30, () => {
        activateScannerLine();
      });
      break;
      
    case 'decrypt node':
      startRandomPuzzle();
      openPuzzle();
      break;
      
    case 'access.redacted':
      const stopAlarm = playAlarmSound();
      const cancelTimer = addCountdownTimer(60, () => {
        output.innerHTML += 'SECURITY LOCKDOWN INITIATED. TERMINAL ACCESS REVOKED.<br>';
        commandInput.disabled = true;
      });
      
      startRandomPuzzle();
      openPuzzle();
      
      // Modify close puzzle to stop alarm
      const originalClosePuzzle = closePuzzle;
      window.closePuzzle = function() {
        originalClosePuzzle();
        stopAlarm();
        cancelTimer();
      };
      break;
      
    case 'vox.logs':
      displayRandomLog();
      // Chance to show hidden message
      if (Math.random() > 0.7) {
        addHiddenMessage();
      }
      break;
      
    case 'vox.protocol.init':
      if (puzzlesSolved >= 2) {
        playSuccessSound();
        runFinalSequence();
      } else {
        playErrorSound();
        output.innerHTML += 'Command Locked. Solve required puzzles.<br>';
      }
      break;
      
    default:
      if (cmd.startsWith('echo ')) {
        // Easter egg - repeat what the user says with echo effect
        const message = cmd.substring(5);
        output.innerHTML += `<span class="echo-text">${message}</span><br>`;
      } else {
        output.innerHTML += 'Unknown command. Type "help".<br>';
      }
  }
}

// Initialize everything
function initializeTerminal() {
  // Add to the available commands list
  const commands = ['trace', 'vox.status', 'decrypt node', 'access.redacted', 'vox.protocol.init', 'vox.logs', 'echo [text]'];
  
  // Setup all animations
  addGridFlicker();
  initializeParticles();
  
  // Run boot sequence
  runBootSequence();
  
  // Override the original runCommand with our enhanced version
  window.runCommand = enhancedRunCommand;
  
  // Initialize puzzles
  window.currentPuzzleAnswer = "redact";
  window.checkPuzzleSolution = checkPuzzleSolution;
  window.startRandomPuzzle = startRandomPuzzle;
  
  // Keep original functions for compatibility
  window.closePuzzle = closePuzzle;
}

// ------ ADVANCED TERMINAL FEATURES ------

// 1. PASSWORD CRACKER MINIGAME
function startPasswordCracker() {
  const passwords = [
    "nexus", "cipher", "shadow", "voxnet", "silence", "echo"
  ];
  const password = passwords[Math.floor(Math.random() * passwords.length)];
  let discovered = Array(password.length).fill('_').join(' ');
  let attempts = 0;
  let guessedLetters = [];
  
  puzzleOverlay.style.display = 'block';
  const puzzleOutput = document.getElementById('puzzleOutput');
  
  puzzleOutput.innerHTML = `
    <div class="password-cracker">
      <div class="cracker-header">PASSWORD CRACKER INITIATED</div>
      <div>Target: VOX Main System</div>
      <div class="password-display">Current Progress: <span id="discoveredPw">${discovered}</span></div>
      <div>Attempts: <span id="attemptCount">0</span></div>
      <div>Guessed: <span id="guessedLetters"></span></div>
    </div>
  `;
  
  puzzleInput.placeholder = "Enter a single letter...";
  
  // Override the check function
  window.checkPuzzleSolution = function() {
    const guess = puzzleInput.value.trim().toLowerCase();
    puzzleInput.value = '';
    
    if (guess.length !== 1 || !guess.match(/[a-z]/)) {
      puzzleOutput.innerHTML += '<div class="error-message">Invalid input. Enter a single letter.</div>';
      return;
    }
    
    if (guessedLetters.includes(guess)) {
      puzzleOutput.innerHTML += '<div class="error-message">Letter already guessed. Try another.</div>';
      return;
    }
    
    guessedLetters.push(guess);
    document.getElementById('guessedLetters').textContent = guessedLetters.join(', ');
    
    attempts++;
    document.getElementById('attemptCount').textContent = attempts;
    
    let newDiscovered = '';
    let found = false;
    
    for (let i = 0; i < password.length; i++) {
      if (password[i] === guess) {
        newDiscovered += guess + ' ';
        found = true;
      } else if (discovered.split(' ')[i] !== '_') {
        newDiscovered += discovered.split(' ')[i] + ' ';
      } else {
        newDiscovered += '_ ';
      }
    }
    
    discovered = newDiscovered.trim();
    document.getElementById('discoveredPw').textContent = discovered;
    
    if (!discovered.includes('_')) {
      playSuccessSound();
      puzzleOutput.innerHTML += '<div class="success-message">PASSWORD CRACKED!</div>';
      
      setTimeout(() => {
        puzzlesSolved++;
        closePuzzle();
        output.innerHTML += '<div class="holo-response">SECURITY SYSTEM BYPASSED. INNER ARCHIVES ACCESSIBLE.</div>';
        
        if (puzzlesSolved >= 2) {
          unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
          createSuccessPulse(unlockMessage);
        }
      }, 1500);
    } else if (found) {
      playTypeSound();
      puzzleOutput.innerHTML += '<div class="success-message">CHARACTER FOUND!</div>';
    } else {
      playErrorSound();
      puzzleOutput.innerHTML += '<div class="error-message">Character not in password.</div>';
      
      // Add visual glitch effect for wrong guess
      const terminalElement = document.querySelector('.terminal-overlay');
      terminalElement.classList.add('glitch-effect');
      setTimeout(() => {
        terminalElement.classList.remove('glitch-effect');
      }, 500);
    }
    
    // Check if too many wrong guesses
    if (attempts >= 10 && discovered.includes('_')) {
      puzzleOutput.innerHTML += '<div class="warning-message">WARNING: Security protocols detecting intrusion attempt.</div>';
    }
  };
}

// 2. SEQUENCE PUZZLE - Find the pattern
function startSequencePuzzle() {
  const sequences = [
    {
      pattern: [3, 6, 9, 12, 15, 18],
      rule: "Add 3",
      answer: "21"
    },
    {
      pattern: [2, 4, 8, 16, 32, 64],
      rule: "Multiply by 2",
      answer: "128"
    },
    {
      pattern: [1, 4, 9, 16, 25, 36],
      rule: "Square numbers",
      answer: "49"
    },
    {
      pattern: [1, 1, 2, 3, 5, 8],
      rule: "Fibonacci sequence",
      answer: "13"
    }
  ];
  
  const sequence = sequences[Math.floor(Math.random() * sequences.length)];
  
  puzzleOverlay.style.display = 'block';
  const puzzleOutput = document.getElementById('puzzleOutput');
  
  puzzleOutput.innerHTML = `
    <div class="sequence-puzzle">
      <div>SEQUENCE ANALYSIS REQUIRED</div>
      <div class="sequence-display">${sequence.pattern.join(', ')}, ?</div>
      <div>Find the next number in the sequence.</div>
      <div class="hint-text" style="display: none;">Hint: ${sequence.rule}</div>
    </div>
    <button id="hintButton" class="button-terminal">Request Hint</button>
  `;
  
  document.getElementById('hintButton').addEventListener('click', function() {
    document.querySelector('.hint-text').style.display = 'block';
    this.disabled = true;
  });
  
  puzzleInput.placeholder = "Enter the next number...";
  
  // Override the check function
  window.checkPuzzleSolution = function() {
    const answer = puzzleInput.value.trim();
    
    if (answer === sequence.answer) {
      playSuccessSound();
      puzzleOutput.innerHTML += '<div class="success-message">SEQUENCE ANALYZED SUCCESSFULLY!</div>';
      
      setTimeout(() => {
        puzzlesSolved++;
        closePuzzle();
        output.innerHTML += '<div class="holo-response">PATTERN RECOGNITION COMPLETE. ACCESS GRANTED.</div>';
        
        if (puzzlesSolved >= 2) {
          unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
          createSuccessPulse(unlockMessage);
        }
      }, 1500);
    } else {
      playErrorSound();
      puzzleOutput.innerHTML += '<div class="error-message">Incorrect pattern analysis. Try again.</div>';
    }
  };
}

// 3. CIPHER WHEEL PUZZLE
function startCipherWheelPuzzle() {
  const cipherMessages = [
    {
      encrypted: "IBWF ZPV FWFS IFBSE UIF WPJDFT",
      shift: 1,
      decrypted: "HAVE YOU EVER HEARD THE VOICES"
    },
    {
      encrypted: "YM TQABMV QA BW ZMUIQV CVPMIZL",
      shift: 8,
      decrypted: "WE LISTEN IN TOTAL SILENCE"
    },
    {
      encrypted: "HZFYO TGZKM GSJ NGFQ KOIGCTY",
      shift: 19,
      decrypted: "EVERY SPACE HAS MANY ECHOES"
    }
  ];
  
  const puzzle = cipherMessages[Math.floor(Math.random() * cipherMessages.length)];
  
  puzzleOverlay.style.display = 'block';
  puzzleOverlay.classList.add('cipher-overlay');
  
  const puzzleOutput = document.getElementById('puzzleOutput');
  puzzleOutput.innerHTML = `
    <div class="cipher-puzzle">
      <div class="cipher-header">ENCRYPTED VOX TRANSMISSION</div>
      <div class="cipher-message">${puzzle.encrypted}</div>
      <div>Decrypt this message.</div>
      <div class="hint-container">
        <button id="hintButton" class="button-terminal">Request Cipher Hint</button>
        <div class="hint-text" style="display: none;">
          Hint: This is a Caesar cipher with shift value ${puzzle.shift}.
          <div class="cipher-wheel">
            <div class="wheel-outer">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
            <div class="wheel-inner">${generateShiftedAlphabet(puzzle.shift)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('hintButton').addEventListener('click', function() {
    document.querySelector('.hint-text').style.display = 'block';
    this.disabled = true;
    
    // Animate the cipher wheel
    const wheelInner = document.querySelector('.wheel-inner');
    wheelInner.style.animation = 'rotate-wheel 3s ease-out forwards';
  });
  
  puzzleInput.placeholder = "Enter decrypted message...";
  
  // Override the check function
  window.checkPuzzleSolution = function() {
    const answer = puzzleInput.value.trim().toUpperCase();
    
    // Check if the answer is sufficiently close
    if (answer === puzzle.decrypted || levenshteinDistance(answer, puzzle.decrypted) <= 3) {
      playSuccessSound();
      puzzleOutput.innerHTML += '<div class="success-message">TRANSMISSION DECRYPTED!</div>';
      
      setTimeout(() => {
        puzzlesSolved++;
        closePuzzle();
        puzzleOverlay.classList.remove('cipher-overlay');
        
        // Display the decrypted message
        output.innerHTML += `<div class="holo-response">DECRYPTED MESSAGE: "${puzzle.decrypted}"</div>`;
        
        if (puzzlesSolved >= 2) {
          unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
          createSuccessPulse(unlockMessage);
        }
      }, 1500);
    } else {
      playErrorSound();
      puzzleOutput.innerHTML += '<div class="error-message">Decryption failed. Try again.</div>';
    }
  };
}

// Helper function for cipher wheel
function generateShiftedAlphabet(shift) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const shiftedPart = alphabet.slice(shift) + alphabet.slice(0, shift);
  return shiftedPart;
}

// Helper function to compare text similarity
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// 4. MEMORY PATTERN GAME
function startMemoryPatternGame() {
  puzzleOverlay.style.display = 'block';
  
  const patternLength = 5;
  const colors = ['red', 'green', 'blue', 'yellow'];
  const pattern = [];
  
  // Generate random pattern
  for (let i = 0; i < patternLength; i++) {
    pattern.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  const puzzleOutput = document.getElementById('puzzleOutput');
  puzzleOutput.innerHTML = `
    <div class="memory-game">
      <div class="memory-header">MEMORY NODE ACCESS PROTOCOL</div>
      <div>Observe and repeat the pattern sequence.</div>
      <div class="pattern-container">
        <div class="pattern-square" data-color="red"></div>
        <div class="pattern-square" data-color="green"></div>
        <div class="pattern-square" data-color="blue"></div>
        <div class="pattern-square" data-color="yellow"></div>
      </div>
      <div class="status-message">Watch carefully...</div>
      <div class="player-sequence"></div>
    </div>
  `;
  
  // Hide the regular input and submit
  puzzleInput.style.display = 'none';
  document.querySelector('#puzzleOverlay button').style.display = 'none';
  
  const squares = document.querySelectorAll('.pattern-square');
  const statusMessage = document.querySelector('.status-message');
  const playerSequence = document.querySelector('.player-sequence');
  
  // Start displaying pattern after a delay
  setTimeout(() => {
    showPattern(0);
  }, 1500);
  
  let playerPattern = [];
  let canClick = false;
  
  // Show the pattern sequence
  function showPattern(index) {
    if (index >= pattern.length) {
      statusMessage.textContent = "Now repeat the sequence...";
      canClick = true;
      return;
    }
    
    const color = pattern[index];
    const square = document.querySelector(`.pattern-square[data-color="${color}"]`);
    
    // Highlight the square
    square.classList.add('active');
    playNoteForColor(color);
    
    setTimeout(() => {
      square.classList.remove('active');
      setTimeout(() => {
        showPattern(index + 1);
      }, 300);
    }, 600);
  }
  
  // Play sound for each color
  function playNoteForColor(color) {
    const notes = {
      red: 261.63,    // C4
      green: 329.63,  // E4
      blue: 392.00,   // G4
      yellow: 523.25  // C5
    };
    
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.frequency.value = notes[color];
    oscillator.type = 'sine';
    
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
    }, 300);
  }
  
  // Set up click handlers for squares
  squares.forEach(square => {
    square.addEventListener('click', () => {
      if (!canClick) return;
      
      const color = square.dataset.color;
      playerPattern.push(color);
      
      // Visual feedback
      square.classList.add('active');
      playNoteForColor(color);
      
      // Add to player sequence display
      const dot = document.createElement('div');
      dot.className = 'sequence-dot';
      dot.style.backgroundColor = color;
      playerSequence.appendChild(dot);
      
      setTimeout(() => {
        square.classList.remove('active');
      }, 300);
      
      // Check if pattern is complete
      if (playerPattern.length === pattern.length) {
        canClick = false;
        
        // Check if correct
        let correct = true;
        for (let i = 0; i < pattern.length; i++) {
          if (pattern[i] !== playerPattern[i]) {
            correct = false;
            break;
          }
        }
        
        if (correct) {
          statusMessage.textContent = "Pattern match successful!";
          playSuccessSound();
          
          setTimeout(() => {
            puzzlesSolved++;
            closePuzzle();
            
            // Show the input again for other puzzles
            puzzleInput.style.display = '';
            document.querySelector('#puzzleOverlay button').style.display = '';
            
            output.innerHTML += '<div class="holo-response">MEMORY NODE ACCESSED. SECURITY PROTOCOL BYPASSED.</div>';
            
            if (puzzlesSolved >= 2) {
              unlockMessage.innerHTML = '> vox.protocol.init is now unlocked';
              createSuccessPulse(unlockMessage);
            }
          }, 1500);
        } else {
          statusMessage.textContent = "Pattern mismatch. Security lockdown initiated.";
          playerSequence.style.borderColor = 'red';
          playErrorSound();
          
          setTimeout(() => {
            closePuzzle();
            
            // Show the input again for other puzzles
            puzzleInput.style.display = '';
            document.querySelector('#puzzleOverlay button').style.display = '';
          }, 2000);
        }
      }
    });
  });
}

// 5. FULL TERMINAL INTRO SEQUENCE
function runImmersiveIntro() {
  // Create overlay for intro
  const introOverlay = document.createElement('div');
  introOverlay.className = 'intro-overlay';
  document.body.appendChild(introOverlay);
  
  // Create terminal elements
  const introTerminal = document.createElement('div');
  introTerminal.className = 'intro-terminal';
  introOverlay.appendChild(introTerminal);
  
  // Hide main content
  document.getElementById('mainTerminal').style.opacity = '0';
  
  // Boot sequence text
  const bootText = [
    "> INITIALIZING VOX NETWORK",
    "> ESTABLISHING SECURE CONNECTION",
    "> PROTOCOL SIGMA-9 ACTIVE",
    "> SCANNING LOCAL NODES",
    "> ACTIVATING RECRUITMENT SUBROUTINE",
    "> WARNING: UNAUTHORIZED ACCESS ATTEMPT DETECTED",
    "> DEPLOYING COUNTERMEASURES",
    "> ...OVERRIDE ACCEPTED",
    "> WELCOME TO VOX RECRUITMENT TERMINAL"
  ];
  
  let lineIndex = 0;
  
  function typeNextLine() {
    if (lineIndex >= bootText.length) {
      completeIntro();
      return;
    }
    
    const line = document.createElement('div');
    line.className = 'intro-line';
    introTerminal.appendChild(line);
    
    let charIndex = 0;
    const text = bootText[lineIndex];
    
    function typeChar() {
      if (charIndex < text.length) {
        line.textContent += text.charAt(charIndex);
        charIndex++;
        
        // Random typing sound
        if (Math.random() > 0.7) {
          playTypeSound();
        }
        
        setTimeout(typeChar, 30 + Math.random() * 30);
      } else {
        lineIndex++;
        setTimeout(typeNextLine, 300);
      }
    }
    
    typeChar();
  }
  
  function completeIntro() {
  // Add logo animation with VOX instead of just X
  const logo = document.createElement('pre');
  logo.className = 'intro-logo';
  logo.innerHTML = `
    <span class="logo-v">__     ___    __      __</span>
    <span class="logo-o">\\ \\   / / |   \\ \\    / /</span>
    <span class="logo-x"> \\ \\ / /| |    \\ \\  / / </span>
    <span class="logo-line">  \\ V / | |     \\ \\/ /  </span>
    <span class="logo-line">   \\ /  | |___   \\  /   </span>
    <span class="logo-line">   | |  |_____|  / /\\   </span>
    <span class="logo-line">   | |          / /\\ \\  </span>
    <span class="logo-x">   | |         / /  \\ \\ </span>
    <span class="logo-o">   |_|        /_/    \\_\\</span>
  `;
  
  introTerminal.appendChild(logo);
  
  // Fade out intro and reveal main terminal
  setTimeout(() => {
    introOverlay.style.animation = 'fade-out 1.5s forwards';
    document.getElementById('mainTerminal').style.opacity = '1';
    document.getElementById('mainTerminal').classList.add('terminal-reveal');
    
    // Remove intro elements after animation
    setTimeout(() => {
      introOverlay.remove();
    }, 1500);
  }, 2000);
}
  
  // Start the intro sequence
  setTimeout(typeNextLine, 1000);
}

// 6. INTERACTIVE STORY/MISSION ELEMENTS
const voxMissions = [
  {
    id: "recon",
    title: "RECONNAISSANCE",
    briefing: `The VOX collective requires intel on a suspicious energy signature in sector 7. 
    Your mission is to establish connection with our scout node and retrieve the data.
    Be careful - there may be counter-intelligence measures in place.`,
    success: "Scout node contacted. Energy signature data suggests non-human origin. Data packet received."
  },
  {
    id: "infiltrate",
    title: "INFILTRATION",
    briefing: `A rival organization has established a firewall around one of our dormant nodes.
    Your task is to bypass their security and reactivate our sleeper agent.
    Stealth is essential - do not trigger their alarm systems.`,
    success: "Firewall bypassed. Sleeper node reactivated. New communication channels established."
  },
  {
    id: "decode",
    title: "SIGNAL INTERCEPT",
    briefing: `We've detected an encrypted transmission on frequency 121.3.
    This transmission may contain details about who has been hunting our agents.
    Decrypt the signal and analyze its contents.`,
    success: "Signal decrypted. Entity identified as 'The Watchmen'. Countermeasures now available."
  }
];

function startMission() {
  // Choose random mission
  const mission = voxMissions[Math.floor(Math.random() * voxMissions.length)];
  
  // Create mission overlay
  const missionOverlay = document.createElement('div');
  missionOverlay.className = 'mission-overlay';
  missionOverlay.innerHTML = `
    <div class="mission-container">
      <div class="mission-header">> VOX DIRECTIVE: ${mission.title}</div>
      <div class="mission-briefing">${mission.briefing}</div>
      <div class="mission-controls">
        <button class="button-terminal accept-mission">ACCEPT MISSION</button>
        <button class="button-terminal decline-mission">DECLINE</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(missionOverlay);
  
  // Add event listeners to buttons
  missionOverlay.querySelector('.accept-mission').addEventListener('click', () => {
    missionOverlay.remove();
    
    // Start the appropriate puzzle based on mission
    if (mission.id === "recon") {
      startRandomPuzzle();
      openPuzzle();
    } else if (mission.id === "infiltrate") {
      startPasswordCracker();
    } else if (mission.id === "decode") {
      startCipherWheelPuzzle();
    }
    
    // Store current mission for later reference
    window.currentMission = mission;
  });
  
  missionOverlay.querySelector('.decline-mission').addEventListener('click', () => {
    missionOverlay.remove();
    output.innerHTML += '<div class="holo-response">Mission declined. Standing by for further instructions.</div>';
  });
}
// 7. LIVE NODE MAP
function showNodeMap() {
  // Create map container
  const mapContainer = document.createElement('div');
  mapContainer.className = 'node-map-container';
  mapContainer.innerHTML = `
    <div class="map-header">
      <span>> VOX NETWORK NODE MAP</span>
      <button class="close-map">×</button>
    </div>
    <canvas id="nodeMapCanvas" width="600" height="400"></canvas>
    <div class="map-status">Status: <span class="status-text">Scanning...</span></div>
  `;
  
  document.body.appendChild(mapContainer);
  
  // Add close button handler
  mapContainer.querySelector('.close-map').addEventListener('click', () => {
    mapContainer.classList.add('map-closing');
    setTimeout(() => {
      mapContainer.remove();
    }, 500);
  });
  
  // Initialize the map
  initializeNodeMap();
}

function initializeNodeMap() {
  const canvas = document.getElementById('nodeMapCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // City coordinates (relative to canvas)
  const cities = [
    { name: "NEXUS PRIME", x: width/2, y: height/2, status: "active", size: 8 },
    { name: "NODE 7", x: width * 0.2, y: height * 0.3, status: "active", size: 5 },
    { name: "NODE 15", x: width * 0.8, y: height * 0.2, status: "active", size: 6 },
    { name: "NODE 23", x: width * 0.7, y: height * 0.7, status: "dormant", size: 4 },
    { name: "NODE 9", x: width * 0.3, y: height * 0.6, status: "active", size: 5 },
    { name: "NODE 31", x: width * 0.1, y: height * 0.8, status: "interference", size: 4 },
    { name: "NODE 42", x: width * 0.9, y: height * 0.9, status: "dormant", size: 3 }
  ];
  
  // Connection lines between nodes
  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 0, to: 4 },
    { from: 1, to: 4 },
    { from: 2, to: 3 },
    { from: 4, to: 5 },
    { from: 2, to: 6 }
  ];
  
  // Animation state
  let frame = 0;
  
  function drawMap() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid background
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    for (let i = 0; i < height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Draw connections
    connections.forEach(conn => {
      const fromCity = cities[conn.from];
      const toCity = cities[conn.to];
      
      // Skip inactive connections
      if (fromCity.status === 'dormant' || toCity.status === 'dormant') {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
      } else if (fromCity.status === 'interference' || toCity.status === 'interference') {
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.3)';
      } else {
        // Animated data flow effect
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
        
        // Draw data packets moving along the lines
        const dx = toCity.x - fromCity.x;
        const dy = toCity.y - fromCity.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        const packetSpeed = 2;
        const packetCount = Math.floor(distance / 60);
        
        for (let i = 0; i < packetCount; i++) {
          const position = (frame * packetSpeed / distance + i / packetCount) % 1;
          const x = fromCity.x + dx * position;
          const y = fromCity.y + dy * position;
          
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Draw the connection line
      ctx.beginPath();
      ctx.moveTo(fromCity.x, fromCity.y);
      ctx.lineTo(toCity.x, toCity.y);
      ctx.stroke();
    });
    
    // Draw cities
    cities.forEach(city => {
      // City status color
      if (city.status === 'active') {
        ctx.fillStyle = '#0f0';
      } else if (city.status === 'dormant') {
        ctx.fillStyle = '#555';
      } else if (city.status === 'interference') {
        ctx.fillStyle = '#f00';
      }
      
      // Draw node point
      ctx.beginPath();
      ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Pulse effect for active nodes
      if (city.status === 'active') {
        ctx.strokeStyle = 'rgba(0, 255, 0, ' + (0.2 + 0.2 * Math.sin(frame * 0.1)) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(city.x, city.y, city.size + 5 + 3 * Math.sin(frame * 0.1), 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw city name
      ctx.font = '10px "Share Tech Mono"';
      ctx.fillStyle = '#0f0';
      ctx.textAlign = 'center';
      ctx.fillText(city.name, city.x, city.y - city.size - 5);
      
      // Randomly change status for interference nodes
      if (city.status === 'interference' && Math.random() < 0.02) {
        city.status = Math.random() < 0.5 ? 'active' : 'interference';
      }
    });
    
    // Update frame and continue animation
    frame++;
    requestAnimationFrame(drawMap);
  }
  
  // Start animation
  drawMap();
  
  // Update status text after "scanning"
  setTimeout(() => {
    document.querySelector('.status-text').textContent = 'Online - 6/7 Nodes Active';
  }, 2000);
}

// 8. ENHANCED COMMAND LIST
function enhanceCommandList() {
  // Enhanced command list with descriptions
  const enhancedCommands = [
    { cmd: 'help', desc: 'Display available commands' },
    { cmd: 'trace', desc: 'Locate and connect to active VOX nodes' },
    { cmd: 'vox.status', desc: 'Check system diagnostics and node status' },
    { cmd: 'decrypt node', desc: 'Solve cipher puzzles to access encrypted data' },
    { cmd: 'access.redacted', desc: 'Attempt to bypass security on classified data' },
    { cmd: 'vox.logs', desc: 'Access archived VOX operative communications' },
    { cmd: 'node.map', desc: 'Display visual map of known VOX network nodes' },
    { cmd: 'mission.request', desc: 'Request new mission assignment from VOX command' },
    { cmd: 'vox.protocol.init', desc: '[LOCKED] Requires puzzle solutions to unlock' }
  ];
  
  // Replace the original command list with enhanced version
  const commandListHTML = `> help
> Available Commands:
${enhancedCommands.map(cmd => `  - ${cmd.cmd.padEnd(20, '.')} ${cmd.desc}`).join('\n')}
  `;
  
  commandList.innerHTML = commandListHTML;
  
  // Extend the runCommand function to handle new commands
  const originalRunCommand = window.runCommand || enhancedRunCommand;
  
  window.runCommand = function(cmd) {
    if (!voiceUnlocked) {
      output.innerHTML += `> ${cmd}<br>ACCESS DENIED<br>`;
      playErrorSound();
      return;
    }

    output.innerHTML += `> ${cmd}<br>`;
    playTypeSound();

    switch(cmd) {
      case 'help':
        showHelp();
        break;
      case 'node.map':
        showNodeMap();
        break;
      case 'mission.request':
        startMission();
        break;
      default:
        originalRunCommand(cmd);
    }
  };
}

// 9. TERMINAL GLITCH EFFECTS
function addGlitchEffects() {
  // Occasional random glitches in the terminal
  setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every interval
      const terminal = document.querySelector('.terminal');
      terminal.classList.add('glitch');
      
      setTimeout(() => {
        terminal.classList.remove('glitch');
      }, 200);
    }
  }, 8000);
  
  // Add a special easter egg message that randomly appears
  setInterval(() => {
    if (Math.random() < 0.03) { // 3% chance every interval
      const hiddenText = document.createElement('div');
      hiddenText.className = 'subliminal-message';
      hiddenText.textContent = "WE ARE WATCHING";
      
      document.body.appendChild(hiddenText);
      
      setTimeout(() => {
        hiddenText.remove();
      }, 200);
    }
  }, 15000);
}

// 10. ENHANCED FINAL SEQUENCE
function enhancedFinalSequence() {
  output.innerHTML = '';
  
  // Create a full-screen overlay effect
  const finalOverlay = document.createElement('div');
  finalOverlay.className = 'final-sequence-overlay';
  document.body.appendChild(finalOverlay);
  
  // Create the terminal for final sequence
  const finalTerminal = document.createElement('div');
  finalTerminal.className = 'final-sequence-terminal';
  finalOverlay.appendChild(finalTerminal);
  
  // Lines to display during sequence
  let count = 0;
  const lines = Array.from({ length: 30 }, (_, i) => `TRACE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
  
  // Special lines that appear with higher probability towards the end
  const specialLines = [
    "TRACE-MARROW", 
    "TRACE-ULTRAVOX", 
    "TRACE-GR1DP0RT", 
    "TRACE-221NEON",
    "TRACE-F1NDSIGNAL", 
    "TRACE-SYNTHEX", 
    "TRACE-NULLOVER", 
    "TRACE-ZEROCORE", 
    "TRACE-LOCKBRIDGE",
    "TRACE-CIPHERNODE", 
    "TRACE-RUNPROTOCOL", 
    "TRACE-NETDRIFT"
  ];
  
  // Replace some random lines with special lines
  for (let i = 15; i < lines.length; i++) {
    if (Math.random() < 0.3 * (i / lines.length)) {
      lines[i] = specialLines[Math.floor(Math.random() * specialLines.length)];
    }
  }
  
  const interval = setInterval(() => {
    const code = lines[count];
    
    // Create line with typing effect
    const line = document.createElement('div');
    line.className = 'trace-line';
    finalTerminal.appendChild(line);
    
    let charIndex = 0;
    const lineText = `> ${code} .......... LINK STABILIZED`;
    
    function typeLine() {
      if (charIndex < lineText.length) {
        line.textContent += lineText.charAt(charIndex);
        charIndex++;
        
        // Random typing sound
        if (charIndex % 3 === 0) {
          playTypeSound();
        }
        
        setTimeout(typeLine, 10);
      }
    }
    
    typeLine();
    
    count++;
    finalTerminal.scrollTop = finalTerminal.scrollHeight;
    
    if (count >= lines.length) {
      clearInterval(interval);
      setTimeout(showFinalVoxCard, 1000);
    }
  }, 300);
}

function showFinalVoxCard() {
  const audio = document.getElementById('dropSFX');
  if (audio) audio.play();
  
  // Create glitch transition
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch-overlay';
  document.body.appendChild(glitchOverlay);
  
  setTimeout(() => {
    // Clear previous content
    const overlay = document.querySelector('.final-sequence-overlay');
    if (overlay) overlay.remove();
    
    document.getElementById('mainTerminal').style.display = 'none';
    
    // Create enhanced ID card
    const idCard = document.createElement('div');
    idCard.className = 'vox-id-card enhanced';
    idCard.innerHTML = `
      <div class="crt"></div>
      <div class="card-header">::: VOX IDENT CARD :::</div>
      <div class="card-content">
        <div class="card-row">
          <span class="card-label">Designation:</span>
          <span class="card-value">Cipher-9</span>
        </div>
        <div class="card-row">
          <span class="card-label">Rank:</span>
          <span class="card-value">Initiate Node</span>
        </div>
        <div class="card-row">
          <span class="card-label">Status:</span>
          <span class="card-value">Activated</span>
        </div>
        <div class="card-row">
          <span class="card-label">ID Code:</span>
          <span class="card-value">VX-███-93X</span>
        </div>
        <div class="card-row">
          <span class="card-label">Clearance:</span>
          <span class="card-value">ECHO-7</span>
        </div>
      </div>
      <div class="card-footer">
        <div>Transmission secured.</div>
        <div>Echo node authentication confirmed.</div>
        <div class="timestamp">DATE: [REDACTED] / TIME: [REDACTED]</div>
      </div>
      <div class="card-chip"></div>
      <div class="card-watermark">VOX</div>
    `;
    
    document.body.appendChild(idCard);
    
    // Remove glitch overlay after animation
    setTimeout(() => {
      glitchOverlay.remove();
      
      // Add interactive easter egg - clicking the card reveals a hidden message
      idCard.addEventListener('click', () => {
        idCard.classList.add('reveal-secret');
        
        setTimeout(() => {
          const secretMsg = document.createElement('div');
          secretMsg.className = 'secret-message';
          secretMsg.textContent = "THE SILENT ONES ARE EVERYWHERE. LISTEN CAREFULLY.";
          document.body.appendChild(secretMsg);
        }, 1000);
      });
    }, 1000);
  }, 1000);
}

// Initialize all enhanced features
function initializeEnhancedTerminal() {
  enhanceCommandList();
  addGlitchEffects();
  
  // Override the original final sequence with our enhanced version
  window.runFinalSequence = enhancedFinalSequence;
  
  // Add terminal boot sequence
  runImmersiveIntro();
}

// Add this function to your script.js file
function addStartInteraction() {
  // Create an overlay
  const interactionOverlay = document.createElement('div');
  interactionOverlay.style.position = 'fixed';
  interactionOverlay.style.top = '0';
  interactionOverlay.style.left = '0';
  interactionOverlay.style.width = '100%';
  interactionOverlay.style.height = '100%';
  interactionOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  interactionOverlay.style.zIndex = '9999';
  interactionOverlay.style.display = 'flex';
  interactionOverlay.style.justifyContent = 'center';
  interactionOverlay.style.alignItems = 'center';
  interactionOverlay.style.flexDirection = 'column';
  
  // Create title
  const title = document.createElement('div');
  title.style.color = '#0f0';
  title.style.fontFamily = "'Share Tech Mono', monospace";
  title.style.fontSize = '24px';
  title.style.marginBottom = '30px';
  title.style.textShadow = '0 0 10px #0f0';
  title.textContent = '> VOX RECRUITMENT TERMINAL';
  
  // Create button
  const startButton = document.createElement('button');
  startButton.className = 'button-terminal';
  startButton.style.opacity = '1';  // Make sure it's visible
  startButton.style.padding = '15px 30px';
  startButton.style.fontSize = '18px';
  startButton.style.backgroundColor = 'rgba(0, 30, 0, 0.5)';
  startButton.style.border = '2px solid #0f0';
  startButton.style.color = '#0f0';
  startButton.style.fontFamily = "'Share Tech Mono', monospace";
  startButton.style.cursor = 'pointer';
  startButton.textContent = 'INITIALIZE TERMINAL';
  
  // Add hover effect
  startButton.onmouseover = function() {
    startButton.style.backgroundColor = 'rgba(0, 60, 0, 0.5)';
    startButton.style.boxShadow = '0 0 15px #0f0';
  };
  startButton.onmouseout = function() {
    startButton.style.backgroundColor = 'rgba(0, 30, 0, 0.5)';
    startButton.style.boxShadow = 'none';
  };
  
  // Add event listener
  startButton.addEventListener('click', function() {
    // Remove the overlay
    document.body.removeChild(interactionOverlay);
    
    // Play a test sound to enable audio
    const testSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f8ad054.mp3?filename=keyboard-typing-102351.mp3');
    testSound.volume = 0.01; // Very quiet
    testSound.play().catch(e => console.log('Audio error:', e));
    
    // Make main terminal visible
    document.getElementById('mainTerminal').style.display = 'block';
    
    // Start the boot sequence
    initializeEnhancedTerminal();
  });
  
  // Add elements to the overlay
  interactionOverlay.appendChild(title);
  interactionOverlay.appendChild(startButton);
  document.body.appendChild(interactionOverlay);
  
  // Hide the main terminal until interaction
  document.getElementById('mainTerminal').style.display = 'none';
}

// Replace the window.addEventListener('load') function at the end of your script.js file with this:
window.addEventListener('load', function() {
  // Set up command input events
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
    const commands = ['trace', 'vox.status', 'decrypt node', 'access.redacted', 'vox.protocol.init', 'vox.logs', 'node.map', 'mission.request'];
    const match = commands.find(c => c.startsWith(val));
    if (match) commandInput.value = match;
  }
  
  // Instead of calling initializeEnhancedTerminal directly, call addStartInteraction
  addStartInteraction();
});
