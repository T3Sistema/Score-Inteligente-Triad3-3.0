
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../hooks/useApp';
import { UserRole, Submission, NeuroAnalysisResult, Question, AvailableOralTest, OralTestResult, User } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0a5 5 0 01-5 5v2.93zM3 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17a1 1 0 102 0v-2.07A7.001 7.001 0 003 8z" clipRule="evenodd" /></svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
);
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
);
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
);
const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
);
const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5a5.5 5.5 0 00-5.5 5.5c0 1.954 1.135 3.653 2.76 4.582A3.502 3.502 0 015.5 16.5a1.5 1.5 0 01-3 0 5.002 5.002 0 00-2.5-4.07A6.502 6.502 0 013.5 9a6.5 6.5 0 0113 0c0 1.593-.57 3.042-1.5 4.148V13.5a1.5 1.5 0 01-3 0 3.5 3.5 0 01-1.76-2.918A5.5 5.5 0 0010 3.5z" /><path d="M13.5 14.5a2 2 0 100-4 2 2 0 000 4zM6.5 14.5a2 2 0 100-4 2 2 0 000 4z" /></svg>
);

const ResultDetailModal: React.FC<{
    result: AvailableOralTest | null;
    onClose: () => void;
}> = ({ result, onClose }) => {
    if (!result) return null;

    const formatSeconds = (seconds: string): string => {
        const totalSeconds = parseInt(seconds, 10);
        if (isNaN(totalSeconds)) return "00:00";
        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const scoreAnterior = parseInt(result['Score Anterior'] || '0', 10);
    const scoreAtual = parseInt(result['Score Atual'] || '0', 10);
    const scoreDiff = scoreAtual - scoreAnterior;

    const FormattedDetailedResult: React.FC<{ text: string }> = ({ text }) => {
        const parts = text.split('```');
        return (
            <div className="text-sm">
                {parts.map((part, index) => {
                    if (index % 2 === 1) { // This is a code block
                        return (
                            <pre key={index} className="bg-dark-background p-3 rounded-md text-gray-300 font-mono text-xs leading-relaxed overflow-x-auto">
                                {part}
                            </pre>
                        );
                    } else { // This is regular text
                        const formattedPart = part.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyan-400">$1</strong>');
                        return <div key={index} className="my-2" dangerouslySetInnerHTML={{ __html: formattedPart.replace(/\n/g, '<br/>') }} />;
                    }
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-dark-card rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col border border-dark-border" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex-shrink-0 border-b border-dark-border flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {result.Foto && <img src={result.Foto} alt={result.Nome} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400" />}
                        <div className="min-w-0">
                            <h2 className="text-2xl font-bold text-cyan-400 truncate" title={result.Nome}>{result.Nome}</h2>
                            <p className="text-gray-400">{result.Empresa}</p>
                            <p className="text-sm text-gray-500 break-all">{result['E-mail']} | {result.Telefone}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <div className="p-5 overflow-y-auto flex-grow space-y-5">
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                        <div className="flex items-center gap-2 bg-dark-background p-2.5 rounded-lg"><CalendarIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" /> <span>{result['Data de envio']}</span></div>
                        <div className="flex items-center gap-2 bg-dark-background p-2.5 rounded-lg"><ClockIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" /> <span>Início: {result['Horario Inicio'] || result['Horário de envio'] || 'N/A'}</span></div>
                        <div className="flex items-center gap-2 bg-dark-background p-2.5 rounded-lg"><ClockIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" /> <span>Resposta: {result['Horario Resposta'] || 'N/A'}</span></div>
                        <div className="flex items-center gap-2 bg-dark-background p-2.5 rounded-lg"><ClockIcon className="h-5 w-5 text-cyan-400 flex-shrink-0" /> <span>Limite: {formatSeconds(result['Tempo Limite'])}</span></div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <StarIcon />
                            <span>Análise de Score</span>
                        </div>
                        <div className="bg-dark-background p-4 rounded-lg flex items-center justify-around text-center border border-dark-border">
                            <div>
                                <p className="text-xs text-gray-400">Anterior</p>
                                <p className="text-2xl font-bold text-gray-400">{scoreAnterior}</p>
                            </div>
                            <TrendingUpIcon className={`h-8 w-8 ${scoreDiff > 0 ? 'text-green-500' : (scoreDiff < 0 ? 'text-red-500 rotate-90' : 'text-gray-500')}`} />
                            <div>
                                <p className="text-xs text-green-400">Atual</p>
                                <p className="text-2xl font-bold text-green-400">{scoreAtual}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <QuestionMarkCircleIcon className="h-5 w-5 text-cyan-400" />
                            <span>Pergunta Gerada</span>
                        </div>
                        <div className="text-sm bg-dark-background p-3 rounded-lg border border-dark-border">
                            <p className="whitespace-pre-wrap text-gray-300">{result.Pergunta || "Pergunta não disponível."}</p>
                        </div>
                    </div>
                    
                    {result['Resposta Funcionario'] && (
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                                <MicrophoneIcon className="h-5 w-5 text-cyan-400" />
                                <span>Áudio da Resposta</span>
                            </div>
                            <audio controls src={result['Resposta Funcionario']} className="w-full h-14">Seu navegador não suporta o elemento de áudio.</audio>
                        </div>
                    )}

                    {result.Transcricao && (
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                                <DocumentTextIcon className="h-5 w-5 text-cyan-400" />
                                <span>Transcrição</span>
                            </div>
                            <div className="text-sm bg-dark-background p-3 rounded-lg max-h-32 overflow-y-auto border border-dark-border">
                                <p className="whitespace-pre-wrap text-gray-300">{result.Transcricao}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <BrainIcon className="h-5 w-5 text-cyan-400" />
                            <span>Resultado Detalhado</span>
                        </div>
                        <div className="bg-dark-background p-3 rounded-lg border border-dark-border">
                           <FormattedDetailedResult text={result['Resultado Detalhado'] || result['Perguntas & Respostas'] || "Resultado detalhado não disponível."}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const EmployeeOralTestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { currentUser } = useApp();
    const [tests, setTests] = useState<AvailableOralTest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submittingTestId, setSubmittingTestId] = useState<number | null>(null);
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'toDo' | 'inProgress' | 'results'>('toDo');
    const [viewingResult, setViewingResult] = useState<AvailableOralTest | null>(null);

    const fetchTests = useCallback(async () => {
        if (!currentUser) return;

        setIsLoading(true);
        setError(null);
        setApiMessage(null);
        try {
            const [allTestsResponse, resultsResponse] = await Promise.all([
                fetch('https://webhook.triad3.io/webhook/visu-funcio-provaoral'),
                fetch('https://webhook.triad3.io/webhook/resultado-provaoral')
            ]);

            if (!allTestsResponse.ok) {
                throw new Error('Não foi possível carregar as provas disponíveis.');
            }
            if (!resultsResponse.ok) {
                throw new Error('Não foi possível carregar os resultados das provas.');
            }

            const allTestsText = await allTestsResponse.text();
            const allTestsData = allTestsText ? JSON.parse(allTestsText) : [];

            const resultsText = await resultsResponse.text();
            const resultsData = resultsText ? JSON.parse(resultsText) : [];

            if (!Array.isArray(allTestsData)) {
                 throw new Error('Formato de resposta inesperado da API de provas.');
            }
             if (!Array.isArray(resultsData)) {
                 throw new Error('Formato de resposta inesperado da API de resultados.');
            }

            const ongoingTests: AvailableOralTest[] = allTestsData
                .filter((item: any) => item.Status === 'Em andamento' || item.Status === 'Iniciada')
                .map((item: any) => ({
                    Id: item.Id,
                    Nome: item.Nome,
                    Telefone: item.Telefone,
                    'E-mail': item['E-mail'],
                    Empresa: item.Empresa,
                    Pergunta: item.Pergunta,
                    'Data de envio': item['Data de envio'],
                    'Horário de envio': item['Horário de envio'],
                    Categoria: item.Categoria,
                    'Tempo Limite': item['Tempo Limite'],
                    Status: item.Status,
                    'Perguntas & Respostas': item['Perguntas & Respostas'],
                }));
            
            const employeeResults: AvailableOralTest[] = resultsData
                .filter((item: any) => item.email === currentUser.email || item.telefone === currentUser.phone)
                .map((item: any) => ({
                    Id: item.Id || item.id,
                    Nome: item.Nome || item.nome,
                    Telefone: item.Telefone || item.telefone,
                    'E-mail': item['E-mail'] || item.email,
                    Empresa: item.Empresa || item.empresa,
                    Pergunta: item.Pergunta || item.pergunta,
                    'Data de envio': item['Data de envio'] || item.data,
                    'Horário de envio': item['Horário de envio'] || item.horario_inicio,
                    Categoria: item.Categoria || 'Prova Oral',
                    'Tempo Limite': item['Tempo Limite'] || item.tempo_limite,
                    Status: 'Respondida',
                    'Perguntas & Respostas': item['Perguntas & Respostas'] || item.resultado_detalhado,
                    'Score Anterior': item['Score Anterior'] || item.score_anterior,
                    'Score Atual': item['Score Atual'] || item.score_atual,
                    Foto: item.Foto || item.foto,
                    'Resposta Funcionario': item['Resposta Funcionario'] || item.resposta_funcionario,
                    Transcricao: item.Transcricao || item.transcricao,
                    'Resultado Detalhado': item['Resultado Detalhado'] || item.resultado_detalhado,
                    'Horario Inicio': item['Horario Inicio'] || item.horario_inicio,
                    'Horario Resposta': item['Horario Resposta'] || item.horario_resposta,
                }));
            
            const combinedTests = [...ongoingTests, ...employeeResults];
            setTests(combinedTests);

            const inProgressTest = combinedTests.find((t: AvailableOralTest) => t.Status === 'Iniciada');
            if (inProgressTest) {
                setActiveTab('inProgress');
            } else {
                setActiveTab('toDo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (isOpen) {
            fetchTests();
        }
    }, [isOpen, fetchTests]);

    const testsToDo = useMemo(() => 
        tests.filter(t => t.Status === 'Em andamento').sort((a, b) => a.Id - b.Id), 
    [tests]);

    const testInProgress = useMemo(() => 
        tests.find(t => t.Status === 'Iniciada'), 
    [tests]);

    const testsDone = useMemo(() => 
        tests.filter(t => t.Status === 'Respondida').sort((a, b) => {
            const dateA = a['Data de envio'].split('/').reverse().join('-');
            const dateB = b['Data de envio'].split('/').reverse().join('-');
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        }), 
    [tests]);

    const handleStartTest = async (testData: AvailableOralTest) => {
        setSubmittingTestId(testData.Id);
        setError(null);
        setApiMessage(null);
        try {
            const response = await fetch('https://webhook.triad3.io/webhook/func-inic-provaoral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData),
            });
            const result = await response.json();
            if (response.ok && result.resposta === "Prova oral iniciada com sucesso! Confira o seu WhatsApp.") {
                setApiMessage(result.resposta);
                await fetchTests();
            } else {
                throw new Error(result.resposta || 'Erro ao iniciar a prova oral. Tente novamente.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setSubmittingTestId(null);
        }
    };
    
    const formatSeconds = (secondsStr: string): string => {
      const seconds = parseInt(secondsStr, 10);
      if (isNaN(seconds) || seconds < 0) return '00:00';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    const TabButton: React.FC<{ name: string, tabId: 'toDo' | 'inProgress' | 'results' }> = ({ name, tabId }) => {
        const isActive = activeTab === tabId;
        return (
            <button 
                onClick={() => setActiveTab(tabId)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
            >
                {name}
            </button>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <div className="loader triangle"><svg viewBox="0 0 86 80"><polygon points="43 8 79 72 7 72"></polygon></svg></div>
                </div>
            );
        }

        switch (activeTab) {
            case 'toDo':
                return (
                    <div className="space-y-4">
                        {testInProgress && (
                            <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-300 text-sm text-center">
                                Você deve concluir a prova iniciada antes de começar uma nova.
                            </div>
                        )}
                        {testsToDo.length === 0 && !error ? (
                            <div className="text-center text-gray-400 py-8">Nenhuma prova para fazer no momento.</div>
                        ) : (
                            testsToDo.map((test, index) => {
                                const isFirstTest = index === 0;
                                const isButtonDisabled = !!testInProgress || submittingTestId !== null || !isFirstTest;

                                return (
                                    <div key={test.Id} className={`bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-opacity ${!isButtonDisabled ? '' : 'opacity-50'}`}>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg text-gray-200">{test.Categoria}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                                                <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {test['Data de envio']}</span>
                                                <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {formatSeconds(test['Tempo Limite'])}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleStartTest(test)}
                                            disabled={isButtonDisabled}
                                            title={!isFirstTest ? "Você deve concluir a prova anterior para iniciar esta." : ""}
                                            className="w-full sm:w-auto px-5 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                        >
                                            {submittingTestId === test.Id ? 'Iniciando...' : 'Iniciar Prova Oral'}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                );
            case 'inProgress':
                 return testInProgress ? (
                    <div className="bg-dark-background p-6 rounded-lg border-2 border-cyan-500 text-center flex flex-col items-center justify-center h-full">
                        <MicrophoneIcon className="h-12 w-12 text-cyan-400 mb-4" />
                        <h3 className="font-semibold text-xl text-white mb-2">Sua Prova está Ativa!</h3>
                        <p className="text-lg font-bold text-gray-200 mb-4">{testInProgress.Categoria}</p>
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {testInProgress['Data de envio']}</span>
                            <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {formatSeconds(testInProgress['Tempo Limite'])}</span>
                        </div>
                        <p className="text-gray-300 max-w-md">
                            Verifique seu WhatsApp para receber a pergunta e enviar sua resposta em áudio. Boa sorte!
                        </p>
                    </div>
                 ) : (
                    <div className="text-center text-gray-400 py-8">Nenhuma prova iniciada no momento.</div>
                 );
            case 'results':
                return testsDone.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">Nenhum resultado de prova oral disponível no momento.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testsDone.map(test => {
                             const scoreAnterior = parseInt(test['Score Anterior'] || '0', 10);
                             const scoreAtual = parseInt(test['Score Atual'] || '0', 10);
                             return (
                                 <div 
                                     key={test.Id} 
                                     className="bg-dark-background rounded-xl shadow-lg border border-dark-border flex flex-col text-left transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 cursor-pointer"
                                     onClick={() => setViewingResult(test)}
                                 >
                                     <div className="p-5 flex-grow">
                                         <div className="flex items-center gap-4 mb-4">
                                             {test.Foto && <img src={test.Foto} alt={test.Nome} className="w-16 h-16 rounded-full object-cover border-4 border-cyan-400 flex-shrink-0" />}
                                             <div className="min-w-0">
                                                 <h2 className="text-xl font-bold text-dark-text truncate" title={test.Nome}>{test.Nome}</h2>
                                                 <p className="text-sm text-gray-400">{test.Categoria}</p>
                                             </div>
                                         </div>
                                         <div className="flex items-center justify-between text-sm text-gray-400 mb-4 bg-dark-card p-2 rounded-lg">
                                             <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> <span>{test['Data de envio']}</span></div>
                                             <div className="font-semibold text-base text-gray-300">
                                                 {scoreAnterior} &rarr; <span className="text-green-400">{scoreAtual}</span>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="text-center bg-dark-border/30 px-5 py-3 text-sm font-semibold text-cyan-400 rounded-b-xl">
                                         Ver Detalhes
                                     </div>
                                 </div>
                             );
                        })}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <>
            <ResultDetailModal result={viewingResult} onClose={() => setViewingResult(null)} />
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
                <div 
                    className="bg-dark-card rounded-xl shadow-2xl w-full max-w-3xl h-full max-h-[90vh] flex flex-col border border-dark-border" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 flex-shrink-0 border-b border-dark-border flex justify-between items-center">
                        <h2 className="text-xl font-bold text-cyan-400">Prova Oral</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                    </div>
                    
                    <div className="flex-shrink-0 border-b border-dark-border flex">
                        <TabButton name="A Fazer" tabId="toDo" />
                        <TabButton name="Iniciada" tabId="inProgress" />
                        <TabButton name="Resultados" tabId="results" />
                    </div>
                    
                    <div className="p-5 flex-grow overflow-y-auto space-y-4">
                        {apiMessage && <div className="p-3 mb-4 rounded-lg bg-green-500/20 text-green-300 text-sm">{apiMessage}</div>}
                        {error && <div className="p-3 mb-4 rounded-lg bg-red-500/20 text-red-300 text-sm">{error}</div>}
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

const CompanyOralTestResultsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onViewResult: (result: AvailableOralTest) => void;
}> = ({ isOpen, onClose, onViewResult }) => {
    const { currentUser, oralTestResults, fetchOralTestResults } = useApp();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const loadResults = async () => {
                setIsLoading(true);
                await fetchOralTestResults();
                setIsLoading(false);
            };
            loadResults();
        }
    }, [isOpen, fetchOralTestResults]);

    const companyResults = useMemo(() => {
        if (!currentUser) return [];
        return oralTestResults.filter(r => r.empresa === currentUser.companyName)
            .sort((a, b) => {
                const dateA = a.data.split('/').reverse().join('-');
                const dateB = b.data.split('/').reverse().join('-');
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [oralTestResults, currentUser]);

    const mapOralTestResultToAvailableOralTest = useCallback((result: OralTestResult): AvailableOralTest => ({
        Id: result.id,
        Nome: result.nome,
        Telefone: result.telefone,
        'E-mail': result.email,
        Empresa: result.empresa,
        Pergunta: result.pergunta,
        'Data de envio': result.data,
        'Horário de envio': result.horario_inicio,
        Categoria: 'Prova Oral',
        'Tempo Limite': result.tempo_limite,
        Status: 'Respondida',
        'Perguntas & Respostas': result.resultado_detalhado,
        'Score Anterior': result.score_anterior,
        'Score Atual': result.score_atual,
        Foto: result.foto,
        'Resposta Funcionario': result.resposta_funcionario,
        Transcricao: result.transcricao,
        'Resultado Detalhado': result.resultado_detalhado,
        'Horario Inicio': result.horario_inicio,
        'Horario Resposta': result.horario_resposta,
    }), []);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-dark-card rounded-xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col border border-dark-border" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex-shrink-0 border-b border-dark-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Resultados da Prova Oral - {currentUser?.companyName}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="p-5 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="loader triangle"><svg viewBox="0 0 86 80"><polygon points="43 8 79 72 7 72"></polygon></svg></div>
                        </div>
                    ) : companyResults.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">Nenhum resultado de prova oral encontrado para seus funcionários.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companyResults.map(result => {
                                const scoreAnterior = parseInt(result.score_anterior || '0', 10);
                                const scoreAtual = parseInt(result.score_atual || '0', 10);
                                return (
                                    <div 
                                        key={result.id} 
                                        className="bg-dark-background rounded-xl shadow-lg border border-dark-border flex flex-col text-left transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 cursor-pointer"
                                        onClick={() => onViewResult(mapOralTestResultToAvailableOralTest(result))}
                                    >
                                       <div className="p-5 flex-grow">
                                            <div className="flex items-center gap-4 mb-4">
                                                {result.foto && <img src={result.foto} alt={result.nome} className="w-16 h-16 rounded-full object-cover border-4 border-cyan-400 flex-shrink-0" />}
                                                <div className="min-w-0">
                                                    <h2 className="text-xl font-bold text-dark-text truncate" title={result.nome}>{result.nome}</h2>
                                                    <p className="text-sm text-gray-400">Prova Oral</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4 bg-dark-card p-2 rounded-lg">
                                                <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> <span>{result.data}</span></div>
                                                <div className="font-semibold text-base text-gray-300">
                                                    {scoreAnterior} &rarr; <span className="text-green-400">{scoreAtual}</span>
                                                </div>
                                            </div>
                                       </div>
                                        <div className="text-center bg-dark-border/30 px-5 py-3 text-sm font-semibold text-cyan-400 rounded-b-xl">
                                            Ver Detalhes
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const maturityLevels = [
    { level: 'Crítico', range: '0 - 30%', icon: '🔴', color: 'bg-red-900/50', chartColor: '#EF4444' },
    { level: 'Precário', range: '31 - 50%', icon: '🟠', color: 'bg-orange-900/50', chartColor: '#F97316' },
    { level: 'Mediano', range: '51 - 70%', icon: '🟡', color: 'bg-yellow-900/50', chartColor: '#EAB308' },
    { level: 'Avançado', range: '71 - 100%', icon: '🟢', color: 'bg-green-900/50', chartColor: '#22C55E' },
];

const getMaturityLevel = (score: number, maxScore: number) => {
    if (maxScore === 0) return maturityLevels[0];
    const percentage = (score / maxScore) * 100;
    if (percentage <= 30) return maturityLevels[0];
    if (percentage <= 50) return maturityLevels[1];
    if (percentage <= 70) return maturityLevels[2];
    return maturityLevels[3];
};

const getIconForSection = (title: string): React.ReactNode => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('persona')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('motivador')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('fricção')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-400 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('linguagem')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" /></svg>;
    if (lowerTitle.includes('bloqueio')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-fuchsia-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('recomendação')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('conclusão')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 18.5a11.954 11.954 0 007.834-13.501l-4.95-4.95a1.5 1.5 0 00-2.122 0l-4.95 4.95zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
    if (lowerTitle.includes('insight')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-300 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>;
    if (lowerTitle.includes('agente') || lowerTitle.includes('identidade')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c-1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5.804v-10A7.968 7.968 0 0014.5 4z" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400 analysis-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>;
};

const AnalysisResultModal: React.FC<{ analysis: NeuroAnalysisResult | null; onClose: () => void }> = ({ analysis, onClose }) => {
    const sections = useMemo(() => {
        if (!analysis?.resultado) return [];
        const text = analysis.resultado;
        const headersRegex = /(ANÁLISE TRIAD3:.*|NOME DA PERSONA \(TÉCNICO E SIMBÓLICO\)|NÚCLEO MOTIVADOR PRIMÁRIO|ESTRUTURA DE DEFESA \/ FRICÇÃO MAIOR|MAPA DE LINGUAGEM FUNCIONAL \/ ESTILO DE ABORDAGEM|ZONA DE BLOQUEIO OCULTO OU AUTOCENSURA|RECOMENDAÇÃO TRIAD3 PARA EXPANSÃO OU TREINAMENTO|CONCLUSÃO|INSIGHT PARA CRIAÇÃO DE AGENTE PERSONIFICADO BASEADO NESSA MENTE|🧠 IDENTIDADE DO AGENTE)/;
        const parts = text.split(headersRegex).filter(part => part && part.trim() !== '');
        const result = [];
        for (let i = 0; i < parts.length; i += 2) {
            if (parts[i+1]) {
                 result.push({ title: parts[i].trim(), content: parts[i+1].trim(), icon: getIconForSection(parts[i].trim()) });
            } else {
                 result.push({ title: "Resultado", content: parts[i].trim(), icon: getIconForSection("Resultado") });
            }
        }
        return result.length > 0 ? result : [{ title: "Resultado da Análise", content: text, icon: getIconForSection("Resultado da Análise") }];
    }, [analysis]);

    const renderContent = (content: string) => {
        const processedContent = content.replace(/^([A-Za-z\s()ÁÉÍÓÚÇ/]+:)/gm, '<strong>$1</strong>');
        return <div className="analysis-content" dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<p></p>') }} />;
    };
    
    if (!analysis) return null;

    const mainTitleSection = sections.find(s => s.title.startsWith("ANÁLISE TRIAD3"));
    const otherSections = sections.filter(s => s !== mainTitleSection);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-dark-card rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col border border-dark-border" onClick={e => e.stopPropagation()}>
                <div className="p-6 flex-shrink-0 border-b border-dark-border flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {analysis.foto && <img src={analysis.foto} alt={analysis.nome} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400" />}
                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400">{analysis.nome}</h2>
                            <p className="text-gray-400">{analysis.empresa}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    <div className="analysis-container">
                        {mainTitleSection && <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{mainTitleSection.content}</h1>}
                        <div className="space-y-6">
                            {otherSections.map((section, index) => (
                                <div key={index} className="analysis-card">
                                    <h3 className="analysis-title">{section.icon}<span className="flex-grow">{section.title}</span></h3>
                                    {renderContent(section.content)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CompanyDetailModal: React.FC<{
    company: User | null;
    employees: User[];
    onClose: () => void;
    onPhotoClick: (src: string) => void;
}> = ({ company, employees, onClose, onPhotoClick }) => {
    if (!company) return null;

    const companyEmployees = employees.filter(e => e.companyName === company.companyName);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-dark-card rounded-xl shadow-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col border border-dark-border" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 flex-shrink-0 border-b border-dark-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Funcionários de {company.companyName} ({companyEmployees.length})</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                
                <div className="p-5 flex-grow overflow-y-auto">
                    {companyEmployees.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            Nenhum funcionário cadastrado para esta empresa.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companyEmployees.map(employee => (
                                <div key={employee.id} className="bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col items-center text-center">
                                    <img 
                                        src={employee.photoUrl || 'https://edrrnawrhfhoynpiwqsc.supabase.co/storage/v1/object/public/imagenscientes/Imagens%20Score%20Inteligente/icon%20user.png'} 
                                        alt={employee.name} 
                                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-600 cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => employee.photoUrl && onPhotoClick(employee.photoUrl)}
                                    />
                                    <p className="font-bold text-lg text-dark-text truncate w-full" title={employee.name}>{employee.name}</p>
                                    <p className="text-sm text-cyan-400 mb-2">{employee.position || 'Cargo não informado'}</p>
                                    <div className="text-xs text-gray-400 space-y-1 text-left w-full border-t border-dark-border pt-3 mt-2">
                                        <p className="truncate"><strong>Email:</strong> {employee.email}</p>
                                        <p><strong>Telefone:</strong> {employee.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { 
        currentUser, submissions, users, fetchSubmissions, employeeSubmissions, fetchEmployeeScoresForAdmin, 
        neuroAnalysisResults, companyNeuroAnalysisResults, neuroCategories, categories, questions,
        fetchNeuroAnalysisResults, fetchCompanyNeuroAnalysisResults, fetchNeuroData, neuroSubmissions,
        fetchNeuroSubmissions, oralTestResults, fetchOralTestResults,
        allEmployees, fetchAllEmployees
    } = useApp();
    
    const [activeTab, setActiveTab] = useState<'scores' | 'analysis' | 'companies' | 'funcionarios'>('scores');

    // Admin state
    const [selectedUserId, setSelectedUserId] = useState<string>('all-companies'); 
    
    // Scores view state
    const [viewType, setViewType] = useState<'corporate' | 'employee'>('corporate');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [photoModalSrc, setPhotoModalSrc] = useState<string | null>(null);

    // Analysis view state
    const [analysisViewType, setAnalysisViewType] = useState<'company' | 'employee'>('company');
    const [selectedEmployeeAnalysisId, setSelectedEmployeeAnalysisId] = useState<string>('all');
    const [viewingAnalysis, setViewingAnalysis] = useState<NeuroAnalysisResult | null>(null);
    const [viewingCompany, setViewingCompany] = useState<User | null>(null);

    const [isOralTestModalOpen, setIsOralTestModalOpen] = useState(false);
    const [isCompanyOralTestResultsModalOpen, setIsCompanyOralTestResultsModalOpen] = useState(false);
    const [viewingResult, setViewingResult] = useState<AvailableOralTest | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          if (!currentUser) return;
          if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COMPANY) {
              await fetchSubmissions();
              await fetchEmployeeScoresForAdmin();
          } else if (currentUser.role === UserRole.EMPLOYEE) {
              await fetchSubmissions();
          }
          if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COMPANY) {
            await fetchAllEmployees();
          }
        };
        fetchData();
    }, [currentUser, fetchSubmissions, fetchEmployeeScoresForAdmin, fetchAllEmployees]);
    
    useEffect(() => {
        if (activeTab === 'analysis' && neuroCategories.length === 0 && currentUser) {
            const fetchNeuroDataOnDemand = async () => {
                await fetchNeuroData();
                await fetchNeuroSubmissions();
                await fetchNeuroAnalysisResults();
                await fetchCompanyNeuroAnalysisResults();
            };
            fetchNeuroDataOnDemand();
        }
    }, [activeTab, currentUser, neuroCategories.length, fetchNeuroData, fetchNeuroAnalysisResults, fetchCompanyNeuroAnalysisResults, fetchNeuroSubmissions]);

    useEffect(() => {
        if (currentUser?.role === UserRole.ADMIN) {
            const approvedCompanies = users.filter(u => u.role === UserRole.COMPANY && u.status === 'approved');
            const currentSelectionIsValid = approvedCompanies.some(u => u.id === selectedUserId) || selectedUserId === 'all-companies';
            if (approvedCompanies.length > 0 && !currentSelectionIsValid) {
                setSelectedUserId('all-companies');
            } else if (approvedCompanies.length === 0 && selectedUserId !== '') {
                 setSelectedUserId('');
            }
        }
    }, [currentUser, users, selectedUserId]);
    
    useEffect(() => {
        setSelectedCategoryId('');
        setSelectedEmployeeId('');
    }, [viewType, selectedUserId]);
    
    useEffect(() => {
        if (selectedUserId !== 'all-companies') {
            setAnalysisViewType('company');
            setSelectedEmployeeAnalysisId('all');
        }
    }, [selectedUserId]);

    const targetEmployeeSubmissions = useMemo(() => {
        const isAdmin = currentUser?.role === UserRole.ADMIN;
        const isCompany = currentUser?.role === UserRole.COMPANY;

        if (isAdmin) {
            if (selectedUserId === 'all-companies') {
                return employeeSubmissions;
            }
            const targetCompanyName = users.find(u => u.id === selectedUserId)?.companyName;
            if (targetCompanyName) {
                return employeeSubmissions.filter(s => s.companyName === targetCompanyName);
            }
            return [];
        } else if (isCompany) {
            return employeeSubmissions.filter(s => s.companyName === currentUser.companyName);
        }
        
        return [];
    }, [currentUser, employeeSubmissions, selectedUserId, users]);

    const { userSubmissions, completedCategories, selectedSubmission, employeeList, selectedEmployeeInfo } = useMemo(() => {
        const isAdmin = currentUser?.role === UserRole.ADMIN;
        const isCompany = currentUser?.role === UserRole.COMPANY;

        let targetSubmissions = submissions;
        let targetCompanyName: string | undefined;

        if (isAdmin) {
            if (selectedUserId !== 'all-companies') {
                targetCompanyName = users.find(u => u.id === selectedUserId)?.companyName;
                if (targetCompanyName) {
                    targetSubmissions = submissions.filter(s => s.companyName === targetCompanyName);
                }
            }
        } else if (isCompany) {
            targetCompanyName = currentUser.companyName;
            targetSubmissions = submissions.filter(s => s.userId === currentUser.id);
        } else { // Employee
            targetSubmissions = submissions.filter(s => s.userId === currentUser?.id);
        }

        if (isAdmin || isCompany) {
            if (viewType === 'employee') {
                const uniqueEmployees = targetEmployeeSubmissions.reduce((acc, sub) => {
                    if (!acc.find(e => e.userId === sub.userId)) {
                        acc.push({ userId: sub.userId, userName: sub.userName || 'Desconhecido', photoUrl: sub.photoUrl });
                    }
                    return acc;
                }, [] as { userId: string, userName: string, photoUrl?: string }[]);
                
                let submissionsForView: Submission[] = [];
                let employeeInfo: { name?: string, photoUrl?: string, companyName?: string } | null = null;
                
                if (selectedEmployeeId === 'all-employees') {
                    employeeInfo = { name: 'Todos os Funcionários' };
                    submissionsForView = targetEmployeeSubmissions;
                } else if (selectedEmployeeId) {
                    submissionsForView = targetEmployeeSubmissions.filter(sub => sub.userId === selectedEmployeeId);
                    const emp = uniqueEmployees.find(e => e.userId === selectedEmployeeId);
                    if (emp) {
                        employeeInfo = { name: emp.userName, photoUrl: emp.photoUrl, companyName: targetCompanyName };
                    }
                }
                
                const uniqueCategories = submissionsForView.reduce((acc, sub) => {
                    if (!acc.find(c => c.id === sub.categoryId)) acc.push({ id: sub.categoryId, name: sub.categoryName });
                    return acc;
                }, [] as { id: string, name: string }[]);
                
                if (selectedCategoryId === 'compare-all') {
                    return { userSubmissions: submissionsForView, completedCategories: uniqueCategories, selectedSubmission: null, employeeList: uniqueEmployees, selectedEmployeeInfo: employeeInfo };
                }

                let submission: Submission | null = null;
                if (selectedCategoryId === 'all-categories' && submissionsForView.length > 0) {
                    const totalScore = submissionsForView.reduce((sum, s) => sum + s.totalScore, 0);
                    const maxScore = submissionsForView.reduce((sum, s) => sum + s.maxScore, 0);
                    submission = { ...submissionsForView[0], id: 'aggregated-submission', categoryId: 'all-categories', categoryName: 'Resultado Geral', totalScore, maxScore };
                } else {
                    submission = submissionsForView.find(sub => sub.categoryId === selectedCategoryId) || null;
                }
                return { userSubmissions: submissionsForView, completedCategories: uniqueCategories, selectedSubmission: submission, employeeList: uniqueEmployees, selectedEmployeeInfo: employeeInfo };
            }
        }
        
        const uniqueCategories = targetSubmissions.reduce((acc, sub) => {
            if (!acc.find(c => c.id === sub.categoryId)) acc.push({ id: sub.categoryId, name: sub.categoryName });
            return acc;
        }, [] as { id: string, name: string }[]);
        
        if (selectedCategoryId === 'compare-all') {
            return { userSubmissions: targetSubmissions, completedCategories: uniqueCategories, selectedSubmission: null, employeeList: [], selectedEmployeeInfo: null };
        }

        let submission: Submission | null = null;
        if (selectedCategoryId === 'all-categories' && targetSubmissions.length > 0) {
             const totalScore = targetSubmissions.reduce((sum, s) => sum + s.totalScore, 0);
             const maxScore = targetSubmissions.reduce((sum, s) => sum + s.maxScore, 0);
             submission = { ...targetSubmissions[0], id: 'aggregated-submission', categoryId: 'all-categories', categoryName: 'Resultado Geral', totalScore, maxScore };
        } else {
             submission = targetSubmissions.find(sub => sub.categoryId === selectedCategoryId) || null;
        }

        if (isCompany && viewType === 'corporate' && submission) {
            submission.detailedAnswers = undefined;
        }

        return { userSubmissions: targetSubmissions, completedCategories: uniqueCategories, selectedSubmission: submission, employeeList: [], selectedEmployeeInfo: null };
    }, [currentUser, submissions, users, selectedUserId, selectedCategoryId, viewType, selectedEmployeeId, targetEmployeeSubmissions]);
    
    const { filteredCompanyAnalyses, filteredEmployeeAnalyses, analysisEmployeeList } = useMemo(() => {
        if (!currentUser) return { filteredCompanyAnalyses: [], filteredEmployeeAnalyses: [], analysisEmployeeList: [] };

        if (currentUser.role === UserRole.ADMIN) {
            if (selectedUserId === 'all-companies') {
                return {
                    filteredCompanyAnalyses: companyNeuroAnalysisResults,
                    filteredEmployeeAnalyses: neuroAnalysisResults,
                    analysisEmployeeList: []
                };
            }

            const targetCompanyName = users.find(u => u.id === selectedUserId)?.companyName;
            if (!targetCompanyName) return { filteredCompanyAnalyses: [], filteredEmployeeAnalyses: [], analysisEmployeeList: [] };

            const companyAnalysesForCompany = companyNeuroAnalysisResults.filter(r => r.empresa === targetCompanyName);
            const employeeAnalysesForCompany = neuroAnalysisResults.filter(r => r.empresa === targetCompanyName);
            
            const uniqueEmployees = employeeAnalysesForCompany.reduce((acc, analysis) => {
                if (!acc.find(e => e.email === analysis.email)) {
                    acc.push({ name: analysis.nome, email: analysis.email });
                }
                return acc;
            }, [] as { name: string, email: string }[]);
            
            if (analysisViewType === 'company') {
                return { 
                    filteredCompanyAnalyses: companyAnalysesForCompany, 
                    filteredEmployeeAnalyses: [],
                    analysisEmployeeList: uniqueEmployees
                };
            } else { 
                if (selectedEmployeeAnalysisId === 'all') {
                    return { 
                        filteredCompanyAnalyses: [], 
                        filteredEmployeeAnalyses: employeeAnalysesForCompany,
                        analysisEmployeeList: uniqueEmployees 
                    };
                } else {
                     const specificEmployeeAnalyses = employeeAnalysesForCompany.filter(r => r.email === selectedEmployeeAnalysisId);
                     return {
                        filteredCompanyAnalyses: [],
                        filteredEmployeeAnalyses: specificEmployeeAnalyses,
                        analysisEmployeeList: uniqueEmployees
                     };
                }
            }
        } else if (currentUser.role === UserRole.COMPANY) {
            const companyAnalyses = companyNeuroAnalysisResults.filter(r => r.empresa === currentUser.companyName);
            const employeeAnalyses = neuroAnalysisResults.filter(r => r.empresa === currentUser.companyName);
             return {
                filteredCompanyAnalyses: companyAnalyses,
                filteredEmployeeAnalyses: employeeAnalyses,
                analysisEmployeeList: []
             };
        } else { // EMPLOYEE
            const myAnalysis = neuroAnalysisResults.filter(r => r.email === currentUser.email);
            return {
                filteredCompanyAnalyses: [],
                filteredEmployeeAnalyses: myAnalysis,
                analysisEmployeeList: []
            };
        }
    }, [currentUser, users, selectedUserId, companyNeuroAnalysisResults, neuroAnalysisResults, analysisViewType, selectedEmployeeAnalysisId]);

    useEffect(() => {
        if (viewType === 'employee' && employeeList.length > 0) {
            const currentSelectionIsValid = employeeList.some(e => e.userId === selectedEmployeeId) || selectedEmployeeId === 'all-employees';
            if (!currentSelectionIsValid) {
                setSelectedEmployeeId('all-employees');
            }
        } else if (viewType === 'corporate') {
            setSelectedEmployeeId('');
        }
    }, [viewType, employeeList, selectedEmployeeId]);

    useEffect(() => {
        if (completedCategories.length === 0) {
            setSelectedCategoryId('');
            return;
        }
        const isSelectionValid = selectedCategoryId && (['compare-all', 'all-categories'].includes(selectedCategoryId) || completedCategories.some(c => c.id === selectedCategoryId));
        if (!isSelectionValid) {
            if (completedCategories.length > 1) {
                setSelectedCategoryId('compare-all');
            } else if (completedCategories.length === 1) {
                setSelectedCategoryId(completedCategories[0].id);
            } else {
                setSelectedCategoryId('');
            }
        }
    }, [completedCategories, selectedCategoryId]);

    const hasAnySubmissions = useMemo(() => {
        if (!currentUser) return false;
        if (currentUser.role === UserRole.ADMIN) return true;
        return submissions.length > 0 || (neuroSubmissions && neuroSubmissions.length > 0);
    }, [currentUser, submissions, neuroSubmissions]);

    const companyList = users.filter(u => u.role === UserRole.COMPANY && u.status === 'approved');

    const renderScoresContent = () => {
        let noDataMessage = 'Nenhuma avaliação encontrada.';
        if (viewType === 'corporate' && userSubmissions.length === 0) {
            const companyName = selectedUserId === 'all-companies' 
                ? 'Nenhuma empresa' 
                : users.find(u => u.id === (currentUser?.role === 'admin' ? selectedUserId : currentUser?.id))?.companyName;
            noDataMessage = `${companyName || 'Esta empresa'} ainda não completou nenhum questionário.`;
        } else if (viewType === 'employee') {
            if (employeeList.length === 0) noDataMessage = `Nenhum funcionário com score encontrado para esta empresa.`;
            else if (userSubmissions.length === 0) noDataMessage = `O funcionário selecionado não possui scores registrados.`;
        }
        
        const dataAvailable = viewType === 'corporate' ? userSubmissions.length > 0 : employeeList.length > 0;

        if (!dataAvailable) {
            return (
                 <div className="text-center py-12 sm:py-16 bg-dark-card rounded-xl shadow-lg border border-dark-border">
                    <p className="text-lg text-gray-400">{noDataMessage}</p>
                </div>
            );
        }
        
        if (viewType === 'employee' && selectedEmployeeId === 'all-employees') {
             const submissionsByEmployee = targetEmployeeSubmissions.reduce((acc, sub) => {
                if (!sub.userId) return acc;
                if (!acc[sub.userId]) acc[sub.userId] = [];
                acc[sub.userId].push(sub);
                return acc;
            }, {} as Record<string, Submission[]>);
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-6 text-cyan-400">Visão Geral da Equipe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {employeeList.map(employee => {
                            const employeeSubs = submissionsByEmployee[employee.userId] || [];
                            const totalScore = employeeSubs.reduce((sum, s) => sum + s.totalScore, 0);
                            const maxScore = employeeSubs.reduce((sum, s) => sum + s.maxScore, 0);
                            const overallPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
                            const overallMaturity = getMaturityLevel(totalScore, maxScore);

                            return (
                                <div key={employee.userId} className="bg-dark-card rounded-xl shadow-lg border border-dark-border p-4 sm:p-5 flex flex-col transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        {employee.photoUrl && (
                                            <img src={employee.photoUrl} alt={employee.userName} className="w-16 h-16 rounded-full object-cover cursor-pointer border-4 flex-shrink-0" style={{ borderColor: overallMaturity.chartColor }} onClick={() => setPhotoModalSrc(employee.photoUrl!)} />
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-lg truncate" title={employee.userName}>{employee.userName}</p>
                                            <p className="text-sm font-bold" style={{ color: overallMaturity.chartColor }}>Score Geral: {overallPercentage}%</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-auto">
                                        <h4 className="text-sm font-semibold text-gray-400 border-b border-dark-border pb-1">Desempenho por Categoria</h4>
                                        {categories
                                            .filter(c => questions.some(q => q.categoryId === c.id && q.targetRole === UserRole.EMPLOYEE))
                                            .map(cat => {
                                                const catSub = employeeSubs.find(s => s.categoryId === cat.id);
                                                const score = catSub ? catSub.totalScore : 0;
                                                
                                                let maxCategoryScore = 0;
                                                if (catSub) {
                                                    maxCategoryScore = catSub.maxScore;
                                                } else {
                                                    maxCategoryScore = questions
                                                        .filter(q => q.categoryId === cat.id && q.targetRole === UserRole.EMPLOYEE)
                                                        .reduce((sum, q) => {
                                                            const questionMax = q.answers.length > 0 ? Math.max(...q.answers.map(a => a.score)) : 0;
                                                            return sum + questionMax;
                                                        }, 0);
                                                }
                                                
                                                if (maxCategoryScore === 0) return null;

                                                const catPercentage = Math.round((score / maxCategoryScore) * 100);
                                                const catMaturity = getMaturityLevel(score, maxCategoryScore);
                                                
                                                return (
                                                    <div key={cat.id}>
                                                        <div className="flex justify-between text-sm mb-1"><span className="truncate pr-2" title={cat.name}>{cat.name}</span><span className="font-semibold" style={{ color: catMaturity.chartColor }}>{catPercentage}%</span></div>
                                                        <div className="w-full bg-dark-background rounded-full h-2.5"><div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${catPercentage}%`, backgroundColor: catMaturity.chartColor }}></div></div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        
        const submissionsToCompare = userSubmissions.filter(s => s.maxScore > 0);
        if (selectedCategoryId === 'compare-all') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {submissionsToCompare.map(submission => {
                        const maturity = getMaturityLevel(submission.totalScore, submission.maxScore);
                        const percentage = ((submission.totalScore / submission.maxScore) * 100).toFixed(0);
                        const chartData = [{ name: 'Score', value: submission.totalScore }, { name: 'Remaining', value: Math.max(0, submission.maxScore - submission.totalScore) }];
                        return (
                            <div key={submission.id} className="bg-dark-card p-4 rounded-xl shadow-lg border border-dark-border flex flex-col items-center">
                                <h3 className="text-lg font-semibold text-center text-cyan-400 mb-2">{submission.categoryName}</h3>
                                <div style={{ width: '100%', height: 180, position: 'relative' }}>
                                    <ResponsiveContainer><PieChart><Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={70} startAngle={90} endAngle={450} cornerRadius={5}>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={[maturity.chartColor, '#374151'][index]} stroke="none" />)}</Pie></PieChart></ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl sm:text-3xl font-bold">{percentage}%</span><span className="text-xs text-gray-400">{submission.totalScore} / {submission.maxScore} pts</span></div>
                                </div>
                                <div className={`mt-2 text-center font-semibold p-2 rounded-lg w-full ${maturity.color}`}>{maturity.icon} {maturity.level}</div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (selectedSubmission) {
            const currentMaturity = getMaturityLevel(selectedSubmission.totalScore, selectedSubmission.maxScore);
            const chartData = [{ name: 'Pontuação Obtida', value: selectedSubmission.totalScore }, { name: 'Restante', value: Math.max(0, selectedSubmission.maxScore - selectedSubmission.totalScore) }];
            return (
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 bg-dark-card p-4 sm:p-6 rounded-xl shadow-lg border border-dark-border flex flex-col items-center justify-center">
                        <h3 className="text-xl font-semibold mb-4 text-center text-cyan-400">Score: {selectedSubmission.categoryName}</h3>
                        <div style={{ width: '100%', height: 250, position: 'relative' }}>
                             <ResponsiveContainer><PieChart><Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} startAngle={90} endAngle={450} cornerRadius={5} paddingAngle={2}>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={[currentMaturity.chartColor, '#374151'][index]} stroke={'#1F2937'} />)}</Pie></PieChart></ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl sm:text-4xl font-bold text-dark-text">{selectedSubmission.maxScore > 0 ? ((selectedSubmission.totalScore / selectedSubmission.maxScore) * 100).toFixed(0) : 0}%</span><span className="text-sm text-gray-400">{selectedSubmission.totalScore} / {selectedSubmission.maxScore} pts</span></div>
                        </div>
                    </div>
                    <div className="lg:col-span-3 bg-dark-card p-4 sm:p-6 rounded-xl shadow-lg border border-dark-border"><h3 className="text-xl font-semibold mb-4 text-cyan-400">Nível de Maturidade</h3><div className="overflow-x-auto"><table className="w-full text-left min-w-[300px]"><thead><tr className="border-b border-dark-border"><th className="py-2 pr-2 font-semibold">Faixa (%)</th><th className="py-2 px-2 font-semibold">Nível</th></tr></thead><tbody>{maturityLevels.map((level, index) => (<tr key={index} className={`border-b border-dark-border last:border-0 transition-all ${currentMaturity?.level === level.level ? `${level.color} font-bold` : ''}`}><td className="py-3 pr-2">{level.range}</td><td className="py-3 px-2">{level.icon} {level.level}</td></tr>))}</tbody></table></div></div>
                </div>
            );
        }
        return null;
    }

    const renderAnalysisContent = () => {
        const hasAnyAnalysis = filteredCompanyAnalyses.length > 0 || filteredEmployeeAnalyses.length > 0;

        if (!hasAnyAnalysis) {
             return (
                 <div className="text-center py-12 sm:py-16 bg-dark-card rounded-xl shadow-lg border border-dark-border">
                    <p className="text-lg text-gray-400">Nenhuma análise do NeuroMapa encontrada para a seleção atual.</p>
                </div>
            );
        }

        if (currentUser.role === UserRole.ADMIN && selectedUserId === 'all-companies') {
            const groupedByCompany = new Map<string, { company: NeuroAnalysisResult[], employee: NeuroAnalysisResult[] }>();
            filteredCompanyAnalyses.forEach(r => {
                if (!groupedByCompany.has(r.empresa)) groupedByCompany.set(r.empresa, { company: [], employee: [] });
                groupedByCompany.get(r.empresa)!.company.push(r);
            });
            filteredEmployeeAnalyses.forEach(r => {
                if (!groupedByCompany.has(r.empresa)) groupedByCompany.set(r.empresa, { company: [], employee: [] });
                groupedByCompany.get(r.empresa)!.employee.push(r);
            });
            const sortedCompanies = Array.from(groupedByCompany.keys()).sort();

            return (
                <div className="space-y-12">
                    {sortedCompanies.map(companyName => {
                        const analyses = groupedByCompany.get(companyName)!;
                        return (
                            <div key={companyName}>
                                <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-cyan-500">{companyName}</h2>
                                <div className="space-y-8">
                                    {analyses.company.map(analysis => (
                                        <div key={analysis.id} className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl border border-blue-700 text-center">
                                            <h3 className="text-xl font-bold text-white mb-2">Análise da Empresa: {analysis.empresa}</h3>
                                            <p className="text-gray-300 mb-4">Veja o resultado consolidado do NeuroMapa.</p>
                                            <button onClick={() => setViewingAnalysis(analysis)} className="px-6 py-2 font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg shadow-lg hover:from-cyan-300 hover:to-blue-300 transition-all transform hover:scale-105">Ver Análise da Empresa</button>
                                        </div>
                                    ))}
                                    {analyses.employee.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-semibold mb-4 text-cyan-400/80">Análises da Equipe</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {analyses.employee.map(analysis => (
                                                    <div key={analysis.id} className="bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
                                                        <img src={analysis.foto} alt={analysis.nome} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-gray-600" />
                                                        <p className="font-bold text-lg text-dark-text truncate w-full" title={analysis.nome}>{analysis.nome}</p>
                                                        <button onClick={() => setViewingAnalysis(analysis)} className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">Ver Análise</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {filteredCompanyAnalyses.map(analysis => (
                    <div key={analysis.id} className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-xl border border-blue-700 text-center">
                        <h3 className="text-xl font-bold text-white mb-2">Análise da Empresa: {analysis.empresa}</h3>
                        <p className="text-gray-300 mb-4">Veja o resultado consolidado do NeuroMapa para a empresa.</p>
                        <button onClick={() => setViewingAnalysis(analysis)} className="px-6 py-2 font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg shadow-lg hover:from-cyan-300 hover:to-blue-300 transition-all transform hover:scale-105">Ver Análise da Empresa</button>
                    </div>
                ))}
                {filteredEmployeeAnalyses.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold mb-4 text-cyan-400/80">Análises da Equipe</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEmployeeAnalyses.map(analysis => (
                                <div key={analysis.id} className="bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1">
                                    <img src={analysis.foto} alt={analysis.nome} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-gray-600" />
                                    <p className="font-bold text-lg text-dark-text truncate w-full" title={analysis.nome}>{analysis.nome}</p>
                                    <button onClick={() => setViewingAnalysis(analysis)} className="mt-4 w-full px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors">Ver Análise</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const renderCompaniesContent = () => {
        const activeCompanies = users.filter(u => u.role === UserRole.COMPANY && u.status === 'approved');
        const employeeCounts = allEmployees.reduce((acc, employee) => {
            acc[employee.companyName] = (acc[employee.companyName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    
        return (
            <div className="space-y-8">
                <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-dark-border text-center">
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total de Empresas Ativas</p>
                    <p className="text-5xl font-extrabold text-cyan-400 mt-2">{activeCompanies.length}</p>
                </div>
    
                <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-dark-border">
                    <h3 className="text-xl font-semibold mb-4">Lista de Empresas</h3>
                    {activeCompanies.length > 0 ? (
                        <div className="space-y-3">
                            {activeCompanies.map(company => (
                                 <div key={company.id} className="bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="min-w-0">
                                        <p className="font-bold text-lg text-dark-text">{company.companyName}</p>
                                        <p className="text-sm text-gray-400">
                                            {employeeCounts[company.companyName] || 0} funcionário(s)
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setViewingCompany(company)}
                                        className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
                                    >
                                        Ver Funcionários
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-gray-400 py-8">Nenhuma empresa ativa encontrada.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderFuncionariosContent = () => {
        if (!currentUser || currentUser.role !== UserRole.COMPANY) return null;
        const companyEmployees = allEmployees.filter(e => e.companyName === currentUser.companyName);
    
        return (
            <div className="space-y-8">
                <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-dark-border text-center">
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total de Funcionários</p>
                    <p className="text-5xl font-extrabold text-cyan-400 mt-2">{companyEmployees.length}</p>
                </div>
    
                <div className="bg-dark-card p-6 rounded-xl shadow-lg border border-dark-border">
                    <h3 className="text-xl font-semibold mb-4">Lista de Funcionários</h3>
                    {companyEmployees.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {companyEmployees.map(employee => (
                                <div key={employee.id} className="bg-dark-background p-4 rounded-lg border border-dark-border flex flex-col items-center text-center">
                                    <img 
                                        src={employee.photoUrl || 'https://edrrnawrhfhoynpiwqsc.supabase.co/storage/v1/object/public/imagenscientes/Imagens%20Score%20Inteligente/icon%20user.png'} 
                                        alt={employee.name} 
                                        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-600 cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => employee.photoUrl && setPhotoModalSrc(employee.photoUrl)}
                                    />
                                    <p className="font-bold text-lg text-dark-text truncate w-full" title={employee.name}>{employee.name}</p>
                                    <p className="text-sm text-cyan-400 mb-2">{employee.position || 'Cargo não informado'}</p>
                                    <div className="text-xs text-gray-400 space-y-1 text-left w-full border-t border-dark-border pt-3 mt-2">
                                        <p className="truncate"><strong>Email:</strong> {employee.email}</p>
                                        <p><strong>Telefone:</strong> {employee.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-center text-gray-400 py-8">Nenhum funcionário cadastrado para sua empresa.</p>
                    )}
                </div>
            </div>
        );
    };

    if (!currentUser) return null;

    if (!hasAnySubmissions) {
        return (
            <div className="text-center py-12 sm:py-16 bg-dark-card rounded-xl shadow-lg border border-dark-border max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Bem-vindo(a) ao Score Inteligente!</h2>
                <p className="text-lg text-gray-400 mb-6">
                    Para visualizar seu painel de resultados, você precisa primeiro responder aos questionários.
                </p>
                <button 
                    onClick={() => window.location.hash = '#questionnaire'} 
                    className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                    Iniciar Questionários
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <EmployeeOralTestModal isOpen={isOralTestModalOpen} onClose={() => setIsOralTestModalOpen(false)} />
            <CompanyOralTestResultsModal 
                isOpen={isCompanyOralTestResultsModalOpen}
                onClose={() => setIsCompanyOralTestResultsModalOpen(false)}
                onViewResult={(result) => setViewingResult(result)}
            />
            <AnalysisResultModal analysis={viewingAnalysis} onClose={() => setViewingAnalysis(null)} />
            <ResultDetailModal result={viewingResult} onClose={() => setViewingResult(null)} />
            <CompanyDetailModal 
                company={viewingCompany} 
                employees={allEmployees} 
                onClose={() => setViewingCompany(null)} 
                onPhotoClick={setPhotoModalSrc} 
            />
            {photoModalSrc && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 cursor-pointer" onClick={() => setPhotoModalSrc(null)}>
                    <img src={photoModalSrc} alt="Visualização ampliada" className="max-w-full max-h-full object-contain rounded-lg" />
                    <button onClick={() => setPhotoModalSrc(null)} className="absolute top-4 right-4 text-white text-3xl font-bold" aria-label="Fechar imagem">&times;</button>
                </div>
            )}
            
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Painel de Resultados</h1>
                    {selectedEmployeeInfo && viewType === 'employee' && activeTab === 'scores' && (
                        <div className="flex items-center gap-3 mt-2">
                            {selectedEmployeeInfo.photoUrl && <img src={selectedEmployeeInfo.photoUrl} alt="Foto do funcionário" className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-cyan-400" onClick={() => setPhotoModalSrc(selectedEmployeeInfo.photoUrl!)} />}
                            <div>
                                <span className="text-lg text-gray-300">{selectedEmployeeInfo.name}</span>
                                {currentUser.role === UserRole.ADMIN && selectedEmployeeId !== 'all-employees' && selectedEmployeeInfo.companyName && <p className="text-sm text-gray-400">{selectedEmployeeInfo.companyName}</p>}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-2">
                    {currentUser.role === UserRole.EMPLOYEE && (
                        <button
                            onClick={() => setIsOralTestModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-dark-action rounded-lg hover:bg-dark-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-background focus:ring-dark-accent"
                        >
                            <MicrophoneIcon className="h-5 w-5" />
                            <span>Prova Oral</span>
                        </button>
                    )}
                    {currentUser.role === UserRole.COMPANY && (
                         <button
                            onClick={() => setIsCompanyOralTestResultsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-dark-action rounded-lg hover:bg-dark-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-background focus:ring-dark-accent"
                        >
                            <DocumentTextIcon className="h-5 w-5" />
                            <span>Resultados Prova Oral</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-8 flex flex-wrap border-b border-dark-border">
                <button onClick={() => setActiveTab('scores')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'scores' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Scores</button>
                <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Análises NeuroMapa</button>
                {currentUser.role === UserRole.ADMIN && (
                    <button onClick={() => setActiveTab('companies')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'companies' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Empresas</button>
                )}
                {currentUser.role === UserRole.COMPANY && (
                    <button onClick={() => setActiveTab('funcionarios')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'funcionarios' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-gray-400 hover:text-white'}`}>Funcionários</button>
                )}
            </div>
            
            {activeTab === 'scores' && (
                <div className="space-y-8">
                     <div className="flex flex-wrap items-center gap-4 p-4 bg-dark-card rounded-xl border border-dark-border">
                        {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COMPANY) && (
                             <div className="flex items-center bg-dark-background p-1 rounded-full border border-dark-border">
                                <button onClick={() => setViewType('corporate')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${viewType === 'corporate' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Corporativo</button>
                                <button onClick={() => setViewType('employee')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${viewType === 'employee' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Funcionários</button>
                            </div>
                        )}
                        {currentUser.role === UserRole.ADMIN && (
                            <div className="flex items-center gap-2"><label htmlFor="company-select" className="text-sm font-medium shrink-0">Empresa:</label><select id="company-select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="p-2 border border-dark-border rounded-lg bg-dark-background focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all-companies">Todas as Empresas</option>{companyList.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}</select></div>
                        )}
                        {viewType === 'employee' && employeeList.length > 0 && (
                            <div className="flex items-center gap-2"><label htmlFor="employee-select" className="text-sm font-medium shrink-0">Funcionário:</label><select id="employee-select" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="p-2 border border-dark-border rounded-lg bg-dark-background focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all-employees">Visão Geral da Equipe</option>{employeeList.map(e => <option key={e.userId} value={e.userId}>{e.userName}</option>)}</select></div>
                        )}
                        {completedCategories.length > 0 && selectedEmployeeId !== 'all-employees' && (
                             <div className="flex items-center gap-2"><label htmlFor="category-select" className="text-sm font-medium shrink-0">Análise:</label><select id="category-select" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="p-2 border border-dark-border rounded-lg bg-dark-background focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="" disabled>-- Selecione --</option>{completedCategories.length > 1 && <option value="compare-all">Visão Comparativa</option>}<option value="all-categories">Resultado Geral</option>{completedCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        )}
                    </div>
                    {renderScoresContent()}
                </div>
            )}

            {activeTab === 'analysis' && (
                 <div className="space-y-8">
                    {currentUser.role === UserRole.ADMIN && (
                         <div className="flex flex-wrap items-center gap-4 p-4 bg-dark-card rounded-xl border border-dark-border">
                            <div className="flex items-center gap-2">
                                <label htmlFor="company-analysis-select" className="text-sm font-medium shrink-0">Empresa:</label>
                                <select
                                    id="company-analysis-select"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="p-2 border border-dark-border rounded-lg bg-dark-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all-companies">Todas as Empresas</option>
                                    {companyList.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                                </select>
                            </div>
                             {selectedUserId !== 'all-companies' && companyList.find(c => c.id === selectedUserId) && (
                                <>
                                    <div className="flex items-center bg-dark-background p-1 rounded-full border border-dark-border">
                                        <button onClick={() => setAnalysisViewType('company')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${analysisViewType === 'company' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Empresa</button>
                                        <button onClick={() => setAnalysisViewType('employee')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${analysisViewType === 'employee' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Funcionários</button>
                                    </div>
                                    {analysisViewType === 'employee' && analysisEmployeeList.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="employee-analysis-select" className="text-sm font-medium shrink-0">Funcionário:</label>
                                            <select
                                                id="employee-analysis-select"
                                                value={selectedEmployeeAnalysisId}
                                                onChange={(e) => setSelectedEmployeeAnalysisId(e.target.value)}
                                                className="p-2 border border-dark-border rounded-lg bg-dark-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">Todos os Funcionários</option>
                                                {analysisEmployeeList.map(e => <option key={e.email} value={e.email}>{e.name}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {renderAnalysisContent()}
                </div>
            )}
            {activeTab === 'companies' && currentUser.role === UserRole.ADMIN && (
                renderCompaniesContent()
            )}
            {activeTab === 'funcionarios' && currentUser.role === UserRole.COMPANY && (
                renderFuncionariosContent()
            )}
        </div>
    );
};

export default DashboardPage;
