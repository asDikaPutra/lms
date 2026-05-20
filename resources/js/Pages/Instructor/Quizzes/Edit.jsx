import { Head, Link, router, useForm } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

function Button({ children, className = '', variant = 'primary', size = 'md', ...props }) {
    const base = 'inline-flex items-center justify-center rounded-[6px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-sb-green text-white hover:bg-sb-green/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        outline: 'border border-[#edebe9] bg-white text-sb-text-black hover:bg-[#f9f9f9] shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
        ghost: 'bg-transparent text-sb-text-black hover:bg-[#f9f9f9]',
    };
    const sizes = {
        sm: 'h-[32px] px-3 text-[12px]',
        md: 'h-[40px] px-4 text-[14px]',
    };

    return (
        <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default function EditQuiz({ quiz, course_id }) {
    const questions = quiz.questions || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const isAddingNew = currentIndex === questions.length;

    const currentQuestion = isAddingNew ? null : questions[currentIndex];

    const form = useForm({
        question: '',
        type: 'multiple_choice',
        points: 10,
        options_text: '',
        correct_answer: '',
    });

    const [options, setOptions] = useState(['', '', '', '']);

    // Populate form when changing question
    useEffect(() => {
        if (currentQuestion) {
            form.setData({
                question: currentQuestion.question,
                type: currentQuestion.type,
                points: currentQuestion.points,
                options_text: currentQuestion.options_text || '',
                correct_answer: currentQuestion.correct_answer || '',
            });
            if (currentQuestion.type === 'multiple_choice') {
                const parsedOptions = currentQuestion.options_text ? currentQuestion.options_text.split('\n') : ['', '', '', ''];
                setOptions(parsedOptions.length > 0 ? parsedOptions : ['', '', '', '']);
            }
            form.clearErrors();
        } else {
            // New Question
            form.setData({
                question: '',
                type: 'multiple_choice',
                points: 10,
                options_text: '',
                correct_answer: '',
            });
            setOptions(['', '', '', '']);
            form.clearErrors();
        }
    }, [currentIndex, quiz.questions]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
        form.setData('options_text', newOptions.join('\n'));
        
        // If the edited option was the correct answer, update the correct answer too
        if (options[index].trim() === form.data.correct_answer && value.trim() !== '') {
            form.setData(data => ({ ...data, correct_answer: value.trim(), options_text: newOptions.join('\n') }));
        }
    };

    const addOption = () => {
        const newOptions = [...options, ''];
        setOptions(newOptions);
        form.setData('options_text', newOptions.join('\n'));
    };

    const removeOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        form.setData('options_text', newOptions.join('\n'));
        
        if (options[index].trim() === form.data.correct_answer) {
            form.setData(data => ({ ...data, correct_answer: '', options_text: newOptions.join('\n') }));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isAddingNew) {
            form.post(`/instructor/quizzes/${quiz.id}/questions`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCurrentIndex(questions.length); // Stay on the new question (which is now added, so index shifts) or move to the newly created. Actually, if we add, questions.length increases.
                }
            });
        } else {
            form.put(`/instructor/quiz-questions/${currentQuestion.id}`, {
                preserveScroll: true,
            });
        }
    };

    const deleteQuestion = () => {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            router.delete(`/instructor/quiz-questions/${currentQuestion.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
                }
            });
        }
    };

    return (
        <InstructorLayout title={`Builder Soal: ${quiz.title}`}>
            <Head title={`Builder Soal - ${quiz.title}`} />

            <div className="w-full tracking-[-0.01em]">
                <div className="mb-6">
                    <Link href={`/instructor/courses/${course_id}/quizzes`} className="text-[13px] font-semibold text-sb-accent hover:text-sb-green transition-colors inline-flex items-center">
                        <ArrowLeft className="mr-1.5 size-4" /> Kembali ke Daftar Kuis
                    </Link>
                    <h2 className="mt-2 text-[24px] font-semibold text-sb-text-black leading-tight tracking-[-0.16px]">Builder Soal: {quiz.title}</h2>
                    <p className="mt-1 text-[13px] text-sb-text-soft">
                        Buat dan kelola pertanyaan untuk kuis ini. Tampilan editor dibuat mirip dengan tampilan siswa saat mengerjakan kuis.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Pagination Sidebar */}
                    <div className="w-full md:w-[240px] shrink-0">
                        <div className="bg-white rounded-[10px] p-4 shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                            <h3 className="text-[14px] font-semibold text-sb-text-black mb-3">Navigasi Soal</h3>
                            <div className="flex flex-wrap gap-2">
                                {questions.map((q, idx) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`size-9 rounded-[6px] text-[13px] font-semibold transition-colors flex items-center justify-center border ${
                                            currentIndex === idx 
                                            ? 'bg-sb-green border-sb-green text-white' 
                                            : 'bg-white border-[#edebe9] text-sb-text-black hover:bg-[#f9f9f9]'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentIndex(questions.length)}
                                    title="Tambah Soal Baru"
                                    className={`size-9 rounded-[6px] text-[13px] font-semibold transition-colors flex items-center justify-center border border-dashed ${
                                        isAddingNew 
                                        ? 'bg-sb-light border-sb-green text-sb-green' 
                                        : 'bg-[#f9f9f9] border-[#d6dbde] text-sb-text-soft hover:text-sb-text-black'
                                    }`}
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Question Editor */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[10px] shadow-[0_0_0.5px_rgba(0,0,0,0.14),_0_1px_1px_rgba(0,0,0,0.24)]">
                            <div className="border-b border-[#edebe9] px-6 py-4 flex items-center justify-between">
                                <h3 className="text-[16px] font-semibold text-sb-text-black">
                                    {isAddingNew ? 'Buat Soal Baru' : `Soal Nomor ${currentIndex + 1}`}
                                </h3>
                                {!isAddingNew && (
                                    <Button type="button" variant="ghost" size="sm" className="h-[28px] px-2 text-[12px] text-red-600 hover:bg-red-50 hover:text-red-700" onClick={deleteQuestion}>
                                        <Trash2 className="mr-1.5 size-3.5" /> Hapus Soal
                                    </Button>
                                )}
                            </div>

                            <div className="p-6">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-[13px] font-semibold text-sb-text-black mb-1.5 block">Tipe Soal</label>
                                            <select 
                                                value={form.data.type} 
                                                onChange={e => form.setData('type', e.target.value)}
                                                className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[14px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                            >
                                                <option value="multiple_choice">Pilihan Ganda</option>
                                                <option value="true_false">Benar / Salah</option>
                                                <option value="essay">Essay</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[13px] font-semibold text-sb-text-black mb-1.5 block">Bobot Poin</label>
                                            <input 
                                                type="number" 
                                                min="1" max="100"
                                                value={form.data.points} 
                                                onChange={e => form.setData('points', e.target.value)}
                                                className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[14px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[13px] font-semibold text-sb-text-black mb-1.5 block">Pertanyaan</label>
                                        <textarea 
                                            rows="4" 
                                            value={form.data.question} 
                                            onChange={e => form.setData('question', e.target.value)}
                                            placeholder="Tulis pertanyaan di sini..."
                                            className="w-full rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[14px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                        />
                                        {form.errors.question && <p className="mt-1.5 text-[12px] text-red-600">{form.errors.question}</p>}
                                    </div>

                                    {form.data.type === 'multiple_choice' && (
                                        <div className="bg-[#f9f9f9] p-5 rounded-[8px] border border-[#edebe9]">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <label className="text-[13px] font-semibold text-sb-text-black block">Pilihan Jawaban</label>
                                                    <p className="text-[12px] text-sb-text-soft mt-0.5">Berikan pilihan ganda untuk soal ini.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {options.map((opt, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[6px] bg-white border border-[#d6dbde] font-semibold text-sb-text-soft text-[13px]">
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                        <input 
                                                            type="text" 
                                                            value={opt} 
                                                            onChange={e => handleOptionChange(i, e.target.value)}
                                                            placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                                                            className="flex-1 rounded-[6px] border border-[#d6dbde] px-3 py-2 text-[14px] text-sb-text-black outline-none focus:border-sb-accent focus:ring-1 focus:ring-sb-accent"
                                                        />
                                                        {options.length > 2 && (
                                                            <button type="button" onClick={() => removeOption(i)} className="p-2 text-sb-text-soft hover:text-red-600 transition-colors" title="Hapus Pilihan">
                                                                <Trash2 className="size-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button type="button" onClick={addOption} className="text-[12px] font-semibold text-sb-green hover:text-sb-green/80 transition-colors flex items-center mt-2">
                                                    <Plus className="mr-1 size-3.5" /> Tambah Pilihan Lain
                                                </button>
                                            </div>
                                            {form.errors.options_text && <p className="mt-2 text-[12px] text-red-600">{form.errors.options_text}</p>}
                                        </div>
                                    )}

                                    {form.data.type !== 'essay' && (
                                        <div>
                                            <label className="text-[13px] font-semibold text-sb-text-black mb-1.5 block">Kunci Jawaban Benar</label>
                                            {form.data.type === 'multiple_choice' ? (
                                                <select 
                                                    value={form.data.correct_answer} 
                                                    onChange={e => form.setData('correct_answer', e.target.value)}
                                                    className="w-full rounded-[6px] border border-sb-green/30 bg-sb-light/30 px-3 py-2 text-[14px] font-medium text-sb-green outline-none focus:border-sb-green focus:ring-1 focus:ring-sb-green"
                                                >
                                                    <option value="" disabled>-- Pilih Kunci Jawaban --</option>
                                                    {options.map((opt, i) => opt.trim() !== '' && (
                                                        <option key={i} value={opt.trim()}>
                                                            {String.fromCharCode(65 + i)}. {opt.trim()}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <select 
                                                    value={form.data.correct_answer} 
                                                    onChange={e => form.setData('correct_answer', e.target.value)}
                                                    className="w-full rounded-[6px] border border-sb-green/30 bg-sb-light/30 px-3 py-2 text-[14px] font-medium text-sb-green outline-none focus:border-sb-green focus:ring-1 focus:ring-sb-green"
                                                >
                                                    <option value="" disabled>-- Pilih Kunci Jawaban --</option>
                                                    <option value="true">Benar (True)</option>
                                                    <option value="false">Salah (False)</option>
                                                </select>
                                            )}
                                            {form.errors.correct_answer && <p className="mt-1.5 text-[12px] text-red-600">{form.errors.correct_answer}</p>}
                                        </div>
                                    )}

                                    <div className="border-t border-[#edebe9] pt-5 flex justify-end">
                                        <Button type="submit" disabled={form.processing} className="px-8">
                                            <CheckCircle2 className="mr-1.5 size-4" /> {isAddingNew ? 'Simpan Soal Baru' : 'Perbarui Soal'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}
