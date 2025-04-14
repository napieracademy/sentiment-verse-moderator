const { execSync } = require('child_process');
const PORT = 3333;

try {
  console.log(`📌 Controllando processi sulla porta ${PORT}...`);
  
  if (process.platform === 'win32') {
    // Windows
    const result = execSync(`netstat -ano | findstr :${PORT}`).toString();
    const lines = result.trim().split('\n');
    
    if (lines.length > 0) {
      lines.forEach(line => {
        const match = line.match(/(\d+)$/);
        if (match && match[1]) {
          const pid = match[1];
          console.log(`🔥 Terminando processo ${pid} sulla porta ${PORT}`);
          execSync(`taskkill /F /PID ${pid}`);
        }
      });
    }
  } else {
    // macOS/Linux
    try {
      const cmd = `lsof -i :${PORT} -t`;
      const pids = execSync(cmd).toString().trim().split('\n');
      
      if (pids.length > 0 && pids[0] !== '') {
        pids.forEach(pid => {
          console.log(`🔥 Terminando processo ${pid} sulla porta ${PORT}`);
          execSync(`kill -9 ${pid}`);
        });
      }
      console.log(`✅ Porto ${PORT} liberato`);
    } catch (error) {
      // Se non ci sono processi sulla porta, lsof restituirà un errore
      console.log(`✅ Porto ${PORT} già libero`);
    }
  }
} catch (error) {
  console.log(`✅ Porto ${PORT} già libero o errore nel controllare: ${error.message}`);
}

// Verificare che tutte le porte comuni di Vite siano libere
try {
  console.log('🧹 Pulizia porte comuni di Vite (8080-8083)...');
  if (process.platform === 'win32') {
    // Windows
    execSync('taskkill /F /FI "PID ne 0" /FI "WINDOWTITLE eq vite"');
  } else {
    // macOS/Linux
    execSync('killall -9 node 2>/dev/null || true');
  }
} catch (error) {
  // Ignora errori se non ci sono processi da terminare
}

console.log('✨ Pronto per avviare Vite sulla porta 3333');
