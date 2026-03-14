const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const frontendDir = path.resolve(__dirname, '../../frontend');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            try {
                const result = babel.transformSync(content, {
                    filename: fullPath,
                    plugins: [
                        ['@babel/plugin-syntax-jsx'],
                        ['@babel/plugin-transform-typescript', { isTSX: true, allExtensions: true }]
                    ],
                    retainLines: true,
                    generatorOpts: {
                        retainLines: true,
                        compact: false
                    }
                });

                if (result && result.code !== content) {
                    // Quick fix for generator adding empty lines where types were
                    const cleanedCode = result.code.replace(/^\s*[\r\n]/gm, '\n');
                    fs.writeFileSync(fullPath, result.code, 'utf8');
                    console.log(`Processed: ${fullPath}`);
                }
            } catch (err) {
                console.error(`Error processing ${fullPath}:`, err.message);
            }
        }
    }
}

console.log("Starting Babel TS-stripper...");
processDirectory(frontendDir);
console.log("Finished.");
