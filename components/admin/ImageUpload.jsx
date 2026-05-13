'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Upload, Link2, Image as ImageIcon, Loader2, X } from 'lucide-react';

export default function ImageUpload({ 
  value = '', 
  onChange, 
  type = 'general', // blogs, projects, case-studies, testimonials, general
  label = 'Image',
  aspectRatio = 'video' // video, square, or custom
}) {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      const uploadedUrl = result.url;
      onChange(uploadedUrl);
      setPreview(uploadedUrl);
      toast.success('Image uploaded successfully');
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    onChange(url);
    setPreview(url);
  };

  const clearImage = () => {
    onChange('');
    setPreview('');
    if (uploadMethod === 'upload') {
      // Reset file input if it exists
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Upload Method Selection */}
      <RadioGroup 
        value={uploadMethod} 
        onValueChange={setUploadMethod}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="url" id="url" />
          <Label htmlFor="url" className="flex items-center gap-2 cursor-pointer">
            <Link2 className="w-4 h-4" />
            URL
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upload" id="upload" />
          <Label htmlFor="upload" className="flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload
          </Label>
        </div>
      </RadioGroup>

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="space-y-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'upload' && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-accent hover:file:bg-primary/90 cursor-pointer disabled:cursor-not-allowed"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <Card className="relative group">
          <CardContent className="pt-6">
            <div className="relative">
              <div className={`rounded-lg overflow-hidden border border-slate-200 bg-slate-50 ${getAspectRatioClass()}`}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-500 truncate">{preview}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!preview && (
        <Card className="border-dashed border-slate-300">
          <CardContent className="pt-6">
            <div className={`rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center ${getAspectRatioClass()}`}>
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  {uploadMethod === 'url' ? 'Enter a URL to preview' : 'Upload an image to preview'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
