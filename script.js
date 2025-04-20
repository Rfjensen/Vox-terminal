// Enhanced VOX Terminal with interconnected commands

// ------ CORE VARIABLES & STATE ------
const output = document.getElementById('mainOutput');
const commandInput = document.getElementById('commandInput');
const unlockMessage = document.getElementById('unlockMessage');
const hackerNoise = document.getElementById('hackerNoise');
const commandPanel = document.getElementById('commandPanel');

let voiceUnlocked = false;
let gameState = {
    activeNodes: 5, // Start with 5/7 nodes active
    nodesConnected: false,
    traceInitiated: false,
    nodeMapUnlocked: false,
    foundFrequency: false,
    foundEncryptionKey: false,
    foundNodeLocations: false,
    completedMission: false
};

// Audio Context for generated sounds
let audioContext = null;

// Initialize audio context on first interaction
function initializeAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio system initialized");
  }
}

// ------ SOUND FUNCTIONS ------
function playTypeSound() {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playErrorSound() {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

function playSuccessSound() {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.15);
}

function playNodeConnectSound() {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 700;
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

// ------ UI FUNCTIONS ------
function showPopup(title, message) {
  const popup = document.getElementById('popupOverlay');
  const header = document.getElementById('popupHeader');
  const body = document.getElementById('popupBody');
  
  header.textContent = title;
  body.innerHTML = message;
  popup.style.display = 'flex';
  
  playSuccessSound();
}

function closePopup() {
  const popup = document.getElementById('popupOverlay');
  popup.style.display = 'none';
}

function startVoiceRecognition() {
  // Hide the input line during voice phase
  const inputLine = document.querySelector('.input-line');
  if (inputLine) inputLine.style.display = 'none';
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showPopup('SYSTEM ERROR', 'Speech recognition not supported on this device.');
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
      showCommandPanel();
      document.getElementById('startBtn').remove();
      document.getElementById('clue').remove();
    } else {
      showPopup('ACCESS DENIED', 'Incorrect passphrase. Try again.');
    }
  };
  recognition.start();
}

function showCommandPanel() {
  commandPanel.style.display = 'flex';
  commandInput.focus();
  
  // Add initial message to terminal
  const responseElement = document.createElement('div');
  responseElement.innerHTML = `<br>> TERMINAL READY. TYPE "help" FOR AVAILABLE COMMANDS.<br>`;
  responseElement.style.color = '#0f0';
  output.appendChild(responseElement);
}

// ------ COMMAND PROCESSING ------
function submitCommand() {
  const cmd = commandInput.value.trim().toLowerCase();
  if (!cmd) return;
  
  commandInput.value = '';
  runCommand(cmd);
}

// Listen for Enter key
commandInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitCommand();
  }
});

function runCommand(cmd) {
  if (!voiceUnlocked) {
    showPopup('ACCESS DENIED', 'Voice authentication required.');
    return;
  }

  // Create a new command element
  const commandElement = document.createElement('div');
  commandElement.innerHTML = `> ${cmd}`;
  output.appendChild(commandElement);
  
  playTypeSound();

  switch(cmd) {
    case 'help':
      displayHelp();
      break;
      
    case 'trace':
      if (!gameState.traceInitiated) {
        initiateTrace();
      } else {
        addResponse('Trace already initiated. Try "vox.status" or other commands.');
      }
      break;
      
    case 'vox.status':
      displayStatus();
      break;
      
    case 'scan.interference':
      if (gameState.traceInitiated) {
        scanInterference();
      } else {
        addResponse('Error: No trace initiated. Run "trace" first.');
      }
      break;
      
    case 'analyze.frequency':
      if (gameState.foundFrequency) {
        analyzeFrequency();
      } else {
        addResponse('Error: No frequency data available. Try "scan.interference" first.');
      }
      break;
      
    case 'vox.logs':
      displayLogs();
      break;
      
    case 'decrypt.protocol':
      if (gameState.foundEncryptionKey) {
        decryptProtocol();
      } else {
        addResponse('Error: Encryption key not found. Check "vox.logs" for clues.');
      }
      break;
      
    case 'node.map':
      if (gameState.nodeMapUnlocked) {
        showNodeMap();
      } else {
        addResponse('Error: Map access denied. Need to decrypt protocols first.');
      }
      break;
      
    case 'vox.protocol.init':
      if (gameState.nodesConnected) {
        runFinalSequence();
      } else {
        addResponse('Command Locked. All nodes must be connected.');
      }
      break;
      
    default:
      addResponse('Unknown command. Type "help" for available commands.');
  }
  
  // Scroll to the bottom after adding content
  output.scrollTop = output.scrollHeight;
}

