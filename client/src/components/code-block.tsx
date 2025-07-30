import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Simple syntax highlighting for common patterns
  const highlightCode = (code: string, language: string) => {
    if (language === 'bash' || language === 'curl') {
      return code
        .replace(/(curl|POST|GET|DELETE|PUT)/g, '<span class="text-blue-400 font-semibold">$1</span>')
        .replace(/(-H|--header|-X|-d|--data)/g, '<span class="text-green-400">$1</span>')
        .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
        .replace(/(https?:\/\/[^\s"]+)/g, '<span class="text-purple-400">$1</span>');
    }
    
    if (language === 'json') {
      return code
        .replace(/("[\w-]+"):/g, '<span class="text-blue-400">$1</span>:')
        .replace(/: (".*?")/g, ': <span class="text-yellow-300">$1</span>')
        .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>')
        .replace(/: (true|false|null)/g, ': <span class="text-purple-400">$1</span>');
    }

    if (language === 'javascript' || language === 'js') {
      return code
        .replace(/(const|let|var|function|return|if|else|try|catch)/g, '<span class="text-purple-400 font-semibold">$1</span>')
        .replace(/('.*?'|".*?")/g, '<span class="text-yellow-300">$1</span>')
        .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    }

    return code;
  };

  return (
    <div className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-sm font-medium text-gray-300">{title}</span>
          <span className="text-xs text-gray-500 uppercase">{language}</span>
        </div>
      )}
      
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-700/50"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </Button>
        
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code 
            className="text-gray-300 font-mono"
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(code, language) 
            }}
          />
        </pre>
      </div>
    </div>
  );
}