import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: string;
  onChange?: (_file: File) => void;
  // legacy prop name used elsewhere in repo
  onFileSelect?: (_file: File) => void;
  label?: string;
}

export function FileUpload({ accept = 'image/*', maxSize = '2MB', onChange, onFileSelect, label }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0];
    if (_file) {
      if (onChange) onChange(_file);
      if (onFileSelect) onFileSelect(_file);
    }
  };

  return (
    <label className="block border-2 border-dashed border-[#D9E4EC] rounded-xl p-8 text-center bg-[#F5F7FA] hover:bg-white hover:border-[#0D4C92] transition-all cursor-pointer group">
      <Upload className="h-12 w-12 text-[#0B3F78]/40 group-hover:text-[#0D4C92] mx-auto mb-3 transition-colors" />
      <p className="text-[#0B3F78] mb-1 group-hover:text-[#0D4C92] transition-colors">
        {label ?? 'Click to upload or drag and drop'}
      </p>
      <p className="text-[#0B3F78]/60">
        {accept.includes('image') ? 'PNG, JPG or WEBP' : 'Supported files'} (max. {maxSize})
      </p>
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />
    </label>
  );
}
