const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'Pages', 'SellerPanel', 'UploadChannel.jsx');
let content = fs.readFileSync(targetFile, 'utf-8');

const lines = content.split('\n');

const applyReplacements = (line) => {
  // If line contains bg-gradient (usually a button or icon wrapper), we DON'T change text-white.
  // Unless it's just the header or background.
  let l = line;
  
  // Backgrounds and borders
  l = l.replace(/bg-\[#0d0b1a\]/g, 'bg-gray-50 dark:bg-[#0d0b1a]');
  l = l.replace(/bg-white\/\[0\.04\]/g, 'bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-none');
  l = l.replace(/bg-white\/\[0\.06\]/g, 'bg-gray-50 dark:bg-white/[0.06]');
  l = l.replace(/border-white\/10/g, 'border-gray-200 dark:border-white/10');
  l = l.replace(/border-white\/15/g, 'border-gray-200 dark:border-white/15');
  l = l.replace(/border-white\/20/g, 'border-gray-300 dark:border-white/20');
  l = l.replace(/border-white\/\[0\.08\]/g, 'border-gray-200 dark:border-white/[0.08]');
  l = l.replace(/border-white\/\[0\.12\]/g, 'border-gray-300 dark:border-white/[0.12]');
  l = l.replace(/bg-white\/5/g, 'bg-gray-100 dark:bg-white/5');
  l = l.replace(/bg-white\/10/g, 'bg-gray-200 dark:bg-white/10');
  
  // Text colors - only replace if not a gradient element (to keep buttons white)
  if (!line.includes('bg-gradient')) {
    l = l.replace(/text-white(?=[\s"}])/g, 'text-gray-900 dark:text-white');
  }
  
  l = l.replace(/text-white\/40/g, 'text-gray-500 dark:text-white/40');
  l = l.replace(/text-white\/30/g, 'text-gray-400 dark:text-white/30');
  l = l.replace(/text-white\/35/g, 'text-gray-400 dark:text-white/35');
  l = l.replace(/text-white\/50/g, 'text-gray-500 dark:text-white/50');
  l = l.replace(/text-white\/60/g, 'text-gray-600 dark:text-white/60');
  l = l.replace(/text-white\/70/g, 'text-gray-600 dark:text-white/70');
  l = l.replace(/text-white\/80/g, 'text-gray-700 dark:text-white/80');
  l = l.replace(/text-white\/25/g, 'text-gray-400 dark:text-white/25');
  l = l.replace(/text-white\/20/g, 'text-gray-400 dark:text-white/20');

  // Placeholders
  l = l.replace(/placeholder-white\/25/g, 'placeholder-gray-400 dark:placeholder-white/25');
  l = l.replace(/placeholder-white\/40/g, 'placeholder-gray-400 dark:placeholder-white/40');
  
  return l;
};

const modifiedLines = lines.map(applyReplacements);
const modifiedContent = modifiedLines.join('\n');

if (content !== modifiedContent) {
  fs.writeFileSync(targetFile, modifiedContent, 'utf-8');
  console.log('Successfully updated UploadChannel.jsx with responsive theme classes.');
} else {
  console.log('No changes were made.');
}
