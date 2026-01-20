#!/usr/bin/env node

/**
 * Script to render Mermaid diagrams from DIAGRAMS.md to PNG images
 * Requires: npm install -g @mermaid-js/mermaid-cli
 * Or: npm install @mermaid-js/mermaid-cli puppeteer
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIAGRAMS_FILE = path.join(__dirname, '../docs/DIAGRAMS.md');
const OUTPUT_DIR = path.join(__dirname, '../docs/diagrams-rendered');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read the diagrams file
const content = fs.readFileSync(DIAGRAMS_FILE, 'utf8');

// Extract all mermaid code blocks
const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
const diagrams = [];
let match;
let index = 0;

while ((match = mermaidRegex.exec(content)) !== null) {
  index++;
  const diagramCode = match[1].trim();
  const titleMatch = diagramCode.match(/^(flowchart|graph|sequenceDiagram|classDiagram)/);
  const type = titleMatch ? titleMatch[1] : 'diagram';
  
  diagrams.push({
    index,
    code: diagramCode,
    type,
    filename: `diagram-${index}-${type}.mmd`
  });
}

console.log(`Found ${diagrams.length} diagrams to render\n`);

// Check if mermaid-cli is available
let useMermaidCLI = false;
try {
  execSync('which mmdc', { stdio: 'ignore' });
  useMermaidCLI = true;
  console.log('Using mermaid-cli (mmdc) for rendering...\n');
} catch (e) {
  console.log('mermaid-cli not found. Creating individual .mmd files...\n');
  console.log('To render them, install mermaid-cli: npm install -g @mermaid-js/mermaid-cli');
  console.log('Then run: mmdc -i <file.mmd> -o <file.png>\n');
}

// Save each diagram
diagrams.forEach((diagram, idx) => {
  const mmdPath = path.join(OUTPUT_DIR, diagram.filename);
  fs.writeFileSync(mmdPath, diagram.code);
  console.log(`✓ Saved: ${diagram.filename}`);
  
  if (useMermaidCLI) {
    try {
      const pngPath = path.join(OUTPUT_DIR, diagram.filename.replace('.mmd', '.png'));
      const svgPath = path.join(OUTPUT_DIR, diagram.filename.replace('.mmd', '.svg'));
      
      // Render to PNG
      execSync(`mmdc -i "${mmdPath}" -o "${pngPath}" -w 2400 -H 1800`, { stdio: 'inherit' });
      console.log(`  → Rendered PNG: ${path.basename(pngPath)}`);
      
      // Render to SVG
      execSync(`mmdc -i "${mmdPath}" -o "${svgPath}"`, { stdio: 'inherit' });
      console.log(`  → Rendered SVG: ${path.basename(svgPath)}\n`);
    } catch (error) {
      console.error(`  ✗ Error rendering ${diagram.filename}:`, error.message);
    }
  }
});

console.log(`\n✓ All diagrams processed!`);
console.log(`Output directory: ${OUTPUT_DIR}`);

if (!useMermaidCLI) {
  console.log('\nTo render the diagrams:');
  console.log('1. Install mermaid-cli: npm install -g @mermaid-js/mermaid-cli');
  console.log('2. Run: cd docs/diagrams-rendered');
  console.log('3. Run: for file in *.mmd; do mmdc -i "$file" -o "${file%.mmd}.png" -w 2400 -H 1800; done');
}
