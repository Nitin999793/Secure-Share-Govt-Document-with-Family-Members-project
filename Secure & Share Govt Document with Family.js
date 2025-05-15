<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Secure & Share Govt Document with Family Members</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Montserrat', sans-serif;
    background: linear-gradient(135deg, #3a86ff, #8338ec);
    color: #fff;
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  #container {
    background: #1f1f38;
    border-radius: 12px;
    max-width: 720px;
    width: 100%;
    box-shadow: 0 0 20px rgba(0,0,0,0.7);
    padding: 30px;
  }
  h1 {
    text-align: center;
    margin-bottom: 25px;
    font-weight: 700;
    font-size: 2em;
    letter-spacing: 1.5px;
  }
  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9em;
    color: #cbd5e1;
  }
  input[type="file"],
  input[type="password"],
  textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    border: none;
    font-size: 1em;
    margin-bottom: 15px;
    font-family: monospace;
  }
  textarea {
    resize: vertical;
    min-height: 70px;
  }
  input[type="text"] {
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    border: none;
    font-size: 1em;
    margin-bottom: 15px;
  }
  button {
    background: #ff006e;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-weight: 700;
    padding: 14px 22px;
    cursor: pointer;
    width: 100%;
    font-size: 1.1em;
    transition: background 0.3s ease;
  }
  button:hover {
    background: #d9046e;
  }
  .section {
    margin-bottom: 30px;
  }
  .divider {
    height: 2px;
    background: #8338ec;
    margin: 10px 0 30px 0;
    border-radius: 4px;
  }
  #encryptedOutput,
  #decryptedOutput {
    background: #2a2a4a;
    border-radius: 8px;
    padding: 14px;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 10px;
    font-size: 0.85em;
  }
  .small-info {
    font-size: 0.85em;
    color: #a3a3c2;
    margin-top: -10px;
    margin-bottom: 20px;
  }
  .link-button {
    background: transparent;
    border: 1.5px solid #ff006e;
    color: #ff006e;
    padding: 8px 16px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    width: auto;
    margin-top: 10px;
  }
  .link-button:hover {
    background: #ff006e;
    color: white;
    transition: 0.3s;
  }
  .copy-notice {
    font-size: 0.8em;
    color: #4ade80;
    margin-top: 5px;
    font-weight: 600;
  }
  @media (max-width: 560px) {
    #container {
      padding: 20px;
    }
    h1 {
      font-size: 1.6em;
    }
  }
</style>
</head>
<body>
<div id="container">
  <h1>Secure & Share Govt Document</h1>
  <div class="section" id="encryptSection">
    <h2>Encrypt & Share</h2>
    <label for="docFile">Select Govt Document (any file):</label>
    <input type="file" id="docFile" accept="/" />
    
    <label for="familyEmails">Family Member Emails (comma separated):</label>
    <input type="text" id="familyEmails" placeholder="example1@mail.com, example2@mail.com" />
    <div class="small-info">* Emails are for simulation only. No actual emails are sent.</div>

    <label for="encryptPassword">Set a Password to Encrypt Document:</label>
    <input type="password" id="encryptPassword" placeholder="Enter encryption password" />

    <button id="encryptBtn">Encrypt & Generate Shareable Data</button>

    <div id="encryptedOutputContainer" style="display:none;">
      <label>Encrypted Document Data (share this with family):</label>
      <textarea id="encryptedOutput" readonly></textarea>
      <button class="link-button" id="copyEncrypted">Copy Encrypted Data</button>
      <div class="copy-notice" id="copyNoticeEncrypted"></div>
    </div>
  </div>

  <div class="divider"></div>

  <div class="section" id="decryptSection">
    <h2>Decrypt & View Document</h2>
    <label for="encryptedInput">Paste Encrypted Document Data:</label>
    <textarea id="encryptedInput" placeholder="Paste encrypted data here"></textarea>

    <label for="decryptPassword">Password to Decrypt:</label>
    <input type="password" id="decryptPassword" placeholder="Enter password" />

    <button id="decryptBtn">Decrypt & Download Document</button>

    <div id="decryptedOutputContainer" style="display:none;">
      <label>Decrypted Document Info:</label>
      <pre id="decryptedOutput"></pre>
      <button class="link-button" id="downloadDecrypted" style="display:none;">Download Document</button>
    </div>
  </div>
</div>

