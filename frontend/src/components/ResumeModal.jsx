import { useState, useEffect, useRef } from 'react';
import { X, Download, Copy, Loader2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateResume } from '../api';

export default function ResumeModal({ resumeData, job, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [copied, setCopied] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      setLoading(true);
      setError(null);
      try {
        const data = await generateResume(
          resumeData,
          job.description || '',
          job.title || ''
        );
        if (!cancelled) {
          setGeneratedResume(data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            'Failed to generate resume.';
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    generate();
    return () => {
      cancelled = true;
    };
  }, [resumeData, job]);

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `resume-${(job.company || 'tailored').replace(/\s+/g, '-').toLowerCase()}.pdf`
      );
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch {
      toast.error('Failed to generate PDF.', { id: 'pdf' });
    }
  };

  const handleCopy = () => {
    if (!resumeRef.current) return;
    const text = resumeRef.current.innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const r = generatedResume?.tailored_resume || generatedResume || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row overflow-hidden relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Left: Resume preview */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-gray-600 font-medium">
                Generating tailored resume...
              </p>
              <p className="text-sm text-gray-400">
                AI is customizing your resume for{' '}
                <span className="font-semibold">{job.title}</span> at{' '}
                <span className="font-semibold">{job.company}</span>
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium">Generation failed</p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                {error}
              </p>
            </div>
          ) : (
            <div ref={resumeRef} className="max-w-[700px] mx-auto">
              {/* Name & Contact */}
              <div className="border-b-2 border-gray-800 pb-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {r.name || resumeData.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                  {(r.email || resumeData.email) && (
                    <span>{r.email || resumeData.email}</span>
                  )}
                  {(r.phone || resumeData.phone) && (
                    <span>{r.phone || resumeData.phone}</span>
                  )}
                  {(r.location || resumeData.location) && (
                    <span>{r.location || resumeData.location}</span>
                  )}
                  {(r.linkedin || resumeData.linkedin) && (
                    <span>{r.linkedin || resumeData.linkedin}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {(r.summary || r.professional_summary) && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {r.summary || r.professional_summary}
                  </p>
                </section>
              )}

              {/* Skills */}
              {(r.skills || resumeData.skills) && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {(r.skills || resumeData.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {typeof skill === 'string' ? skill : skill.name || skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {(r.experience || r.work_experience || []).length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                    Experience
                  </h2>
                  <div className="space-y-3">
                    {(r.experience || r.work_experience || []).map((exp, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {exp.title || exp.role || exp.position}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {exp.company || exp.organization}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0 ml-4">
                            {exp.duration || exp.dates || exp.period || ''}
                          </span>
                        </div>
                        {exp.bullets || exp.highlights || exp.description ? (
                          <ul className="list-disc list-inside mt-1 space-y-0.5">
                            {(
                              exp.bullets ||
                              exp.highlights ||
                              (typeof exp.description === 'string'
                                ? exp.description.split('\n').filter(Boolean)
                                : Array.isArray(exp.description)
                                  ? exp.description
                                  : [])
                            ).map((bullet, j) => (
                              <li
                                key={j}
                                className="text-xs text-gray-700 leading-relaxed"
                              >
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {(r.education || []).length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {(r.education || []).map((edu, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {edu.degree || edu.qualification}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {edu.institution || edu.school || edu.university}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0 ml-4">
                          {edu.year || edu.dates || edu.graduation_date || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {(r.certifications || []).length > 0 && (
                <section className="mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside space-y-0.5">
                    {(r.certifications || []).map((cert, i) => (
                      <li key={i} className="text-xs text-gray-700">
                        {typeof cert === 'string' ? cert : cert.name || cert}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-64 p-5 flex flex-row lg:flex-col gap-3 bg-gray-50 shrink-0">
          <div className="mb-0 lg:mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Tailored for
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {job.title} at {job.company}
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={loading || !!error}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </button>

          <button
            onClick={handleCopy}
            disabled={loading || !!error}
            className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
