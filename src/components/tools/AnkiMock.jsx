import React, { useState, useMemo } from 'react';
import {
    Volume2, Loader2, Plus, Trash2, Zap, Settings2,
    Library, Keyboard, CheckCircle2, Music, Terminal
} from 'lucide-react';

const MOCK_DB = {
    "学生": {
        reading: "がくせい", romaji: "gakusei", etymology: "「学」は学ぶ、「生」は生きる・人。学ぶ人という意味から。",
        jp_def: "学校などで教育を受けている人。", target_def: "学生 / Student",
        conjugation: "名詞", ex1_jp: "私は学生です。", ex1_cn: "我是学生。",
        ex2_jp: "彼は東京大学の学生です。", ex2_cn: "他是东京大学的学生。"
    },
    "食べる": {
        reading: "たべる", romaji: "taberu", etymology: "古語の『賜（た）ぶ』から派生。",
        jp_def: "食物を口に入れ、かんで飲み込む。", target_def: "吃 / To eat",
        conjugation: "下一段動詞", ex1_jp: "朝ごはんを食べる。", ex1_cn: "吃早饭。",
        ex2_jp: "一緒に食べましょう。", ex2_cn: "一起吃吧。"
    }
};

export default function AnkiMock() {
    const [inputText, setInputText] = useState('');
    const [cards, setCards] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewIdx, setPreviewIdx] = useState(null);
    const [log, setLog] = useState('系统就绪');

    const handleAdd = () => {
        const word = inputText.trim();
        if (!word || isProcessing) return;

        setIsProcessing(true);
        setLog(`正在解析: ${word}...`);

        // 模拟 AI 处理时间
        setTimeout(() => {
            const mockData = MOCK_DB[word] || {
                reading: "???", romaji: "unknown", etymology: "这是一个模拟预览，请尝试输入 '学生' 或 '食べる'",
                jp_def: "Demo Mode Data", target_def: "示例意思",
                conjugation: "未知类型", ex1_jp: "例文1", ex1_cn: "例子1",
                ex2_jp: "例文2", ex2_cn: "例子2"
            };

            const newCard = { word, ...mockData, status: 'done', id: Date.now() };
            setCards([newCard, ...cards]);
            setPreviewIdx(0);
            setIsProcessing(false);
            setInputText('');
            setLog(`处理完成: ${word}`);
        }, 1500);
    };

    const activeCard = previewIdx !== null ? cards[previewIdx] : null;

    return (
        <div className="flex flex-col h-[600px] bg-[#f8fafc] rounded-2xl overflow-hidden border border-white/10 text-slate-900">
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
                {/* 左侧控制区 */}
                <div className="lg:col-span-7 p-4 flex flex-col gap-4 border-r border-slate-100">
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Zap className="text-indigo-600" size={18} />
                            <span className="font-bold text-sm">Anki Deep Parser Demo</span>
                        </div>
                        <Settings2 size={16} className="text-slate-300" />
                    </div>

                    {/* 输入框 */}
                    <div className="flex gap-2 bg-white p-2 rounded-xl shadow-inner border border-slate-100">
                        <div className="relative flex-1 flex items-center">
                            <Keyboard className="absolute left-3 text-slate-300" size={18} />
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                placeholder="输入 '学生' 试试..."
                                className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm"
                            />
                        </div>
                        <button
                            onClick={handleAdd}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all disabled:opacity-30"
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        </button>
                    </div>

                    {/* 列表 */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {cards.map((c, i) => (
                            <div
                                key={c.id}
                                onClick={() => setPreviewIdx(i)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${previewIdx === i ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold">{c.word}</span>
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                </div>
                                <Music size={14} className="text-indigo-300" />
                            </div>
                        ))}
                        {cards.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                <Library size={48} />
                                <p className="text-xs font-bold mt-4 uppercase tracking-widest">等待录入</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧预览区 */}
                <div className="lg:col-span-5 bg-white flex flex-col border-l border-slate-100">
                    <div className="bg-slate-800 p-3 text-[10px] text-slate-400 font-bold tracking-widest uppercase text-center">
                        Card Preview
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeCard ? (
                            <div className="animate-in fade-in slide-in-from-right-2">
                                <div className="text-center mb-8">
                                    <h2 className="text-5xl font-serif font-black mb-4">{activeCard.word}</h2>
                                    <button className="p-4 bg-indigo-600 text-white rounded-full shadow-lg">
                                        <Volume2 size={24} />
                                    </button>
                                </div>
                                <div className="space-y-6 text-left">
                                    <div className="flex justify-between border-b pb-4">
                                        <div>
                                            <p className="text-[10px] text-indigo-500 font-bold uppercase">Reading</p>
                                            <p className="text-lg font-bold">{activeCard.reading}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-indigo-500 font-bold uppercase">Type</p>
                                            <p className="text-sm font-bold text-slate-400">{activeCard.conjugation}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black mb-2">{activeCard.target_def}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {activeCard.etymology}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-indigo-100 pl-4">
                                            <p className="text-sm font-bold italic">“{activeCard.ex1_jp}”</p>
                                            <p className="text-xs text-slate-400">{activeCard.ex1_cn}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-200">
                                <p className="text-xs font-bold uppercase">Select a word</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 底部状态栏 */}
            <div className="bg-slate-900 px-4 py-2 flex items-center gap-3 text-[10px] font-mono text-indigo-300 border-t border-white/5">
                <Terminal size={12} />
                <span className="uppercase tracking-widest opacity-70">Demo_Mode_Active</span>
                <span className="text-white">|</span>
                <span className="truncate">{log}</span>
            </div>
        </div>
    );
}