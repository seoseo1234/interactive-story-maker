import sys

file_path = 'c:/Users/user/Documents/seostudio/2026.7.2 인터렉티브 스토리 제작소/src/components/Library.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        '''          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>''',
        '''          <div style={{ background: '#fffdf5', border: '3px solid #fce8b2', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>'''
    ),
    (
        '''        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '2rem 3rem', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>''',
        '''        <div style={{ background: 'rgba(255, 253, 245, 0.9)', border: '3px solid #fce8b2', padding: '2rem 3rem', borderRadius: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>'''
    ),
    (
        '''        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.8)', borderRadius: '24px' }}>''',
        '''        <div style={{ textAlign: 'center', padding: '5rem', background: '#fffdf5', border: '3px solid #fce8b2', borderRadius: '24px' }}>'''
    ),
    (
        '''        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.9)', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>''',
        '''        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fffdf5', border: '3px solid #fce8b2', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>'''
    ),
    (
        '''                background: 'white', \n                boxShadow: '0 10px 20px rgba(0,0,0,0.06)',''',
        '''                background: '#fffdf5', \n                border: '2px solid #fce8b2',\n                boxShadow: '0 10px 20px rgba(0,0,0,0.06)','''
    )
]

for old, new in replacements:
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced successfully')
