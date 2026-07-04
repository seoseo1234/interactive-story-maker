import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

export default function MarkdownModal({ title, content, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="animate-fade-in" onClick={(e) => e.stopPropagation()} style={{
        background: '#faf8f5', border: '3px solid #e8dfd5', borderRadius: '24px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.5rem 2rem', borderBottom: '1px solid #eaeaea'
        }}>
          <h2 className="heading-font" style={{ margin: 0, fontSize: '1.8rem', color: '#333' }}>{title}</h2>
          <button className="btn" onClick={onClose} style={{ padding: '0.5rem', background: '#f8f9fa' }}>
            <X size={24} color="#666" />
          </button>
        </div>
        <div style={{
          padding: '2rem', overflowY: 'auto', flex: 1, lineHeight: 1.6, color: '#444'
        }}>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 style={{fontSize: '1.8rem', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1.5rem'}} {...props} />,
              h3: ({node, ...props}) => <h3 style={{fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: 'var(--primary-color)'}} {...props} />,
              p: ({node, ...props}) => <p style={{marginBottom: '1rem', fontSize: '1rem'}} {...props} />,
              ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}} {...props} />,
              li: ({node, ...props}) => <li style={{marginBottom: '0.5rem'}} {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
