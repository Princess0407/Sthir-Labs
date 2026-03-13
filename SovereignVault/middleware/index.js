const crypto = require('crypto');

// Task 3: getMockAIResult placeholder
function getMockAIResult() {
    return {
        ulpin: "ULPIN-9876543210",
        confidenceScore: 0.99,
        landDimensions: {
            length: 150.5,
            width: 100.2,
            unit: "meters"
        },
        aiModelVersion: "v1.5"
    };
}

// Task 3: Deterministic Serialization & SHA-256 Hashing
function serializeAndHash(jsonObject) {
    // Deterministic Serialization: Sort the JSON keys alphabetically
    const deterministicStringify = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return JSON.stringify(obj);
        }
        if (Array.isArray(obj)) {
            return '[' + obj.map(deterministicStringify).join(',') + ']';
        }
        const keys = Object.keys(obj).sort();
        const kvPairs = keys.map(k => `"${k}":${deterministicStringify(obj[k])}`);
        return '{' + kvPairs.join(',') + '}';
    };

    const serializedData = deterministicStringify(jsonObject);
    console.log("\n[1] Deterministic Serialized JSON:\n", serializedData);

    // SHA-256 Hashing
    const hash = crypto.createHash('sha256').update(serializedData).digest('hex');
    console.log("\n[2] SHA-256 Hash of Data:\n", hash);

    return { serializedData, hash };
}

// Task 4: Digital Signature Generation
function generateDigitalSignature(hash, privateKeyPem) {
    const sign = crypto.createSign('SHA256');
    sign.update(hash);
    sign.end();

    // Sign the hash using the provided private key
    const signature = sign.sign(privateKeyPem, 'hex');
    console.log("\n[3] Digital Signature (Hex):\n", signature);
    return signature;
}

// Demonstration function to test pipeline immediately
function runPipeline() {
    console.log("=== Sthir Labs: Sovereign Vault Integration Bridge ===");

    // 1. Get mock AI data
    const aiResult = getMockAIResult();
    console.log("\n[0] Mock AI Output Received:", aiResult);

    // 2. Serialize and Hash
    const { hash } = serializeAndHash(aiResult);

    // 3. Generate a quick RSA keypair for demonstration purposes
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // 4. Generate digital signature for the hash
    const signature = generateDigitalSignature(hash, privateKey);
    console.log("\nPipeline successfully completed! Ready to send to NBFLite Ledger.");
}

// Run the demonstration if executed directly
if (require.main === module) {
    runPipeline();
}

module.exports = {
    getMockAIResult,
    serializeAndHash,
    generateDigitalSignature
};
