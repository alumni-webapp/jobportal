import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResume } from '../api';

export default function ResumeUpload({ onResumeParsed }) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setUploading(true);

      try {
        const data = await uploadResume(file);
        toast.success('Resume parsed successfully!');
        onResumeParsed(data, file.name);
      } catch (err) {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to upload resume. Please try again.';
        toast.error(msg);
      } finally {
        setUploading(false);
      }
    },
    [onResumeParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            JobMatch AI
          </h1>
          <p className="text-gray-500 text-lg">
            Upload your resume to find AI-matched job opportunities
          </p>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
            }
            ${uploading ? 'pointer-events-none opacity-70' : ''}
            shadow-sm hover:shadow-md
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">
                Parsing your resume...
              </p>
              <p className="text-sm text-gray-400">
                This may take a few seconds
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-indigo-500" />
              </div>
              {isDragActive ? (
                <p className="text-lg font-medium text-indigo-600">
                  Drop your resume here...
                </p>
              ) : (
                <>
                  <p className="text-lg font-medium text-gray-700">
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse files
                  </p>
                </>
              )}
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                  PDF
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  DOCX
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your resume data is processed securely and never stored permanently.
        </p>
      </div>
    </div>
  );
}
