const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'Pages', 'SellerPanel', 'UploadChannel.jsx');
let content = fs.readFileSync(targetFile, 'utf-8');

const replacements = [
  { search: /bg-\[#0d0b1a\]/g, replace: 'bg-gray-50 dark:bg-[#0d0b1a]' },
  
  // Text colors
  { search: /text-white([\s}])/g, replace: 'text-gray-900 dark:text-white$1' },
  { search: /text-white\"/g, replace: 'text-gray-900 dark:text-white"' },
  { search: /text-white\/40/g, replace: 'text-gray-500 dark:text-white/40' },
  { search: /text-white\/30/g, replace: 'text-gray-400 dark:text-white/30' },
  { search: /text-white\/50/g, replace: 'text-gray-500 dark:text-white/50' },
  { search: /text-white\/70/g, replace: 'text-gray-700 dark:text-white/70' },
  { search: /text-white\/25/g, replace: 'text-gray-400 dark:text-white/25' },
  
  // Backgrounds and borders with opacity
  { search: /bg-white\/\[0\.04\]/g, replace: 'bg-white dark:bg-white/[0.04]' },
  { search: /bg-white\/\[0\.06\]/g, replace: 'bg-white dark:bg-white/[0.06]' },
  { search: /border-white\/10/g, replace: 'border-gray-200 dark:border-white/10' },
  { search: /border-white\/15/g, replace: 'border-gray-200 dark:border-white/15' },
  { search: /border-white\/20/g, replace: 'border-gray-300 dark:border-white/20' },
  { search: /border-white\/\[0\.08\]/g, replace: 'border-gray-200 dark:border-white/[0.08]' },
  
  { search: /bg-white\/5/g, replace: 'bg-gray-100 dark:bg-white/5' },
  { search: /bg-white\/10/g, replace: 'bg-gray-200 dark:bg-white/10' },
  
  // Placeholders
  { search: /placeholder-white\/25/g, replace: 'placeholder-gray-400 dark:placeholder-white/25' },
  { search: /placeholder-white\/40/g, replace: 'placeholder-gray-400 dark:placeholder-white/40' },
];

let modifiedContent = content;
for (const { search, replace } of replacements) {
  modifiedContent = modifiedContent.replace(search, replace);
}

if (content !== modifiedContent) {
  fs.writeFileSync(targetFile, modifiedContent, 'utf-8');
  console.log('Successfully updated UploadChannel.jsx with responsive theme classes.');
} else {
  console.log('No changes were made.');
}
