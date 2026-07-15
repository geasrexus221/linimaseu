import os
import re

src_dir = r"c:\Users\Laxus\Desktop\Project Linimasa\src"

# Define replacement mappings
replacements = [
    # 1. Primary orange to gold
    (re.compile(r'#ff9600', re.IGNORECASE), '#f4c365'),
    
    # 2. Darker primary orange shadow to dark gold
    (re.compile(r'#e68200', re.IGNORECASE), '#d1a54c'),
    (re.compile(r'#C2410C', re.IGNORECASE), '#d1a54c'),
    (re.compile(r'#D17C00', re.IGNORECASE), '#d1a54c'),
    
    # 3. Transparent orange overlays
    (re.compile(r'#FF960033', re.IGNORECASE), '#f4c36533'),
    (re.compile(r'#FF960022', re.IGNORECASE), '#f4c36522'),
    (re.compile(r'#FF960055', re.IGNORECASE), '#f4c36555'),
    (re.compile(r'rgba\(255,\s*150,\s*0,\s*0\.1\)', re.IGNORECASE), 'rgba(244, 195, 101, 0.1)'),
    (re.compile(r'rgba\(255,\s*150,\s*0,\s*0\.2\)', re.IGNORECASE), 'rgba(244, 195, 101, 0.2)'),
]

# Specifically replace shadow color in StudentDashboardScreen.jsx streak active states
student_dashboard_path = os.path.join(src_dir, 'features', 'student', 'screens', 'StudentDashboardScreen.jsx')

modified_files_count = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.js', '.css')):
            file_path = os.path.join(root, file)
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            original_content = content
            
            # Apply replacements
            for pattern, replacement in replacements:
                content = pattern.sub(replacement, content)
                
            # Special case for StudentDashboardScreen today circle border/shadow color
            if file == 'StudentDashboardScreen.jsx':
                content = content.replace('border-color: #D97706', 'border-color: #d1a54c')
                content = content.replace('box-shadow: 0 3px 0 #D97706', 'box-shadow: 0 3px 0 #d1a54c')
                content = content.replace('box-shadow: 0 5px 0 #D97706', 'box-shadow: 0 5px 0 #d1a54c')
                content = content.replace('color: #D97706', 'color: #d1a54c')
                content = content.replace('color: #D97706 !important', 'color: #d1a54c !important')
                content = content.replace('color: isToday ? \'#D97706\' : \'#D97706\'', 'color: isToday ? \'#d1a54c\' : \'#d1a54c\'')
                
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Migrated colors in: {file_path}")
                modified_files_count += 1

print(f"\nDone! Migrated {modified_files_count} files successfully.")
