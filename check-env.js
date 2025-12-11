const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');

console.log('🔍 Verificando URLs en .env:\n');

lines.forEach((line, index) => {
    if (line.includes('DATABASE_URL') || line.includes('DIRECT_URL')) {
        console.log(`Línea ${index + 1}: ${line}`);
    }
});