<script>
  (() => {
    // Helper: convert ArrayBuffer to Base64
    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    // Helper: convert Base64 to ArrayBuffer
    function base64ToArrayBuffer(base64) {
      const binary = window.atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }

    // Derive key from password using PBKDF2
    async function deriveKey(password, salt) {
      const enc = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveKey"]
      );
      return window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    }

    // Encrypt data with password
    async function encryptData(data, password) {
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(password, salt);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
      );
      return {
        salt: arrayBufferToBase64(salt.buffer),
        iv: arrayBufferToBase64(iv.buffer),
        ciphertext: arrayBufferToBase64(encrypted)
      };
    }

    // Decrypt data with password and parameters
    async function decryptData(ciphertextBase64, password, saltBase64, ivBase64) {
      try {
        const salt = new Uint8Array(base64ToArrayBuffer(saltBase64));
        const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
        const ciphertext = base64ToArrayBuffer(ciphertextBase64);
        const key = await deriveKey(password, salt);
        const decrypted = await window.crypto.subtle.decrypt(
          {name: "AES-GCM", iv: iv},
          key,
          ciphertext
        );
        return decrypted;
      } catch (err) {
        throw new Error('Decryption failed. Incorrect password or corrupted data.');
      }
    }

    // Elements
    const docFile = document.getElementById("docFile");
    const familyEmails = document.getElementById("familyEmails");
    const encryptPassword = document.getElementById("encryptPassword");
    const encryptBtn = document.getElementById("encryptBtn");
    const encryptedOutputContainer = document.getElementById("encryptedOutputContainer");
    const encryptedOutput = document.getElementById("encryptedOutput");
    const copyEncryptedBtn = document.getElementById("copyEncrypted");
    const copyNoticeEncrypted = document.getElementById("copyNoticeEncrypted");

    const encryptedInput = document.getElementById("encryptedInput");
    const decryptPassword = document.getElementById("decryptPassword");
    const decryptBtn = document.getElementById("decryptBtn");
    const decryptedOutputContainer = document.getElementById("decryptedOutputContainer");
    const decryptedOutput = document.getElementById("decryptedOutput");
    const downloadDecryptedBtn = document.getElementById("downloadDecrypted");

    // Encrypt Button Logic
    encryptBtn.addEventListener("click", async () => {
      copyNoticeEncrypted.textContent = "";
      if (!docFile.files.length) {
        alert("Please select a document file to encrypt.");
        return;
      }
      const passwordVal = encryptPassword.value;
      if (!passwordVal || passwordVal.length < 6) {
        alert("Please enter a password with at least 6 characters to encrypt.");
        return;
      }

      try {
        const file = docFile.files[0];
        const familyEmailsVal = familyEmails.value.trim();

        // Read file as ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Encrypt file data
        const encryptedData = await encryptData(fileBuffer, passwordVal);

        // Compose shareable JSON data
        const shareData = {
          filename: file.name,
          familyMembers: familyEmailsVal ? familyEmailsVal.split(",").map(e => e.trim()).filter(e => e.length > 0) : [],
          salt: encryptedData.salt,
          iv: encryptedData.iv,
          ciphertext: encryptedData.ciphertext
        };

        // Output as pretty JSON string
        const shareJsonString = JSON.stringify(shareData, null, 2);

        encryptedOutput.value = shareJsonString;
        encryptedOutputContainer.style.display = "block";

        // Clear inputs except family emails for ease of multiple encryptions
        docFile.value = "";
        encryptPassword.value = "";

        alert("Document encrypted successfully! Share the encrypted data with your family members.");

      } catch (err) {
        alert("Encryption failed: " + err.message);
      }
    });

    // Copy encrypted data to clipboard
    copyEncryptedBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(encryptedOutput.value).then(() => {
        copyNoticeEncrypted.textContent = "Copied to clipboard!";
        setTimeout(() => {
          copyNoticeEncrypted.textContent = "";
        }, 3000);
      });
    });

    // Decrypt Button Logic
    decryptBtn.addEventListener("click", async () => {
      decryptedOutputContainer.style.display = "none";
      decryptedOutput.textContent = "";
      downloadDecryptedBtn.style.display = "none";

      const encryptedText = encryptedInput.value.trim();
      const passwordVal = decryptPassword.value;

      if (!encryptedText) {
        alert("Please paste the encrypted document data.");
        return;
      }
      if (!passwordVal) {
        alert("Please enter the password to decrypt.");
        return;
      }

      try {
        const shareData = JSON.parse(encryptedText);

        const decryptedBuffer = await decryptData(
          shareData.ciphertext,
          passwordVal,
          shareData.salt,
          shareData.iv
        );

        // Show decrypted info
        decryptedOutput.textContent = Filename: ${shareData.filename}\nFamily Members Shared:\n${shareData.familyMembers.length ? shareData.familyMembers.join(", ") : "No family members listed."}\n\nThe document will be downloaded now.;

        // Create and trigger download for decrypted file
        const blob = new Blob([decryptedBuffer]);
        const url = URL.createObjectURL(blob);

        downloadDecryptedBtn.style.display = "inline-block";
        downloadDecryptedBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = url;
          a.download = shareData.filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        };

        decryptedOutputContainer.style.display = "block";

        alert("Decryption successful! Click 'Download Document' to save the file.");

      } catch (err) {
        alert(err.message);
      }
    });
  })();
</script>

</body>
</html>