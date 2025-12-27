import React, { useState, useRef, useEffect } from 'react';
import {
    Volume2, Loader2, Mic, Square, Terminal,
    History, Award, ChevronDown, ChevronUp,
    Globe, MessageSquare, Gauge, FolderArchive, FileText, TrendingUp
} from 'lucide-react';

const MOCK_FEEDBACK = `
| 項目 | 評価 | 改善のアドバイス |
| :--- | :--- | :--- |
| **発音** | A | 「こんにちは」の「は」の発音が少し強いです。 |
| **リズム** | S | 完璧なポーズ（間）の取り方です。 |
| **抑揚** | B | 語尾を下げる傾向を意識しましょう。 |

**Coach's Note:** 非常に自然な流れです。母音の長さをもう少し意識すると、よりネイティブに近づきます。

Rating: [A]
`;

export default function ReadingMock() {
    const [uiLang, setUiLang] = useState("Japanese");
    const [lines, setLines] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingId, setRecordingId] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(null);
    const [practiceHistory, setPracticeHistory] = useState({});
    const [expandedRecords, setExpandedRecords] = useState({});
    const [logs, setLogs] = useState([{ timestamp: new Date().toLocaleTimeString(), message: "System Ready", type: 'success' }]);

    const addLog = (message, type = 'info') => {
        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }].slice(-5));
    };

    // 模拟脚本解析
    const handleProcessScript = () => {
        setIsProcessing(true);
        addLog("Analyzing SRT script structure...", "info");
        setTimeout(() => {
            setLines([
                { id: "1", duration: 3.2, text: "こんにちは、いつきです！", status: 'done' },
                { id: "2", duration: 2.8, text: "今日のテーマは、ズバリこれ。", status: 'done' },
                { id: "3", duration: 2.2, text: "「なぜ、中国人の僕が」", status: 'done' }
            ]);
            setIsProcessing(false);
            addLog("Success: 3 lines processed.", "success");
        }, 1000);
    };

    // 模拟录音与评价
    const handleRecord = (lineId) => {
        setRecordingId(lineId);
        addLog(`Recording session started for Line #${lineId}`, "info");
        setTimeout(() => {
            setRecordingId(null);
            setIsEvaluating(lineId);
            addLog("AI is evaluating your pronunciation...", "info");

            setTimeout(() => {
                const newEntry = {
                    rating: 'A',
                    feedback: MOCK_FEEDBACK,
                    timestamp: new Date().toISOString()
                };
                setPracticeHistory(prev => ({
                    ...prev,
                    [lineId]: [newEntry, ...(prev[lineId] || [])]
                }));
                setExpandedRecords({ [`${lineId}-0`]: true });
                setIsEvaluating(null);
                addLog(`Analysis complete. Rating: A`, "success");
            }, 2000);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-[700px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm text-slate-900">
            {/* Header Settings */}
            <header className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg"><TrendingUp size={18}/></div>
                    <span className="font-bold text-sm hidden sm:inline">Speech Coach PRO</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-[10px] font-bold">
                        <Globe size={12} className="text-slate-400"/>
                        <span>日本語</span>
                    </div>
                    <button onClick={handleProcessScript} className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center gap-2">
                        {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12}/>}
                        LOAD SCRIPT
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {lines.length > 0 ? (
                    lines.map((line) => (
                        <div key={line.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded uppercase">Line #{line.id}</span>
                                        <span className="text-[9px] text-slate-400 font-bold">{line.duration}s</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-800">{line.text}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-md"><Volume2 size={20}/></button>
                                    <div className="h-6 w-px bg-slate-200"></div>
                                    {recordingId === line.id ? (
                                        <button onClick={() => setRecordingId(null)} className="p-3 bg-red-500 text-white rounded-xl animate-pulse"><Square size={20} fill="currentColor"/></button>
                                    ) : (
                                        <button onClick={() => handleRecord(line.id)} className="p-3 bg-emerald-500 text-white rounded-xl"><Mic size={20}/></button>
                                    )}
                                </div>
                            </div>

                            {/* Evaluation History Mock */}
                            {(practiceHistory[line.id] || isEvaluating === line.id) && (
                                <div className="mt-6 pt-4 border-t border-slate-50 space-y-4">
                                    {isEvaluating === line.id && (
                                        <div className="flex items-center justify-center p-8 bg-indigo-50/50 rounded-2xl animate-pulse gap-3">
                                            <Loader2 size={18} className="animate-spin text-indigo-600" />
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI Analyzing...</span>
                                        </div>
                                    )}
                                    {practiceHistory[line.id]?.map((record, idx) => (
                                        <div key={idx} className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                                            <div className="p-4 flex justify-between items-center cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                                        <Award size={12}/> Rating: {record.rating}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-bold">Just Now</span>
                                                </div>
                                                <ChevronDown size={16} className="text-slate-300" />
                                            </div>
                                            <div className="p-6 pt-0 text-[13px] leading-relaxed prose prose-sm prose-indigo whitespace-pre-wrap">
                                                {record.feedback}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center">
                        <FolderArchive size={64} className="opacity-10 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest opacity-40">Please Load Script to Start</p>
                    </div>
                )}
            </div>

            {/* Bottom Log Bar */}
            <footer className="bg-slate-900 p-2.5 flex items-center justify-between text-[10px] font-mono text-indigo-300">
                <div className="flex items-center gap-4 truncate">
                    <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                        <Terminal size={12} className="text-indigo-500" />
                        <span className="font-bold">SYSTEM_LOG</span>
                    </div>
                    <span className="truncate opacity-80 uppercase">{logs[logs.length-1]?.message}</span>
                </div>
                <span className="text-white/20">v2.5.0-mock</span>
            </footer>
        </div>
    );
}