'use client';

import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, FileText } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your essay here...",
  label = "Essay Content",
  className = ""
}: MarkdownEditorProps) {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex space-x-2">
          <Button
            variant={previewMode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('edit')}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={previewMode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={previewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('split')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Split
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            preview={previewMode}
            placeholder={placeholder}
            height={400}
            className="border-0"
            data-color-mode="auto"
          />
        </CardContent>
      </Card>
    </div>
  );
} 