function addResponse(text) {
  const responseElement = document.createElement('div');
  responseElement.innerHTML = text;
  output.appendChild(responseElement);
}

// ------ COMMAND FUNCTIONS ------
function displayHelp() {
  const helpText = `
  > Available Commands:
    - trace               ............ begin node trace operation
    - vox.status          ............ check network diagnostics
    - scan.interference   ............ scan for signal interference
    - analyze.frequency   ............ analyze frequency patterns
    - vox.logs            ............ access system logs
    - decrypt.protocol    ............ decrypt secure protocols
    - node.map            ............ display network map
    - vox.protocol.init   ............ [requires all nodes active]
  
  Note: Some commands unlock based on previous discoveries.
  `;
  addResponse(helpText);
}

function initiateTrace() {
  gameState.traceInitiated = true;
  simulateHacking(2000, () => {
    addResponse('NODE TRACE: SIGIL-1134 ACTIVE<br>');
    addResponse('DETECTED: 5/7 nodes online<br>');
    addResponse('WARNING: Interference detected. Use "scan.interference" to investigate.');
  });
}

function displayStatus() {
  const statusText = `
  UPLINK: STABLE
  GRID: INTERFERENCE DETECTED
  NODES ACTIVE: ${gameState.activeNodes}/7
  SECURITY: ${gameState.activeNodes === 7 ? 'OPTIMAL' : 'COMPROMISED'}
  STATUS: ${gameState.activeNodes === 7 ? 'ALL NODES CONNECTED' : 'NODES OFFLINE'}
  `;
  
  const statusOutput = document.createElement('div');
  statusOutput.className = 'status-output';
  output.appendChild(statusOutput);
  
  typeWriterEffect(statusOutput, statusText, 30, () => {
    if (gameState.activeNodes === 7) {
      addResponse('<br>ALL NODES ACTIVE. VOX PROTOCOL INITIALIZATION AVAILABLE.');
    }
  });
}

function scanInterference() {
  gameState.foundFrequency = true;
  simulateHacking(1500, () => {
    addResponse('Scanning interference patterns...');
    setTimeout(() => {
      addResponse('INTERFERENCE SOURCE: Frequency 117.3 MHz');
      addResponse('DISCOVERY: Non-standard encryption detected');
      addResponse('Use "analyze.frequency" to decipher signal pattern.');
    }, 1000);
  });
}

function analyzeFrequency() {
  const analysisText = `
  FREQUENCY ANALYSIS RESULT:
  - Signal type: VOX secure channel
  - Encryption: Cipher-9 protocol
  - Origin: Dormant nodes 23 and 42
  - Decryption key required
  
  Check "vox.logs" for potential decryption keys.
  `;
  addResponse(analysisText);
}

function displayLogs() {
  gameState.foundEncryptionKey = true;
  const logText = `
  <div class="vox-log">
    <div class="log-header">LOG: ENTRY 183</div>
    <div class="log-content">
      All nodes must maintain radio discipline.
      Dormant nodes can be reactivated using sequence: "ECHO-CIPHER-9"
      Remember: we listen to silence, we speak through echoes.
    </div>
    <div class="log-signature">-- Nexus Command</div>
  </div>
  `;
  addResponse(logText);
  addResponse('<br>LOG FILE CONTAINS ENCRYPTION KEY: "ECHO-CIPHER-9"');
}

function decryptProtocol() {
  gameState.nodeMapUnlocked = true;
  simulateHacking(2000, () => {
    addResponse('Decrypting protocol with key "ECHO-CIPHER-9"...');
    setTimeout(() => {
      addResponse('SUCCESS: Node locations decrypted');
      addResponse('NODE MAP UNLOCKED - Use "node.map" to access');
      addResponse('WARNING: Dormant nodes must be manually connected');
    }, 1500);
  });
}

