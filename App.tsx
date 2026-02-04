
import React, { useState } from 'react';
import { QuizMode, QuizState, Category } from './types';
import { INITIAL_QUESTIONS } from './constants';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentMode: QuizMode.IDLE,
    questions: [],
    currentIndex: 0,
    showAnswer: false,
    history: []
  });

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = (mode: QuizMode) => {
    if (mode === QuizMode.LIST) {
      setState(prev => ({ ...prev, currentMode: mode, questions: INITIAL_QUESTIONS }));
      return;
    }

    let selectedQuestions = [...INITIAL_QUESTIONS];
    selectedQuestions = shuffleArray(selectedQuestions);

    if (mode === QuizMode.RANDOM10) {
      selectedQuestions = selectedQuestions.slice(0, 10);
    }

    setState({
      currentMode: mode,
      questions: selectedQuestions,
      currentIndex: 0,
      showAnswer: false,
      history: []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recordResult = (isCorrect: boolean) => {
    const questionId = state.questions[state.currentIndex].id;
    const newHistory = [...state.history, { questionId, isCorrect }];

    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      showAnswer: false,
      history: newHistory
    }));
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAnswer = () => {
    setState(prev => ({ ...prev, showAnswer: !prev.showAnswer }));
  };

  const reset = () => {
    setState({
      currentMode: QuizMode.IDLE,
      questions: [],
      currentIndex: 0,
      showAnswer: false,
      history: []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFinished = state.currentIndex >= state.questions.length && state.currentMode !== QuizMode.IDLE && state.currentMode !== QuizMode.LIST;
  const currentQuestion = state.questions[state.currentIndex];

  const correctCount = state.history.filter(h => h.isCorrect).length;
  const accuracyRate = state.history.length > 0 ? Math.round((correctCount / state.history.length) * 100) : 0;

  const renderCategoryBadge = (category: Category) => {
    const colors: Record<Category, string> = {
      '一般常識': 'bg-blue-100 text-blue-700',
      '歴史': 'bg-amber-100 text-amber-700',
      '科学': 'bg-emerald-100 text-emerald-700',
      '言語': 'bg-purple-100 text-purple-700',
      '数学': 'bg-rose-100 text-rose-700',
      'IT・技術': 'bg-slate-100 text-slate-700',
      '政治・経済': 'bg-indigo-600 text-white',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${colors[category] || 'bg-gray-100'}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-12 pt-4 px-3 sm:px-4 text-slate-900">
      {/* Header */}
      <header className="w-full max-w-2xl mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
            <i className="fas fa-book-open text-lg"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">POLEC</h1>
        </div>
        {state.currentMode !== QuizMode.IDLE && (
          <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400">
            <i className="fas fa-times text-lg"></i>
          </Button>
        )}
      </header>

      <main className="w-full max-w-2xl flex-1 flex flex-col">
        {state.currentMode === QuizMode.IDLE && (
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-800">学習を始める</h2>
              <p className="text-slate-400 text-sm font-medium">政治・経済：全 {INITIAL_QUESTIONS.length} 問</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="flex items-center justify-between px-6 py-6 rounded-3xl"
                fullWidth
                onClick={() => startQuiz(QuizMode.ALL)}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <i className="fas fa-layer-group text-xl"></i>
                  </div>
                  <div>
                    <span className="block text-lg font-bold">全問復習</span>
                    <span className="text-xs font-medium opacity-70">すべての問題をシャッフルして出題</span>
                  </div>
                </div>
                <i className="fas fa-chevron-right opacity-50"></i>
              </Button>

              <Button 
                variant="secondary" 
                size="lg" 
                className="flex items-center justify-between px-6 py-6 rounded-3xl"
                fullWidth
                onClick={() => startQuiz(QuizMode.RANDOM10)}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-white/10 rounded-2xl text-slate-300">
                    <i className="fas fa-dice text-xl"></i>
                  </div>
                  <div>
                    <span className="block text-lg font-bold">ランダム10問</span>
                    <span className="text-xs font-medium opacity-70">10問をランダムにピックアップ</span>
                  </div>
                </div>
                <i className="fas fa-chevron-right opacity-30"></i>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center justify-between px-6 py-5 rounded-3xl border-slate-200"
                fullWidth
                onClick={() => startQuiz(QuizMode.LIST)}
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                    <i className="fas fa-list-ol text-xl"></i>
                  </div>
                  <div>
                    <span className="block text-lg font-bold text-slate-700">問題一覧</span>
                    <span className="text-xs font-medium opacity-70">全61問の設問と答えをチェック</span>
                  </div>
                </div>
                <i className="fas fa-chevron-right opacity-20"></i>
              </Button>
            </div>
          </div>
        )}

        {state.currentMode === QuizMode.LIST && (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
             <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h2 className="font-black text-slate-800">問題一覧 ({INITIAL_QUESTIONS.length})</h2>
               <Button variant="ghost" size="sm" onClick={reset} className="font-bold text-indigo-600">
                 閉じる
               </Button>
             </div>
             <div className="max-h-[70vh] overflow-y-auto custom-scroll p-2">
               {INITIAL_QUESTIONS.map((q) => (
                 <div key={q.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-[10px] font-black text-slate-300">#{q.id}</span>
                   </div>
                   <p className="text-sm font-bold text-slate-800 mb-2 leading-tight">{q.question}</p>
                   <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full">
                     答：{q.answer}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {state.currentMode !== QuizMode.IDLE && state.currentMode !== QuizMode.LIST && !isFinished && currentQuestion && (
          <div key={state.currentIndex} className="flex-1 flex flex-col space-y-4 max-h-[85vh] animate-in fade-in duration-300">
            <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 flex-1 flex flex-col relative overflow-hidden">
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-end">
                  {renderCategoryBadge(currentQuestion.category)}
                  <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">
                    Question {state.currentIndex + 1} / {state.questions.length}
                  </span>
                </div>
                <ProgressBar current={state.currentIndex + 1} total={state.questions.length} />
              </div>

              <div className="flex-1 flex flex-col justify-center py-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight text-center px-2">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* 解答エリア：チラつき防止のため、showAnswerがfalseの時はテキストを空にする */}
              <div className={`transition-all duration-300 ease-out overflow-hidden ${state.showAnswer ? 'opacity-100 max-h-40 mt-6' : 'opacity-0 max-h-0 mt-0'}`}>
                <div className="bg-indigo-600 rounded-3xl p-6 text-white text-center shadow-lg shadow-indigo-100 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                   <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Answer</span>
                   <p className="text-2xl font-black mb-1">
                     {state.showAnswer ? currentQuestion.answer : ''}
                   </p>
                </div>
              </div>

              <div className="mt-6">
                {!state.showAnswer ? (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg" 
                    onClick={toggleAnswer} 
                    className="py-6 rounded-3xl text-lg font-black shadow-xl shadow-indigo-100"
                  >
                    答えを表示
                  </Button>
                ) : (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Button 
                      variant="outline" 
                      onClick={() => recordResult(false)} 
                      className="py-5 rounded-3xl border-rose-100 text-rose-500 font-bold bg-rose-50"
                    >
                      <i className="fas fa-times mr-2"></i> 不正解
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => recordResult(true)} 
                      className="py-5 rounded-3xl bg-emerald-500 hover:bg-emerald-600 border-none font-bold shadow-lg shadow-emerald-100"
                    >
                      <i className="fas fa-check mr-2"></i> 正解！
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center animate-in zoom-in duration-500 flex flex-col justify-center min-h-[60vh]">
            <div className={`mx-auto mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl shadow-inner ${accuracyRate >= 80 ? 'bg-emerald-100 text-emerald-600' : accuracyRate >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
              <i className={accuracyRate >= 80 ? 'fas fa-award' : accuracyRate >= 50 ? 'fas fa-graduation-cap' : 'fas fa-redo-alt'}></i>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1">結果</h2>
            <div className="mb-8">
               <span className="text-7xl font-black text-indigo-600 tracking-tighter">{accuracyRate}</span>
               <span className="text-2xl font-black text-indigo-400 ml-1">%</span>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">正答率</p>
            </div>
            
            <div className="flex gap-2 mb-8">
              <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">正解</p>
                <p className="text-xl font-black text-emerald-600">{correctCount}</p>
              </div>
              <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">不正解</p>
                <p className="text-xl font-black text-rose-500">{state.questions.length - correctCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" fullWidth className="py-5 rounded-3xl font-black shadow-lg shadow-indigo-100" onClick={() => startQuiz(state.currentMode)}>
                <i className="fas fa-redo mr-2"></i> もう一度挑戦
              </Button>
              <Button variant="outline" fullWidth className="py-5 rounded-3xl font-bold border-slate-100" onClick={reset}>
                <i className="fas fa-home mr-2"></i> ホームに戻る
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        © 2024 POLEC STUDY SYSTEM
      </footer>
    </div>
  );
};

export default App;
