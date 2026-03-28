#!/bin/bash
set -e

DB_NAME="team_time_db"

if ! command -v node &> /dev/null; then echo "Error: 'node' is required." && exit 1; fi

read -p "Enter username: " username
if [ -z "$username" ]; then echo "Error: Username empty." && exit 1; fi

echo "Generating a secure password..."
password=$(LC_ALL=C tr -dc 'a-zA-Z0-9!@#$%^&*()_+~`|}{[]:;?><,./-=' < /dev/urandom | head -c 50)

export TEMP_PASS="$password"
export TEMP_USER="$username"

CRYPTO_JSON=$(node -e "
const crypto = require('crypto');
const password = process.env.TEMP_PASS;
const username = process.env.TEMP_USER;
const defaultData = JSON.stringify({ allocations: {values:[]}, members: {values:[]}, tasks: {values:[]}, modules: {values:[]} });

function encryptGCM(text, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, encrypted, cipher.getAuthTag()]).toString('base64');
}

try {
  // 1. Derive master key
  const masterKey = crypto.pbkdf2Sync(password, username, 100000, 32, 'sha256');
  
  // 2. DETERMINISTIC ID (For DB lookup)
  const hmacId = crypto.createHmac('sha256', masterKey).update(username).digest('base64');
  
  // 3. RANDOM CONTENT (Security)
  const encryptedText = encryptGCM(defaultData, masterKey);
  
  console.log(JSON.stringify({ hmacId, encryptedText }));
} catch (e) { process.exit(1); }
")

encryptedId=$(echo $CRYPTO_JSON | node -p "JSON.parse(process.argv[1]).hmacId" "$CRYPTO_JSON")
encryptedText=$(echo $CRYPTO_JSON | node -p "JSON.parse(process.argv[1]).encryptedText" "$CRYPTO_JSON")

credentials_file="${username}.txt"
echo -e "Username: ${username}\nPassword: ${password}" > "$credentials_file"

echo "Inserting record into REMOTE D1..."
sql_command="INSERT INTO files (id, content, updated_at) VALUES ('${encryptedId}', '${encryptedText}', CURRENT_TIMESTAMP);"
npx wrangler d1 execute "$DB_NAME" --remote --command="$sql_command"

echo -e "\nUser '${username}' successfully provisioned!"