// ------ NODE MAP FUNCTIONS ------
function showNodeMap() {
  const mapOverlay = document.getElementById('nodeMapOverlay');
  mapOverlay.style.display = 'flex';
  
  const mapInstructions = document.getElementById('mapInstructions');
  if (gameState.activeNodes < 7) {
    mapInstructions.style.display = 'block';
  }
  
  initializeNodeMap();
}

function closeNodeMap() {
  const mapOverlay = document.getElementById('nodeMapOverlay');
  mapOverlay.style.display = 'none';
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
    { name: "NODE 31", x: width * 0.1, y: height * 0.8, status: "active", size: 4 },
    { name: "NODE 42", x: width * 0.9, y: height * 0.9, status: "dormant", size: 3 }
  ];
  
  // Check if nodes should be active based on gameState
  if (gameState.activeNodes === 7) {
    cities.forEach(city => city.status = "active");
  }
  
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
  
  // Draw function
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
      } else {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      }
      
      ctx.beginPath();
      ctx.moveTo(fromCity.x, fromCity.y);
      ctx.lineTo(toCity.x, toCity.y);
      ctx.stroke();
    });
    
    // Draw cities
    cities.forEach((city, index) => {
      // City status color
      if (city.status === 'active') {
        ctx.fillStyle = '#0f0';
      } else if (city.status === 'dormant') {
        ctx.fillStyle = '#555';
      }
      
      // Draw node point
      ctx.beginPath();
      ctx.arc(city.x, city.y, city.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Make dormant nodes clickable
      if (city.status === 'dormant') {
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw city name
      ctx.font = '10px "Share Tech Mono"';
      ctx.fillStyle = '#0f0';
      ctx.textAlign = 'center';
      ctx.fillText(city.name, city.x, city.y - city.size - 5);
    });
  }
  
  // Initial draw
  drawMap();
  
  // Handle clicking on dormant nodes
  canvas.onclick = function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    cities.forEach((city, index) => {
      const dx = x - city.x;
      const dy = y - city.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= city.size + 5 && city.status === 'dormant') {
        // Activate the node
        city.status = 'active';
        gameState.activeNodes++;
        playNodeConnectSound();
        
        // Redraw map
        drawMap();
        
        // Update status
        document.querySelector('.status-text').textContent = `Online - ${gameState.activeNodes}/7 Nodes Active`;
        
        // Check if all nodes are connected
        if (gameState.activeNodes === 7) {
          gameState.nodesConnected = true;
          showPopup('ALL NODES CONNECTED', 'VOX PROTOCOL INITIALIZATION READY');
          document.getElementById('mapInstructions').style.display = 'none';
        }
      }
    });
  };
}

// ------ FINAL SEQUENCE ------
function runFinalSequence() {
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
  playSuccessSound();
  
  // Create glitch transition
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch-overlay';
  document.body.appendChild(glitchOverlay);
  
  setTimeout(() => {
    // Clear previous content
    const overlay = document.querySelector('.final-sequence-overlay');
    if (overlay) overlay.remove();
    
    document.querySelector('.terminal-container').style.display = 'none';
    
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
      
      // Add interactive easter egg
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

// ------ HELPER FUNCTIONS ------
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

// ------ INITIALIZATION ------
function runBootSequence() {
  const terminal = document.getElementById('mainTerminal');
  terminal.classList.add('booting');
  
  // Clear the output first
  output.innerHTML = '';
  
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
      // Create a new message element
      const messageElement = document.createElement('div');
      messageElement.textContent = bootMessages[count];
      output.appendChild(messageElement);
      
      // Scroll to bottom
      output.scrollTop = output.scrollHeight;
      
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
    // Initialize audio system
    initializeAudio();
    
    // Play a test sound
    playTypeSound();
    
    // Remove the overlay
    document.body.removeChild(interactionOverlay);
    
    // Make main terminal visible
    document.querySelector('.terminal-container').style.display = 'flex';
    
    // Start the boot sequence
    runBootSequence();
  });
  
  // Add elements to the overlay
  interactionOverlay.appendChild(title);
  interactionOverlay.appendChild(startButton);
  document.body.appendChild(interactionOverlay);
  
  // Hide the main terminal until interaction
  document.querySelector('.terminal-container').style.display = 'none';
}

// Initialize everything when the page loads
window.addEventListener('load', function() {
  addStartInteraction();
});
