import ja from './resume/ja.json';
import zh from './resume/zh.json';
import en from './resume/en.json';

// Public identity shared by About and Resume. Private career source material stays in the knowledge base.
export const careerProfile = {
  name: 'CAO FENG',
  alias: '樹（Itsuki）',
  email: 'caofeng@erzhiqian.cc',
  github: 'https://github.com/erzhiqianyi',
  updated: '2026-09-06',
};

export type ResumeLocale = 'ja' | 'zh' | 'en';
export const resumeContent = { ja, zh, en };
export const resumeLanguages = [
  { code: 'ja', label: '日本語', href: '/resume', htmlLang: 'ja' },
  { code: 'zh', label: '中文', href: '/resume/zh', htmlLang: 'zh-CN' },
  { code: 'en', label: 'EN', href: '/resume/en', htmlLang: 'en' },
] as const;
