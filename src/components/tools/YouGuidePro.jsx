import React, { useState, useRef, useEffect } from 'react';

// --- 内联模拟数据 (Mock Data) ---
const MOCK_SENTENCE_FEEDBACK = [
    "发音清晰，但语速稍快，可以尝试在句末增加停顿。",
    "情感饱满，完美契合脚本意图。",
    "结尾处略有吞音，建议重录。",
    "语调非常平稳，适合专业解说场景。"
];

// --- 内联 SVG 图标 ---
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const IconSquare = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const IconMic = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2 h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>;
const IconSpeaker = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><circle cx="12" cy="14" r="4"></circle><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>;
const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>;

export default function YouGuideProDemo() {
    const [fullScript, setFullScript] = useState("大家好！今天我们要聊聊如何利用 AI 加速 YouTube 内容创作。\n\n首先，脚本分段至关重要，它可以帮助我们更好地控制视频节奏。\n\n最后，录音时的情感表达是连接观众的关键。让我们开始演示吧！");
    const [chapters, setChapters] = useState([]);
    const [activeIdx, setActiveIdx] = useState(null);
    const [isSplitting, setIsSplitting] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [loadingMap, setLoadingMap] = useState({});
    const [voiceSettings, setVoiceSettings] = useState({ voiceId: 'Puck', speed: 1.0 });

    // --- 模拟 AI 逻辑 ---

    // 1. 模拟脚本分段
    const handleSplit = () => {
        setIsSplitting(true);
        setTimeout(() => {
            const parts = fullScript.split('\n\n');
            const mockChapters = parts.map((text, i) => ({
                title: `章节 ${i + 1}`,
                content: text,
                sentenceItems: text.split(/[。！？]/).filter(s => s.trim()).map((s, idx) => ({
                    text: s,
                    globalIdx: idx + 1
                })),
                takes: []
            }));
            setChapters(mockChapters);
            setActiveIdx(0);
            setIsSplitting(false);
        }, 1500);
    };

    // 2. 模拟音频生成 (TTS)
    const handleTTS = (key) => {
        setLoadingMap(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
            setLoadingMap(prev => ({ ...prev, [key]: false }));
            alert("演示模式：已模拟生成 AI 参考音轨。");
        }, 1000);
    };

    // 3. 模拟录音与 AI 分析
    const startRecording = () => setIsRecording(true);
    const stopRecording = () => {
        setIsRecording(false);
        const takeId = Date.now();
        // 模拟录音分析
        setChapters(prev => {
            const updated = [...prev];
            const newTake = {
                id: takeId,
                isAnalyzing: true,
                analysis: null
            };
            updated[activeIdx].takes.unshift(newTake);
            updated[activeIdx].bestTakeId = takeId;
            return updated;
        });

        setTimeout(() => {
            setChapters(prev => {
                const updated = [...prev];
                const chapter = updated[activeIdx];
                const take = chapter.takes.find(t => t.id === takeId);
                if (take) {
                    take.isAnalyzing = false;
                    take.analysis = {
                        sentence_analysis: chapter.sentenceItems.map((_, i) => ({
                            index: i,
                            score: Math.floor(Math.random() * 20) + 80,
                            feedback: MOCK_SENTENCE_FEEDBACK[Math.floor(Math.random() * MOCK_SENTENCE_FEEDBACK.length)],
                            transcription: chapter.sentenceItems[i].text
                        }))
                    };
                }
                return updated;
            });
        }, 2000);
    };

    const resetDemo = () => {
        setChapters([]);
        setActiveIdx(null);
    };

    return (
        <div className="bg-slate-50 text-slate-900 p-4 md:p-8 font-sans rounded-3xl border border-slate-200 shadow-inner overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600 p-2 rounded-lg text-white"><IconPlay /></div>
                        <h1 className="text-lg font-black tracking-tighter">YOUGUIDE <span className="text-red-600">DEMO</span></h1>
                    </div>
                    {chapters.length > 0 && (
                        <button onClick={resetDemo} className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest">重置演示</button>
                    )}
                </header>

                {chapters.length === 0 ? (
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-slate-400"><IconFileText /> <span>输入视频脚本</span></div>
                        <textarea
                            value={fullScript}
                            onChange={(e) => setFullScript(e.target.value)}
                            className="w-full h-40 p-5 bg-slate-50 border-none rounded-2xl outline-none mb-6 leading-relaxed text-sm focus:ring-2 ring-red-100 transition-all"
                        />
                        <button
                            onClick={handleSplit}
                            disabled={isSplitting}
                            className={`w-full text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${isSplitting ? 'bg-slate-400' : 'bg-slate-900 hover:scale-[1.02]'}`}
                        >
                            {isSplitting ? <IconRefresh /> : <IconPlay />}
                            {isSplitting ? "AI 正在分析结构..." : "开始制作演示"}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">章节</h2>
                                <div className="space-y-2">
                                    {chapters.map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIdx(i)}
                                            className={`w-full text-left p-3 rounded-xl text-xs font-bold border transition-all ${activeIdx === i ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-transparent text-slate-500 hover:bg-slate-50"}`}
                                        >
                                            {i + 1}. {c.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-6">
                            {activeIdx !== null && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">当前章节</p>
                                                <h2 className="text-xl font-bold">{chapters[activeIdx].title}</h2>
                                            </div>
                                            <button
                                                onClick={isRecording ? stopRecording : startRecording}
                                                className={`h-12 px-6 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${isRecording ? "bg-red-600 text-white animate-pulse" : "bg-slate-900 text-white hover:bg-black"}`}
                                            >
                                                {isRecording ? <IconSquare /> : <IconMic />} {isRecording ? "停止录音" : "模拟录制本章"}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {chapters[activeIdx].sentenceItems.map((sent, sIdx) => {
                                                const take = chapters[activeIdx].takes[0];
                                                const analysis = take?.analysis?.sentence_analysis[sIdx];

                                                return (
                                                    <div key={sIdx} className="group bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                                                        <div className="flex justify-between gap-4 mb-3">
                                                            <p className="text-sm font-medium text-slate-800 leading-relaxed">{sent.text}</p>
                                                            <button
                                                                onClick={() => handleTTS(`s-${activeIdx}-${sIdx}`)}
                                                                className="shrink-0 p-2 text-slate-400 hover:text-red-600 transition-colors"
                                                            >
                                                                {loadingMap[`s-${activeIdx}-${sIdx}`] ? <IconRefresh /> : <IconSpeaker />}
                                                            </button>
                                                        </div>

                                                        {take?.isAnalyzing && (
                                                            <div className="text-[10px] text-slate-400 italic flex items-center gap-2"><IconRefresh /> AI 正在分析语调...</div>
                                                        )}

                                                        {analysis && (
                                                            <div className="pt-3 border-t border-slate-200/50 mt-2 space-y-2">
                                                                <div className="flex items-center justify-between">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${analysis.score > 90 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    得分: {analysis.score}
                                  </span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 italic">“{analysis.feedback}”</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-800 p-2 rounded-lg text-red-500"><IconBox /></div>
                                            <div>
                                                <p className="text-xs font-bold">制作完成？</p>
                                                <p className="text-[10px] text-slate-400">一键导出字幕与音频发布包</p>
                                            </div>
                                        </div>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-colors">
                                            导出全片发布包
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}