import fs from 'fs';
import path from 'path';

const srcFolder = 'c:/Users/user/Documents/seostudio/2026.7.2 인터렉티브 스토리 제작소/src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk(srcFolder);
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace white background with cream background and cream border
    content = content.replace(/background: 'white'/g, "background: '#faf8f5', border: '3px solid #e8dfd5'");
    content = content.replace(/background: 'rgba\(255,255,255,0\.9\)'/g, "background: 'rgba(250, 248, 245, 0.9)', border: '3px solid #e8dfd5'");
    content = content.replace(/background: 'rgba\(255,255,255,0\.95\)'/g, "background: 'rgba(250, 248, 245, 0.95)', border: '3px solid #e8dfd5'");
    content = content.replace(/background: 'rgba\(255,255,255,0\.8\)'/g, "background: '#faf8f5', border: '3px solid #e8dfd5'");
    content = content.replace(/background: 'rgba\(255, 255, 255, 0\.9\)'/g, "background: 'rgba(250, 248, 245, 0.9)', border: '3px solid #e8dfd5'");
    
    if (file.includes('Step3_StoryView.jsx')) {
        content = content.replace(
            '<img src={finalImage} alt="결말 이미지" style={{ width: \'100%\', maxWidth: \'500px\', borderRadius: \'16px\' }} />',
            '<img src={finalImage} alt="결말 이미지" style={{ width: \'100%\', maxWidth: \'500px\', borderRadius: \'16px\' }} onError={(e) => { e.currentTarget.parentElement.style.display = \'none\'; }} />'
        );
    }
    
    fs.writeFileSync(file, content, 'utf8');
}
console.log('Replacement complete.');
