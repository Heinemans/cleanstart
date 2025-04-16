'use client';

import { useState } from 'react';
import CommentsBlock from '@/components/formblocks/CommentsBlock';

export default function CommentsPage() {
  const [externalComment, setExternalComment] = useState('');
  const [internalComment, setInternalComment] = useState('');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Opmerkingen Blok</h1>
      <div className="bg-gray-50 p-6 rounded-lg">
        <CommentsBlock 
          externalValue={externalComment}
          internalValue={internalComment}
          onExternalChange={setExternalComment}
          onInternalChange={setInternalComment}
        />
      </div>
    </div>
  );
} 