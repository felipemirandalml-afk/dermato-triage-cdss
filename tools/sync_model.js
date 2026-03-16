import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.join(__dirname, '..');
const jsonPath = path.join(rootPath, 'engine', 'model_coefficients.json');
const jsPath = path.join(rootPath, 'engine', 'probabilistic_model.js');

const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let jsContent = fs.readFileSync(jsPath, 'utf8');

const modelDataString = JSON.stringify(jsonData, null, 2);
const regex = /const MODEL_DATA = \{[\s\S]*?\};/;
jsContent = jsContent.replace(regex, `const MODEL_DATA = ${modelDataString};`);

fs.writeFileSync(jsPath, jsContent);
console.log("Sync complete.");
