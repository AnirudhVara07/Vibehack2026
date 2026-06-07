const fs = require('fs');
const path = require('path');

const files = [
  'src/routes/join.tsx',
  'src/routes/group.tsx',
  'src/components/ChatLobby.jsx',
  'src/components/CircleChat.jsx'
];

const replacements = [
  [/bg-cream/g, 'bg-[#FFFFFF]'],
  [/text-sage-950/g, 'text-[#1B2D4A]'],
  [/text-sage-800\/60/g, 'text-[#4BACD5]'],
  [/text-sage-800\/70/g, 'text-[#2882B4]'],
  [/text-sage-800\/40/g, 'text-[#4BACD5]/60'],
  [/text-sage-800\/50/g, 'text-[#4BACD5]/70'],
  [/text-sage-800/g, 'text-[#2882B4]'],
  [/bg-sage-800\/10/g, 'bg-[#93D4F7]/20'],
  [/bg-sage-800/g, 'bg-[#93D4F7]/20 text-[#2882B4]'], // since it usually had cream text, but now we give it light blue bg and blue text
  [/bg-sage-100/g, 'bg-[#F4FAFD]'],
  [/bg-sage-50/g, 'bg-[#FFFFFF]'],
  [/bg-sage-200/g, 'bg-[#E5F4FC]'],
  [/border-sage-800\/10/g, 'border-[#93D4F7]/40'],
  [/border-sage-800\/20/g, 'border-[#93D4F7]/60'],
  [/border-sage-800\/15/g, 'border-[#93D4F7]/50'],
  [/border-sage-800\/5/g, 'border-[#93D4F7]/20'],
  [/ring-sage-800\/10/g, 'ring-[#93D4F7]/40'],
  [/ring-sage-800\/20/g, 'ring-[#93D4F7]/60'],
  [/font-serif/g, 'font-sans'],
  [/italic/g, ''],
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    // some manual fixes for bg-sage-800 replacement where text-cream was used
    content = content.replace(/text-cream/g, ''); // we already added text-[#2882B4]
    content = content.replace(/bg-\[\#93D4F7\]\/20 text-\[\#2882B4\] text-\[\#1B2D4A\]/g, 'bg-[#93D4F7]/20 text-[#2882B4]');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
});
