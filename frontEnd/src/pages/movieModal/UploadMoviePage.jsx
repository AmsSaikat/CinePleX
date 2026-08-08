import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Upload, Film, Image as ImageIcon, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadMoviePage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        genre: 'Action',
        releaseYear: new Date().getFullYear(),
        duration: '',
    });

    const [videoFile, setVideoFile] = useState(null);
    const [thumbImg, setThumbImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);

    const thumbInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Memory Leak Cleanup on Unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Input Change Handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Thumbnail Select Handler with Revoke Cleanup
    const handleThumbChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors((prev) => ({ ...prev, thumbnail: 'INVALID IMAGE FILE' }));
            return;
        }

        // Clean up previous ObjectURL reference to prevent memory leaks
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setThumbImg(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, thumbnail: null }));
    };

    // Remove Thumbnail Handler
    const handleRemoveThumb = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setThumbImg(null);
        setPreviewUrl(null);
        if (thumbInputRef.current) thumbInputRef.current.value = '';
    };

    // Video Selection with Strict Validation
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['video/mp4', 'video/x-matroska', 'video/mkv'];
        const isValidExtension = /\.(mp4|mkv)$/i.test(file.name);

        if (!validTypes.includes(file.type) && !isValidExtension) {
            setErrors((prev) => ({
                ...prev,
                video: 'INVALID FORMAT: ONLY .MP4 AND .MKV ACCEPTED',
            }));
            setVideoFile(null);
            if (videoInputRef.current) videoInputRef.current.value = '';
            return;
        }

        setVideoFile(file);
        setErrors((prev) => ({ ...prev, video: null }));
    };

    // Remove Video Handler
    const handleRemoveVideo = () => {
        setVideoFile(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // Form Validation
    const validateForm = () => {
        const err = {};
        if (!form.title.trim()) err.title = 'IDENTIFIER REQUIRED';
        if (!form.description.trim()) err.description = 'MANIFEST DATA REQUIRED';
        if (!form.duration.trim()) err.duration = 'DURATION REQUIRED';
        
        if (!videoFile) {
            err.video = 'VIDEO PAYLOAD REQUIRED (.MP4 / .MKV)';
        }

        if (!thumbImg) {
            err.thumbnail = 'COVER ARTWORK REQUIRED';
        }

        return err;
    };

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setStatusMessage(null);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('genre', form.genre);
        formData.append('releaseYear', form.releaseYear);
        formData.append('duration', form.duration);
        formData.append('video', videoFile);
        formData.append('thumbnail', thumbImg);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}movie/upload-movie`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percent);
                    },
                }
            );

            if (response.data.success) {
                setStatusMessage({ type: 'success', text: 'PAYLOAD DEPLOYED SUCCESSFULLY' });
                // Reset form state
                setForm({
                    title: '',
                    description: '',
                    genre: 'Action',
                    releaseYear: new Date().getFullYear(),
                    duration: '',
                });
                handleRemoveThumb();
                handleRemoveVideo();
            }
        } catch (err) {
            setStatusMessage({
                type: 'error',
                text: err.response?.data?.message || 'TRANSMISSION FAILED: SYSTEM ERROR',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 flex justify-center items-center font-mono">
            <div className="w-full max-w-4xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md rounded-xl p-8 shadow-2xl">
                
                {/* Header */}
                <div className="border-b border-zinc-800 pb-6 mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                            <Upload className="w-6 h-6 text-cyan-400" />
                            Media Ingestion Protocol
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">SYSTEM STATUS: READY FOR PAYLOAD TRANSMISSION</p>
                    </div>
                </div>

                {/* Status Message Display */}
                {statusMessage && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 border ${
                            statusMessage.type === 'success'
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                                : 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                        }`}
                    >
                        {statusMessage.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="text-sm tracking-wide">{statusMessage.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Title / Identifier</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleInputChange}
                                disabled={isUploading}
                                placeholder="ENTER MOVIE TITLE"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            />
                            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Genre Classification</label>
                            <select
                                name="genre"
                                value={form.genre}
                                onChange={handleInputChange}
                                disabled={isUploading}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <option value="Action">Action</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Drama">Drama</option>
                                <option value="Cyberpunk">Cyberpunk</option>
                                <option value="Documentary">Documentary</option>
                            </select>
                        </div>

                        {/* Release Year */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Release Cycle Year</label>
                            <input
                                type="number"
                                name="releaseYear"
                                value={form.releaseYear}
                                onChange={handleInputChange}
                                disabled={isUploading}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Duration (e.g. 124 min)</label>
                            <input
                                type="text"
                                name="duration"
                                value={form.duration}
                                onChange={handleInputChange}
                                disabled={isUploading}
                                placeholder="120 MIN"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            />
                            {errors.duration && <p className="text-xs text-rose-500 mt-1">{errors.duration}</p>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs uppercase text-zinc-400 mb-2">Synopsis / Manifest</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={form.description}
                            onChange={handleInputChange}
                            disabled={isUploading}
                            placeholder="BRIEF OVERVIEW OF THE MEDIA CONTENT..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
                        />
                        {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                    </div>

                    {/* Media Upload Drops Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Thumbnail Drop Zone */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Cover Artwork (Image)</label>
                            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 bg-zinc-950/50 flex flex-col items-center justify-center relative min-h-[160px]">
                                {previewUrl ? (
                                    <div className="relative w-full h-36">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border border-zinc-800"
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveThumb}
                                                className="absolute top-2 right-2 bg-zinc-900/80 hover:bg-rose-600 text-zinc-200 p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer flex flex-col items-center justify-center w-full h-full ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                                        <span className="text-xs text-zinc-400">CLICK TO UPLOAD ARTWORK</span>
                                        <input
                                            ref={thumbInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbChange}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.thumbnail && <p className="text-xs text-rose-500 mt-1">{errors.thumbnail}</p>}
                        </div>

                        {/* Video Drop Zone */}
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-2">Video Stream (.MP4 / .MKV)</label>
                            <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 bg-zinc-950/50 flex flex-col items-center justify-center relative min-h-[160px]">
                                {videoFile ? (
                                    <div className="flex flex-col items-center justify-center w-full p-4 bg-zinc-900 rounded-lg border border-zinc-800 relative">
                                        <Film className="w-8 h-8 text-cyan-400 mb-2" />
                                        <p className="text-xs text-zinc-200 truncate max-w-[200px]">{videoFile.name}</p>
                                        <span className="text-[10px] text-zinc-500 mt-1">
                                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="absolute top-2 right-2 bg-zinc-800 hover:bg-rose-600 text-zinc-200 p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer flex flex-col items-center justify-center w-full h-full ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
                                        <Film className="w-8 h-8 text-zinc-600 mb-2" />
                                        <span className="text-xs text-zinc-400">SELECT MOVIE PAYLOAD</span>
                                        <span className="text-[10px] text-zinc-600 mt-1">MAX RESTRICTION ACCORDING TO B2</span>
                                        <input
                                            ref={videoInputRef}
                                            type="file"
                                            accept="video/mp4,video/x-matroska,.mp4,.mkv"
                                            onChange={handleVideoChange}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.video && <p className="text-xs text-rose-500 mt-1">{errors.video}</p>}
                        </div>

                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span className="flex items-center gap-1.5">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                                    UPLOADING PAYLOAD...
                                </span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                                <div
                                    className="bg-cyan-500 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold py-3 rounded-lg text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                INGESTING MEDIA...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                DISPATCH PAYLOAD
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}