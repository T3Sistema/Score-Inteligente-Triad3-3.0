import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Category, Question, Submission, UserStatus, UserRole, LogEntry, LogType, AnswerOption, NeuroQuestion, NeuroCategory, NeuroCategoryTarget, NeuroSubmission, NeuroAnalysisResult, OralTestResult } from '../types';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_QUESTIONS } from '../constants';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://aisfizoyfpcisykarrnt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpc2Zpem95ZnBjaXN5a2Fycm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzcwMzgsImV4cCI6MjA2NTQ1MzAzOH0.UaFAu4KGFLqyJH3eNVteqYDreGRcX5ZpOB3mXz7_GMY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AppContextType {
  currentUser: User | null;
  users: User[];
  allEmployees: User[];
  categories: Category[];
  questions: Question[];
  submissions: Submission[];
  employeeSubmissions: Submission[];
  logs: LogEntry[];
  loading: boolean;
  neuroQuestions: NeuroQuestion[];
  neuroCategories: NeuroCategory[];
  neuroSubmissions: NeuroSubmission[];
  neuroAnalysisResults: NeuroAnalysisResult[];
  companyNeuroAnalysisResults: NeuroAnalysisResult[];
  oralTestResults: OralTestResult[];
  login: (email: string, password: string, isAdminLogin: boolean, loginType?: 'company' | 'employee') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, companyName: string, email: string, password: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  registerEmployee: (name: string, phone: string, email: string, password: string, companyCode: string, photo: string) => Promise<{ success: boolean; message?: string; }>;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  approveUser: (userToApprove: User) => Promise<{ success: boolean; message?: string }>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (category: Category, newName: string) => Promise<{ success: boolean; message?: string }>;
  deleteCategory: (category: Category) => Promise<{ success: boolean; message?: string }>;
  addQuestion: (categoryId: string, text: string, answers: { text: string; score: number }[], targetRole: UserRole.COMPANY | UserRole.EMPLOYEE) => Promise<void>;
  updateQuestion: (question: Question) => Promise<{ success: boolean; message?: string }>;
  deleteQuestion: (question: Question) => Promise<{ success: boolean; message?: string }>;
  addSubmission: (submission: Omit<Submission, 'id' | 'date'>) => Promise<void>;
  addAdmin: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  updateAdmin: (originalUser: User, updates: { name?: string; email?: string; phone?: string; password?: string }) => Promise<{ success: boolean; message: string }>;
  deleteAdmin: (userToDelete: User) => Promise<{ success: boolean; message: string }>;
  changePassword: (user: User, currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string; }>;
  changeAdminPassword: (userId: string, email: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string; }>;
  fetchAdminQuestionnaireData: () => Promise<void>;
  fetchPendingUsers: () => Promise<void>;
  fetchApprovedUsersLogs: () => Promise<void>;
  fetchLoginLogs: () => Promise<void>;
  fetchSubmissions: () => Promise<void>;
  fetchEmployeeScoresForAdmin: () => Promise<void>;
  fetchAllEmployees: () => Promise<void>;
  fetchNeuroData: () => Promise<void>;
  addNeuroMapaSubmission: (submission: Omit<NeuroSubmission, 'id' | 'date'>) => Promise<{ success: boolean; result?: string; message?: string }>;
  fetchNeuroSubmissions: () => Promise<void>;
  fetchNeuroAnalysisResults: () => Promise<void>;
  fetchCompanyNeuroAnalysisResults: () => Promise<void>;
  fetchOralTestResults: () => Promise<void>;
  startOralTest: (payload: any) => Promise<{ success: boolean; message?: string; }>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [allEmployees, setAllEmployees] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [employeeSubmissions, setEmployeeSubmissions] = useState<Submission[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [neuroQuestions, setNeuroQuestions] = useState<NeuroQuestion[]>([]);
  const [neuroCategories, setNeuroCategories] = useState<NeuroCategory[]>([]);
  const [neuroSubmissions, setNeuroSubmissions] = useState<NeuroSubmission[]>([]);
  const [neuroAnalysisResults, setNeuroAnalysisResults] = useState<NeuroAnalysisResult[]>([]);
  const [companyNeuroAnalysisResults, setCompanyNeuroAnalysisResults] = useState<NeuroAnalysisResult[]>([]);
  const [oralTestResults, setOralTestResults] = useState<OralTestResult[]>([]);


  useEffect(() => {
    // Simulate loading from a DB like NOCODB
    setUsers(INITIAL_USERS);
    setCategories(INITIAL_CATEGORIES);
    setQuestions(INITIAL_QUESTIONS);
    
    // Add a default submission for demo purposes
    const initialSubmissions: Submission[] = [
        {
            id: 'sub-initial-1',
            userId: 'company-2-approved',
            companyName: 'Soluções Tech',
            categoryId: 'cat-atendimento',
            categoryName: 'Atendimento ao Cliente',
            answers: [], // Not needed for dashboard view
            totalScore: 42,
            maxScore: 50,
            date: new Date().toISOString()
        }
    ];
    setSubmissions(initialSubmissions);

    const initialLogs: LogEntry[] = [
      {
          id: 'log-initial-1',
          timestamp: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          type: LogType.QUESTIONNAIRE_SUBMISSION,
          message: `Questionário "Atendimento ao Cliente" foi enviado por Soluções Tech.`,
      }
    ];
    setLogs(initialLogs);

    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
        setCurrentUser(JSON.parse(loggedInUser));
    }

    setLoading(false);
  }, []);
  
  const addLogEntry = useCallback((type: LogType, message: string, adminDetails?: { id: string; name: string }) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      adminId: adminDetails?.id,
      adminName: adminDetails?.name,
    };
    setLogs(prev => [newLog, ...prev]);
  }, []);

  const login = useCallback(async (email: string, password: string, isAdminLogin: boolean, loginType: 'company' | 'employee' = 'company'): Promise<{ success: boolean; message?: string }> => {
    if (isAdminLogin) {
      try {
        const response = await fetch('https://webhook.triad3.io/webhook/loginadmscoretriad3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Sejá bem-vind@") {
          const loggedInUser: User = {
            id: `admin-${email}`,
            name: data.nome,
            email: email,
            companyName: 'Triad3',
            role: UserRole.ADMIN,
            status: UserStatus.APPROVED,
            phone: '',
            passwordHash: '',
          };
          setCurrentUser(loggedInUser);
          localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
          return { success: true };
        } else {
          return { success: false, message: data.resposta || "Usuário ou senha incorretos." };
        }
      } catch (error) {
        console.error('Admin login API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação ao tentar fazer login." };
      }
    } else {
        const isEmployee = loginType === 'employee';
        const endpoint = isEmployee 
            ? 'https://webhook.triad3.io/webhook/funcionariosloginscore'
            : 'https://webhook.triad3.io/webhook/loginusuarioscoretriad3';
        
        const errorSource = isEmployee ? 'Employee' : 'User';
        const genericErrorMessage = isEmployee
            ? "Ocorreu um erro de comunicação ao tentar fazer login como funcionário."
            : "Ocorreu um erro de comunicação ao tentar fazer login.";
        const invalidCredentialsMessage = isEmployee
            ? "Credenciais de funcionário inválidas ou conta não aprovada."
            : "Credenciais inválidas ou conta não aprovada.";

      try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Sejá bem-vind@") {
            const loggedInUser: User = {
                id: isEmployee ? `employee-${email}` :`user-${email}`,
                name: data.nome,
                email: email,
                companyName: data.empresa,
                phone: data.telefone,
                role: isEmployee ? UserRole.EMPLOYEE : UserRole.COMPANY,
                status: UserStatus.APPROVED,
                passwordHash: '',
                photoUrl: data.foto,
                position: data.cargo,
            };
            setCurrentUser(loggedInUser);
            setUsers(prev => {
                const otherUsers = prev.filter(u => u.id !== loggedInUser.id);
                return [...otherUsers, loggedInUser];
            });
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            return { success: true };
        } else {
            return { success: false, message: data.resposta || invalidCredentialsMessage };
        }
    } catch (error) {
        console.error(`${errorSource} login API error:`, error);
        return { success: false, message: genericErrorMessage };
    }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.location.hash = '#login';
  }, []);
  
  const register = useCallback(async (name: string, companyName: string, email: string, password: string, phone: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/criacaocontascoreuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: name,
                nome_empresa: companyName,
                email: email,
                senha: password,
                telefone: phone,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Still add the user to local state for the admin approval flow
            const newUser: User = {
                id: `user-${Date.now()}`,
                name,
                companyName,
                email,
                phone,
                passwordHash: password,
                role: UserRole.COMPANY,
                status: UserStatus.PENDING,
            };
            setUsers(prev => [...prev, newUser]);
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || "Ocorreu um erro durante o cadastro." };
        }
    } catch (error) {
        console.error('Registration API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação. Tente novamente." };
    }
  }, []);

  const registerEmployee = useCallback(async (name: string, phone: string, email: string, password: string, companyCode: string, photo: string): Promise<{ success: boolean; message?: string; }> => {
    try {
      // 1. Upload photo to Supabase
      if (!photo.startsWith('data:image/')) {
        throw new Error('Formato de foto inválido. Apenas data URLs são aceitas.');
      }

      // Convert data URL to Blob
      const base64Response = await fetch(photo);
      const photoBlob = await base64Response.blob();

      // Generate a unique file path
      const fileExtension = photoBlob.type.split('/')[1] || 'jpg';
      const filePath = `funcionarios/${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('scoreinteligentetriad3')
        .upload(filePath, photoBlob, {
          contentType: photoBlob.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Falha ao carregar a foto: ${uploadError.message}`);
      }

      // 2. Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('scoreinteligentetriad3')
        .getPublicUrl(uploadData.path);
      
      const imageUrl = urlData.publicUrl;

      // 3. Send registration data to the new webhook
      const response = await fetch('https://webhook.triad3.io/webhook/criarfuncionarioscoreuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: name,
          telefone: phone,
          email: email,
          senha: password,
          codigo_empresa: companyCode,
          foto: imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.resposta };
      } else {
        return { success: false, message: data.resposta || "Ocorreu um erro durante o cadastro." };
      }
    } catch (error) {
      console.error('Employee Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      return { success: false, message: `Ocorreu um erro: ${errorMessage}` };
    }
  }, []);

  const updateUserStatus = useCallback((userId: string, status: UserStatus) => {
    // Log entries for approvals are now handled by fetching from the API
    setUsers(prevUsers => prevUsers.map(user => (user.id === userId ? { ...user, status } : user)));
  }, []);
  
  const approveUser = useCallback(async (userToApprove: User): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return { success: false, message: "Apenas administradores podem aprovar usuários." };
    }

    // Logic for employee approval
    if (userToApprove.role === UserRole.EMPLOYEE) {
        try {
            const payload: any = {
                nome: userToApprove.name,
                empresa: userToApprove.companyName,
                email: userToApprove.email,
                telefone: userToApprove.phone,
                senha: userToApprove.passwordHash,
                nome_adm: currentUser.name,
                email_adm: currentUser.email,
            };

            const userIdMatch = userToApprove.id.match(/^api-user-(\d+)$/);
            if (userIdMatch && userIdMatch[1]) {
                payload.id = userIdMatch[1];
            }

            const response = await fetch('https://webhook.triad3.io/webhook/aceitarnovofuncionarioscore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.resposta === "Usuário cadastrado com sucesso!") {
                updateUserStatus(userToApprove.id, UserStatus.APPROVED);
                return { success: true, message: data.resposta };
            } else {
                return { success: false, message: data.resposta || "A API retornou uma resposta inesperada para a aprovação de funcionário." };
            }
        } catch (error) {
            console.error('Approve employee API error:', error);
            return { success: false, message: "Ocorreu um erro de comunicação ao tentar aprovar o funcionário." };
        }
    } else { // Existing logic for company approval
        try {
            const payload: any = {
                nome: userToApprove.name,
                empresa: userToApprove.companyName,
                email: userToApprove.email,
                telefone: userToApprove.phone,
                senha: userToApprove.passwordHash,
                nome_adm: currentUser.name,
                email_adm: currentUser.email,
            };

            const userIdMatch = userToApprove.id.match(/^api-user-(\d+)$/);
            if (userIdMatch && userIdMatch[1]) {
                payload.id = userIdMatch[1];
            }

            const response = await fetch('https://webhook.triad3.io/webhook/aceitarnovouserscore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.resposta === "Usuário cadastrado com sucesso!") {
                updateUserStatus(userToApprove.id, UserStatus.APPROVED);
                return { success: true, message: data.resposta };
            } else {
                return { success: false, message: data.resposta || "A API retornou uma resposta inesperada." };
            }
        } catch (error) {
            console.error('Approve user API error:', error);
            return { success: false, message: "Ocorreu um erro de comunicação ao tentar aprovar o usuário." };
        }
    }
  }, [currentUser, updateUserStatus]);

  const fetchPendingUsers = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/puxarnovosuserscore');
        if (!response.ok) {
            console.error('Falha ao buscar usuários pendentes da API. Status:', response.status);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : []; // Handle empty response

        if (Array.isArray(data)) {
            const apiPendingUsers: User[] = data.map((apiUser: any) => ({
                id: `api-user-${apiUser.id}`,
                name: apiUser.nome,
                companyName: apiUser.empresa,
                email: apiUser.email,
                phone: apiUser.telefone,
                passwordHash: '', 
                // Determine role based on the new 'status' field from the API
                role: apiUser.status === 'Funcionário' ? UserRole.EMPLOYEE : UserRole.COMPANY,
                status: UserStatus.PENDING,
            }));

            setUsers(prevUsers => {
                const nonPendingUsers = prevUsers.filter(u => u.status !== UserStatus.PENDING);
                const localPendingUsers = prevUsers.filter(u => u.status === UserStatus.PENDING && !u.id.startsWith('api-user-'));

                const mergedApiUsers = apiPendingUsers.map(apiUser => {
                    const localMatch = localPendingUsers.find(localUser => localUser.email === apiUser.email);
                    if (localMatch && localMatch.passwordHash) {
                        return { ...apiUser, passwordHash: localMatch.passwordHash };
                    }
                    return apiUser;
                });
                
                // Keep local pending users that were not in the API response (e.g. just registered)
                const newLocalPendingUsers = localPendingUsers.filter(localUser => 
                    !apiPendingUsers.some(apiUser => apiUser.email === localUser.email)
                );

                return [...nonPendingUsers, ...mergedApiUsers, ...newLocalPendingUsers];
            });
        } else {
             console.error('API para buscar usuários pendentes não retornou um array. Resposta:', data);
        }
    } catch (error) {
        console.error('Erro ao processar busca de usuários pendentes da API:', error);
    }
  }, []);

  const fetchApprovedUsersLogs = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/puxaruseraprovadoscore');
        if (!response.ok) {
            console.error('Falha ao buscar logs de aprovação da API. Status:', response.status);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : []; // Handle empty response

        if (Array.isArray(data)) {
            const approvalLogs: LogEntry[] = data.map((apiLog: any) => {
                const [day, month, year] = apiLog.data.split('/');
                // Create a date object that is timezone-aware to prevent off-by-one day errors.
                const timestamp = new Date(`${year}-${month}-${day}T${apiLog.horario}:00`).toISOString();
                
                return {
                    id: `log-approved-${apiLog.id}`,
                    timestamp,
                    type: LogType.USER_APPROVAL,
                    message: `Usuário "${apiLog.nome}" da empresa "${apiLog.empresa}" foi aprovado.`,
                    adminName: apiLog.aprovado_por,
                };
            });
            
            // Replace existing approval logs with fresh data from the API, keeping other log types.
            setLogs(prevLogs => [
                ...approvalLogs,
                ...prevLogs.filter(log => log.type !== LogType.USER_APPROVAL)
            ]);

        } else {
            console.error('API para buscar logs de aprovação não retornou um array. Resposta:', data);
        }
    } catch (error) {
        console.error('Erro ao processar busca de logs de aprovação da API:', error);
    }
  }, []);

  const fetchLoginLogs = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/puxarlogscore');
        if (!response.ok) {
            console.error('Falha ao buscar logs de login da API. Status:', response.status);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        if (Array.isArray(data)) {
            const loginLogs: LogEntry[] = data.map((apiLog: any) => {
                const [day, month, year] = apiLog.data.split('/');
                const timestamp = new Date(`${year}-${month}-${day}T${apiLog.horario}:00`).toISOString();
                
                return {
                    id: `log-login-${apiLog.id}`,
                    timestamp,
                    type: LogType.USER_LOGIN,
                    message: `Usuário "${apiLog.nome}" da empresa "${apiLog.empresa}" fez login.`,
                };
            });
            
            // Replace existing login logs with fresh data from the API
            setLogs(prevLogs => [
                ...loginLogs,
                ...prevLogs.filter(log => log.type !== LogType.USER_LOGIN)
            ]);

        } else {
            console.error('API para buscar logs de login não retornou um array. Resposta:', data);
        }
    } catch (error) {
        console.error('Erro ao processar busca de logs de login da API:', error);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    if (!categories.length || !questions.length) {
        console.warn("Pré-requisitos (categorias, perguntas) ainda não atendidos para buscar submissões.");
        return;
    }
    if (!currentUser) return;

    if (currentUser.role === UserRole.EMPLOYEE) {
        try {
            const response = await fetch('https://webhook.triad3.io/webhook/pontosfuncionariosscore');
            if (!response.ok) throw new Error(`Falha ao buscar scores de funcionário da API. Status: ${response.status}`);
            
            const text = await response.text();
            const apiData = text ? JSON.parse(text) : [];
            if (!Array.isArray(apiData)) throw new Error('API de scores de funcionário não retornou um array.');

            const userScores = apiData.filter((item: any) =>
                item.telefone === currentUser.phone && item.nome === currentUser.name
            );

            const userSubmissions: Submission[] = userScores.map((item: any) => {
                const category = categories.find(c => c.name === item.categoria);
                if (!category) {
                    console.warn(`Categoria "${item.categoria}" não encontrada para a submissão do funcionário.`);
                    return null;
                }

                const questionsForCategory = questions.filter(q => q.categoryId === category.id && q.targetRole === UserRole.EMPLOYEE);
                const maxScore = questionsForCategory.reduce((sum, q) => {
                   const questionMaxScore = q.answers.length > 0 ? Math.max(...q.answers.map(a => a.score)) : 0;
                   return sum + questionMaxScore;
                }, 0);

                return {
                   id: `sub-employee-${currentUser.id}-${category.id}-${item.id}`,
                   userId: currentUser.id,
                   companyName: currentUser.companyName,
                   categoryId: category.id,
                   categoryName: category.name,
                   answers: [],
                   totalScore: item.pontos,
                   maxScore: maxScore,
                   date: new Date().toISOString(),
                };
            }).filter((s): s is Submission => s !== null);
            
            setSubmissions(userSubmissions);
        } catch (error) {
            console.error('Erro ao processar busca de scores de funcionário da API:', error);
            setSubmissions([]);
        }
    } else {
        // Existing logic for Admin and Company
        try {
            const response = await fetch('https://webhook.triad3.io/webhook/buscarnotasuserscore');
            if (!response.ok) {
                throw new Error(`Falha ao buscar scores da API. Status: ${response.status}`);
            }
            const text = await response.text();
            const apiData = text ? JSON.parse(text) : [];

            if (!Array.isArray(apiData)) {
                console.error('API de busca de scores não retornou um array. Resposta:', apiData);
                setSubmissions([]);
                return;
            }

            if (currentUser?.role === UserRole.ADMIN) {
                // Admin Logic: Aggregate scores by company
                const companyDataMap = new Map<string, any>();
                apiData.forEach(item => {
                    if (!companyDataMap.has(item.empresa)) {
                        companyDataMap.set(item.empresa, item);
                    }
                });

                const newCompanyUsers: User[] = Array.from(companyDataMap.values()).map((item: any, index: number) => ({
                    id: `company-api-${item.empresa.replace(/\s+/g, '-')}-${index}`,
                    name: item.nome,
                    companyName: item.empresa,
                    email: `${item.empresa.toLowerCase().replace(/\s/g, '')}@placeholder.com`,
                    phone: item.telefone,
                    passwordHash: '',
                    role: UserRole.COMPANY,
                    status: UserStatus.APPROVED,
                }));
                
                setUsers(prevUsers => [
                    ...prevUsers.filter(u => u.status !== UserStatus.APPROVED || u.role === UserRole.ADMIN),
                    ...newCompanyUsers
                ]);
                
                const groupedSubmissions = new Map<string, { totalScore: number; count: number; items: any[] }>();
                apiData.forEach((item: any) => {
                    const key = `${item.empresa}__${item.categoria}`;
                    if (!groupedSubmissions.has(key)) {
                        groupedSubmissions.set(key, { totalScore: 0, count: 0, items: [] });
                    }
                    const group = groupedSubmissions.get(key)!;
                    group.totalScore += item.pontos;
                    group.count += 1;
                    group.items.push(item);
                });
                
                const aggregatedSubmissions: Submission[] = [];
                for (const [key, group] of groupedSubmissions.entries()) {
                    const [companyName, categoryName] = key.split('__');
                    
                    const user = newCompanyUsers.find(u => u.companyName === companyName);
                    const category = categories.find(c => c.name === categoryName);

                    if (!user || !category) {
                        console.warn(`Não foi possível encontrar usuário para a empresa "${companyName}" ou categoria "${categoryName}". A submissão agregada será ignorada.`);
                        continue;
                    }

                    const questionsForCategory = questions.filter(q => q.categoryId === category.id);
                    const categoryMaxScore = questionsForCategory.reduce((sum, q) => {
                        const questionMaxScore = q.answers.length > 0 ? Math.max(...q.answers.map(a => a.score)) : 0;
                        return sum + questionMaxScore;
                    }, 0);
                    
                    const totalMaxScoreForGroup = categoryMaxScore > 0 ? (categoryMaxScore * group.count) : 0;
                    if (totalMaxScoreForGroup === 0 && group.totalScore > 0) {
                         console.warn(`Pontuação máxima para a categoria "${categoryName}" é zero, mas a pontuação total é ${group.totalScore}. Verifique as perguntas e pontuações.`);
                    }
                    
                    const detailedAnswers = group.items.map((i: any) => i.pergunta_resposta).filter(Boolean).join(' | ');

                    aggregatedSubmissions.push({
                        id: `sub-agg-${companyName.replace(/\s+/g, '-')}-${category.id}`,
                        userId: user.id,
                        companyName: companyName,
                        categoryId: category.id,
                        categoryName: categoryName,
                        answers: [],
                        totalScore: group.totalScore,
                        maxScore: totalMaxScoreForGroup,
                        date: new Date().toISOString(),
                        detailedAnswers,
                    });
                }
                setSubmissions(aggregatedSubmissions);
            } else if (currentUser?.role === UserRole.COMPANY) {
                // Company User Logic: Show only their own scores, not aggregated.
                const userScores = apiData.filter((item: any) =>
                    item.telefone === currentUser.phone && item.empresa === currentUser.companyName
                );

                const userSubmissions: Submission[] = userScores.map((item: any): Submission | null => {
                    const category = categories.find(c => c.name === item.categoria);
                    if (!category) {
                        console.warn(`Categoria "${item.categoria}" não encontrada para a submissão do usuário.`);
                        return null;
                    }

                    const questionsForCategory = questions.filter(q => q.categoryId === category.id);
                    const maxScore = questionsForCategory.reduce((sum, q) => {
                       const questionMaxScore = q.answers.length > 0 ? Math.max(...q.answers.map(a => a.score)) : 0;
                       return sum + questionMaxScore;
                    }, 0);

                    return {
                       id: `sub-user-${currentUser.id}-${category.id}-${item.id}`,
                       userId: currentUser.id,
                       companyName: currentUser.companyName,
                       categoryId: category.id,
                       categoryName: category.name,
                       answers: [],
                       totalScore: item.pontos,
                       maxScore: maxScore,
                       date: new Date().toISOString(),
                       detailedAnswers: item.pergunta_resposta,
                    };
                }).filter((s): s is Submission => s !== null);

                setSubmissions(userSubmissions);
            } else {
                // No user or unknown role, clear submissions
                setSubmissions([]);
            }
        } catch (error) {
            console.error('Erro ao processar busca de scores da API:', error);
            // Only clear users if it was an admin fetch that failed
            if (currentUser?.role === UserRole.ADMIN) {
                setUsers(prevUsers => prevUsers.filter(u => u.status !== UserStatus.APPROVED || u.role === UserRole.ADMIN));
            }
            setSubmissions([]);
        }
    }
  }, [categories, questions, currentUser]);

  const fetchEmployeeScoresForAdmin = useCallback(async () => {
    if (!categories.length || !questions.length) {
        console.warn("Pré-requisitos (categorias, perguntas) não atendidos para buscar submissões de funcionários.");
        return;
    }

    try {
        const response = await fetch('https://webhook.triad3.io/webhook/pegarrespostasfuncionariosscore');
        if (!response.ok) {
            throw new Error(`Falha ao buscar scores de funcionários da API. Status: ${response.status}`);
        }
        const text = await response.text();
        const apiData = text ? JSON.parse(text) : [];

        if (!Array.isArray(apiData)) {
            console.error('API de scores de funcionários não retornou um array. Resposta:', apiData);
            setEmployeeSubmissions([]);
            return;
        }

        const employeeSubs: Submission[] = apiData.map((item: any): Submission | null => {
            const category = categories.find(c => c.name === item.categoria);
            if (!category) {
                console.warn(`Categoria "${item.categoria}" não encontrada para a submissão do funcionário.`);
                return null;
            }

            const questionsForCategory = questions.filter(q => q.categoryId === category.id && q.targetRole === UserRole.EMPLOYEE);
            const maxScore = questionsForCategory.reduce((sum, q) => {
               const questionMaxScore = q.answers.length > 0 ? Math.max(...q.answers.map(a => a.score)) : 0;
               return sum + questionMaxScore;
            }, 0);

            let detailedAnswersData: any = item.pergunta_resposta;
            let answersData: { questionId: string; score: number }[] = [];

            if (item.pergunta_resposta && typeof item.pergunta_resposta === 'string' && item.pergunta_resposta.startsWith('[')) {
                try {
                    const parsed = JSON.parse(item.pergunta_resposta);
                    if (Array.isArray(parsed)) {
                        detailedAnswersData = parsed;
                        answersData = parsed.map((ans: any) => ({
                            questionId: ans.questionId || '',
                            score: ans.score || 0
                        }));
                    }
                } catch (e) {
                    // Not a valid JSON array string, keep it as is.
                }
            }

            return {
               id: `sub-emp-${item.id}`,
               userId: `employee-${item.telefone}-${item.nome}`,
               userName: item.nome,
               companyName: item.empresa,
               categoryId: category.id,
               categoryName: category.name,
               answers: answersData,
               totalScore: item.pontos,
               maxScore: maxScore,
               date: new Date().toISOString(),
               detailedAnswers: detailedAnswersData,
               photoUrl: item.foto,
               phone: item.telefone,
            };
        }).filter((s): s is Submission => s !== null);

        setEmployeeSubmissions(employeeSubs);
    } catch (error) {
        console.error('Erro ao processar busca de scores de funcionários da API:', error);
        setEmployeeSubmissions([]);
    }
  }, [categories, questions]);

  const fetchAllEmployees = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/busfuncntodos');
        if (!response.ok) throw new Error('Falha ao buscar todos os funcionários.');
        const text = await response.text();
        const apiData = text ? JSON.parse(text) : [];
        const mappedEmployees: User[] = Array.isArray(apiData)
            ? apiData.map((apiUser: any) => ({
                id: `employee-api-${apiUser.id}`, 
                name: apiUser.nome, 
                companyName: apiUser.empresa, 
                email: apiUser.email,
                phone: apiUser.telefone, 
                passwordHash: '', 
                role: UserRole.EMPLOYEE, 
                status: UserStatus.APPROVED, 
                photoUrl: apiUser.foto,
            })) 
            : [];
        setAllEmployees(mappedEmployees);
    } catch (error) {
        console.error('Error fetching all employees:', error);
        setAllEmployees([]);
    }
  }, []);

  const fetchAdminQuestionnaireData = useCallback(async () => {
    if (!currentUser) {
        setQuestions([]);
        setCategories([]);
        return;
    }

    // Helper function to process API data into questions
    const processQuestionsData = (
        apiData: any[], 
        targetRole: UserRole.COMPANY | UserRole.EMPLOYEE, 
        categoryMap: Map<string, string>
    ): Question[] => {
        if (!Array.isArray(apiData)) return [];
        return apiData.map((apiQuestion: any) => {
            const categoryId = categoryMap.get(apiQuestion.categoria);
            if (!categoryId) return null;
            
            const answers: AnswerOption[] = (apiQuestion.respostas || []).map((apiAnswer: any, index: number) => ({
                id: `ans-api-${apiQuestion.id}-${index}`,
                text: apiAnswer.texto,
                score: apiAnswer.pontos
            }));

            return {
                id: `q-api-${targetRole}-${apiQuestion.id}`, // Make ID unique per role
                categoryId: categoryId,
                text: apiQuestion.pergunta,
                answers: answers,
                targetRole: targetRole
            };
        }).filter((q): q is Question => q !== null);
    };

    try {
        if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COMPANY) {
            // Admin and Company need both sets of questions for correct max score calculation on dashboard
            const [companyResponse, employeeResponse] = await Promise.all([
                fetch('https://webhook.triad3.io/webhook/buscarperguntasscore'),
                fetch('https://webhook.triad3.io/webhook/funconariosperguntasscore')
            ]);

            if (!companyResponse.ok || !employeeResponse.ok) {
                throw new Error('Falha ao buscar uma ou mais listas de perguntas da API.');
            }
            
            const companyText = await companyResponse.text();
            const companyApiData = companyText ? JSON.parse(companyText) : [];

            const employeeText = await employeeResponse.text();
            const employeeApiData = employeeText ? JSON.parse(employeeText) : [];

            const allApiQuestions = [...companyApiData, ...employeeApiData];
            
            // First pass: collect all unique category names to create stable IDs
            const categoriesFromQuestions = new Map<string, string>();
            allApiQuestions.forEach((apiQuestion: any) => {
                if (apiQuestion.categoria && !categoriesFromQuestions.has(apiQuestion.categoria)) {
                    const id = `cat-derived-${apiQuestion.categoria.toLowerCase().replace(/\s+/g, '-')}`;
                    categoriesFromQuestions.set(apiQuestion.categoria, id);
                }
            });

            const finalCategories: Category[] = Array.from(categoriesFromQuestions.entries())
              .map(([name, id]) => ({ id, name }));
            
            const companyQuestions = processQuestionsData(companyApiData, UserRole.COMPANY, categoriesFromQuestions);
            const employeeQuestions = processQuestionsData(employeeApiData, UserRole.EMPLOYEE, categoriesFromQuestions);
            
            setCategories(finalCategories);
            setQuestions([...companyQuestions, ...employeeQuestions]);

        } else {
            // This block now only applies to UserRole.EMPLOYEE
            const endpoint = 'https://webhook.triad3.io/webhook/funconariosperguntasscore';

            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Falha ao buscar perguntas da API. Status: ${response.status}`);
            
            const text = await response.text();
            const questionsApiData = text ? JSON.parse(text) : [];

            if (Array.isArray(questionsApiData)) {
                const categoriesFromQuestions = new Map<string, string>();
                questionsApiData.forEach((apiQuestion: any) => {
                    if (apiQuestion.categoria && !categoriesFromQuestions.has(apiQuestion.categoria)) {
                        const id = `cat-derived-${apiQuestion.categoria.toLowerCase().replace(/\s+/g, '-')}`;
                        categoriesFromQuestions.set(apiQuestion.categoria, id);
                    }
                });

                const finalCategories: Category[] = Array.from(categoriesFromQuestions.entries())
                  .map(([name, id]) => ({ id, name }));
                
                setCategories(finalCategories);

                const mappedQuestions = processQuestionsData(questionsApiData, currentUser.role as UserRole.COMPANY | UserRole.EMPLOYEE, categoriesFromQuestions);
                setQuestions(mappedQuestions);
            } else {
                setQuestions([]);
                setCategories([]);
            }
        }
    } catch (error) {
        console.error("Erro ao processar busca de perguntas da API:", error);
        setQuestions([]);
        setCategories([]);
    }
  }, [currentUser]);

  const addCategory = useCallback(async (name: string) => {
    try {
      const response = await fetch('https://webhook.triad3.io/webhook/addcategoriascore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (response.ok && data.resposta === "Categoria adicionada com sucesso!") {
        const newCategory: Category = { id: `cat-${Date.now()}`, name };
        setCategories(prev => [...prev, newCategory]);
      } else {
        console.error('Failed to add category via API:', data);
        throw new Error(data.resposta || 'Falha ao adicionar categoria.');
      }
    } catch (error) {
      console.error('API error while adding category:', error);
      throw error;
    }
  }, []);
  
  const updateCategory = useCallback(async (category: Category, newName:string): Promise<{ success: boolean; message?: string; }> => {
    try {
      const response = await fetch('https://webhook.triad3.io/webhook/editarcategoriascore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'editar-categoria',
          id: category.id,
          nome_antigo: category.name,
          nome_novo: newName,
        }),
      });
      const data = await response.json();
      if (response.ok && data.resposta === "Categoria atualizada com sucesso!") {
        setCategories(cats => cats.map(cat => cat.id === category.id ? { ...cat, name: newName } : cat));
        return { success: true, message: data.resposta };
      } else {
        return { success: false, message: data.resposta || 'Falha ao atualizar categoria.' };
      }
    } catch (error) {
       console.error('API error while updating category:', error);
       return { success: false, message: 'Ocorreu um erro de comunicação.' };
    }
  }, []);

  const deleteCategory = useCallback(async (category: Category): Promise<{ success: boolean; message?: string; }> => {
    try {
      const response = await fetch('https://webhook.triad3.io/webhook/editarcategoriascore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'excluir-categoria',
          id: category.id,
          nome: category.name,
        }),
      });
      const data = await response.json();
      if (response.ok && data.resposta === "Categoria excluida com sucesso!") {
        setCategories(cats => cats.filter(cat => cat.id !== category.id));
        // As per user request, questions are no longer deleted when their category is deleted.
        // setQuestions(qs => qs.filter(q => q.categoryId !== category.id));
        return { success: true, message: data.resposta };
      } else {
         return { success: false, message: data.resposta || 'Falha ao excluir categoria.' };
      }
    } catch (error) {
      console.error('API error while deleting category:', error);
      return { success: false, message: 'Ocorreu um erro de comunicação.' };
    }
  }, []);

  const addQuestion = useCallback(async (categoryId: string, text: string, answersData: { text: string; score: number }[], targetRole: UserRole.COMPANY | UserRole.EMPLOYEE) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
        const errorMessage = "Categoria não encontrada para adicionar a pergunta.";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const endpoint = targetRole === UserRole.EMPLOYEE
        ? 'https://webhook.triad3.io/webhook/addperguntasfuncionariosscore'
        : 'https://webhook.triad3.io/webhook/addperguntasscore';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            categoryId, 
            categoria: category.name, 
            text, 
            answers: answersData,
            targetRole: targetRole
        }),
      });
      const data = await response.json();
      if (response.ok && data.resposta === "Pergunta adicionada com sucesso!") {
        const newQuestion: Question = {
          id: `q-${Date.now()}`,
          categoryId,
          text,
          answers: answersData.map((a, i) => ({ id: `ans-${Date.now()}-${i}`, ...a })),
          targetRole: targetRole,
        };
        setQuestions(prev => [...prev, newQuestion]);
      } else {
        console.error('Failed to add question via API:', data);
        throw new Error(data.resposta || 'Falha ao adicionar pergunta.');
      }
    } catch (error) {
      console.error('API error while adding question:', error);
      throw error;
    }
  }, [categories]);

  const updateQuestion = useCallback(async (question: Question): Promise<{ success: boolean; message?: string; }> => {
    const category = categories.find(c => c.id === question.categoryId);
    if (!category) {
        return { success: false, message: 'Categoria da pergunta não encontrada.' };
    }

    const endpoint = question.targetRole === UserRole.EMPLOYEE
        ? 'https://webhook.triad3.io/webhook/editfuncionariosperguntas'
        : 'https://webhook.triad3.io/webhook/editarperguntascore';

    try {
        const payload = {
            id: question.id,
            pergunta: question.text,
            categoria_id: question.categoryId,
            categoria_nome: category.name,
            respostas: question.answers.map(a => ({ texto: a.text, pontos: a.score })),
            targetRole: question.targetRole,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Pergunta editada com sucesso!") {
            setQuestions(qs => qs.map(q => (q.id === question.id ? question : q)));
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || 'Falha ao atualizar pergunta.' };
        }
    } catch (error) {
        console.error('API error while updating question:', error);
        return { success: false, message: 'Ocorreu um erro de comunicação.' };
    }
  }, [categories]);

  const deleteQuestion = useCallback(async (question: Question): Promise<{ success: boolean; message?: string; }> => {
    const endpoint = question.targetRole === UserRole.EMPLOYEE
      ? 'https://webhook.triad3.io/webhook/perguntasexcluirfuncionarios'
      : 'https://webhook.triad3.io/webhook/excluirperguntascore';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(question),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Pergunta excluida com sucesso!") {
            setQuestions(qs => qs.filter(q => q.id !== question.id));
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || 'Falha ao excluir pergunta.' };
        }
    } catch (error) {
        console.error('API error while deleting question:', error);
        return { success: false, message: 'Ocorreu um erro de comunicação.' };
    }
  }, []);
  
  const addSubmission = useCallback(async (submissionData: Omit<Submission, 'id' | 'date'>) => {
    if (!currentUser) {
      console.error("Não há usuário logado para enviar o questionário.");
      return;
    }
    
    // 1. Update local state for immediate UI feedback.
    const newSubmission: Submission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setSubmissions(prev => [...prev, newSubmission]);
    addLogEntry(
      LogType.QUESTIONNAIRE_SUBMISSION,
      `Questionário "${newSubmission.categoryName}" foi enviado por ${newSubmission.companyName}.`
    );

    // 2. Prepare and send the detailed payload to the webhook.
    try {
      const detailedAnswers = submissionData.answers.map(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        const selectedAnswerOption = question?.answers.find(a => a.score === answer.score);
        return {
          questionId: answer.questionId,
          questionText: question?.text || 'Não encontrado',
          selectedAnswerText: selectedAnswerOption?.text || 'Não encontrado',
          score: answer.score
        };
      });

      const payload = {
        userData: {
          id: currentUser.id,
          name: currentUser.name,
          companyName: currentUser.companyName,
          email: currentUser.email,
          phone: currentUser.phone,
        },
        questionnaireData: {
          categoryId: submissionData.categoryId,
          categoryName: submissionData.categoryName,
          totalScore: submissionData.totalScore,
          maxScore: submissionData.maxScore,
          submissionDate: newSubmission.date,
          answers: detailedAnswers
        }
      };
      
      const endpoint = currentUser.role === UserRole.EMPLOYEE
        ? 'https://webhook.triad3.io/webhook/respostasfuncionariosscore'
        : 'https://webhook.triad3.io/webhook/receberrespostasscore';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || data.resposta !== "Respostas recebidas com sucesso!") {
        // Log error but don't disrupt user flow as UI is already updated.
        console.error('Falha ao enviar respostas para a API:', data.resposta || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro de rede ao enviar respostas para a API:', error);
    }
  }, [currentUser, questions, addLogEntry]);

  const addAdmin = useCallback(async (name: string, email: string, password: string, phone: string): Promise<{ success: boolean; message?: string; }> => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/addadmscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: name, email, senha: password, telefone: phone }),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "ADM adicionado com sucesso!") {
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || "Falha ao adicionar administrador." };
        }
    } catch (error) {
        console.error('Add admin API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação ao tentar adicionar o administrador." };
    }
  }, []);

  const updateAdmin = useCallback(async (originalUser: User, updates: { name?: string; email?: string; phone?: string; password?: string }): Promise<{ success: boolean; message: string; }> => {
    const endpoint = 'https://webhook.triad3.io/webhook/editaradmscore';

    const makeRequest = async (payload: any) => {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok || data.resposta !== "Dados atualizados com sucesso!") {
            throw new Error(data.resposta || 'Falha ao atualizar dados.');
        }
    };

    try {
        let updatesMade = 0;
        if (updates.name && updates.name !== originalUser.name) {
            await makeRequest({ id: originalUser.id, tipo_dado: 'Nome', nome_atual: originalUser.name, atualizacao: updates.name });
            updatesMade++;
        }
        if (updates.email && updates.email !== originalUser.email) {
            await makeRequest({ id: originalUser.id, tipo_dado: 'E-mail', email_atual: originalUser.email, atualizacao: updates.email });
            updatesMade++;
        }
        if (updates.phone && updates.phone !== originalUser.phone) {
            await makeRequest({ id: originalUser.id, tipo_dado: 'Telefone', telefone_atual: originalUser.phone, atualizacao: updates.phone });
            updatesMade++;
        }
        if (updates.password) {
            await makeRequest({ id: originalUser.id, tipo_dado: 'Senha', atualizacao: updates.password });
            updatesMade++;
        }

        if (updatesMade > 0) {
            return { success: true, message: 'Dados atualizados com sucesso!' };
        } else {
            return { success: true, message: 'Nenhuma alteração para salvar.' };
        }
    } catch (error) {
        console.error('API error while updating admin:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Ocorreu um erro de comunicação.' };
    }
  }, []);

  const deleteAdmin = useCallback(async (userToDelete: User): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/excluiradmscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userToDelete),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Excluído com sucesso!") {
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || "A API retornou uma resposta inesperada." };
        }
    } catch (error) {
        console.error('Delete admin API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação ao tentar excluir o administrador." };
    }
  }, []);
  
  const changePassword = useCallback(async (user: User, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string; }> => {
    const isEmployee = user.role === UserRole.EMPLOYEE;
    const endpoint = isEmployee
        ? 'https://webhook.triad3.io/webhook/funcionariosenhanovascore'
        : 'https://webhook.triad3.io/webhook/novasenhauserscore';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: user.id,
                nome: user.name,
                empresa: user.companyName,
                email: user.email,
                telefone: user.phone,
                senha_atual: currentPassword,
                senha_nova: newPassword
            }),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Aatualizado com sucesso!") {
            return { success: true, message: "Senha alterada com sucesso!" };
        } else {
            return { success: false, message: data.resposta || "Falha ao alterar a senha." };
        }
    } catch (error) {
        console.error('Change user/employee password API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação ao tentar alterar a senha." };
    }
  }, []);

  const changeAdminPassword = useCallback(async (userId: string, email: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string; }> => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/novasenhaadmscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId,
                email: email,
                senha_atual: currentPassword,
                senha_nova: newPassword
            }),
        });

        const data = await response.json();

        if (response.ok && data.resposta === "Aatualizado com sucesso!") {
            return { success: true, message: "Senha alterada com sucesso!" };
        } else {
            return { success: false, message: data.resposta || "Falha ao alterar a senha." };
        }
    } catch (error) {
        console.error('Change admin password API error:', error);
        return { success: false, message: "Ocorreu um erro de comunicação ao tentar alterar a senha." };
    }
  }, []);

  const fetchNeuroData = useCallback(async () => {
    try {
        const [categoriesResponse, employeeQuestionsResponse, companyQuestionsResponse, allEmployeesResponse] = await Promise.all([
            fetch('https://webhook.triad3.io/webhook/busccategoneuromapa'),
            fetch('https://webhook.triad3.io/webhook/buscperguntasneurofuncionarios'),
            fetch('https://webhook.triad3.io/webhook/buscperguntasempresneuromapa'),
            fetch('https://webhook.triad3.io/webhook/busfuncntodos')
        ]);

        const mapTargetRoleFromApi = (apiRole: string): NeuroCategoryTarget => {
            switch (apiRole) {
                case 'empresa': return UserRole.COMPANY;
                case 'funcionário': return UserRole.EMPLOYEE;
                case 'ambos': return 'ambos';
                default: return UserRole.COMPANY; // Fallback
            }
        };

        if (!categoriesResponse.ok) throw new Error('Falha ao buscar categorias do NeuroMapa.');
        const categoriesText = await categoriesResponse.text();
        const categoriesApiData = categoriesText ? JSON.parse(categoriesText) : [];
        const mappedCategories: NeuroCategory[] = Array.isArray(categoriesApiData) ? categoriesApiData.map(apiCat => ({
            id: String(apiCat.id),
            name: apiCat.categorias,
            targetRole: mapTargetRoleFromApi(apiCat.publico_alvo)
        })) : [];
        setNeuroCategories(mappedCategories);
        
        if (!allEmployeesResponse.ok) throw new Error('Falha ao buscar todos os funcionários.');
        const allEmployeesText = await allEmployeesResponse.text();
        const allEmployeesApiData = allEmployeesText ? JSON.parse(allEmployeesText) : [];
        const mappedEmployees: User[] = Array.isArray(allEmployeesApiData)
            ? allEmployeesApiData.map((apiUser: any) => ({
                id: `employee-api-${apiUser.id}`, name: apiUser.nome, companyName: apiUser.empresa, email: apiUser.email,
                phone: apiUser.telefone, passwordHash: '', role: UserRole.EMPLOYEE, status: UserStatus.APPROVED, photoUrl: apiUser.foto,
            })) : [];

        if (!employeeQuestionsResponse.ok) throw new Error('Falha ao buscar perguntas de funcionários.');
        const employeeQuestionsText = await employeeQuestionsResponse.text();
        const employeeQuestionsApiData = employeeQuestionsText ? JSON.parse(employeeQuestionsText) : [];
        const employeeQuestionsToProcess = Array.isArray(employeeQuestionsApiData) ? employeeQuestionsApiData : (employeeQuestionsApiData ? [employeeQuestionsApiData] : []);
        const mappedEmployeeQuestions: NeuroQuestion[] = employeeQuestionsToProcess.map((apiQuestion: any) => {
            const category = mappedCategories.find(c => c.name === apiQuestion.categoria);
            const funcionarioArray = Array.isArray(apiQuestion.funcionario) ? apiQuestion.funcionario : [];
            if (funcionarioArray.length === 0) return null;

            let targetScope: 'all' | 'specific' | 'multiple' | 'company_all_employees' = 'all';
            let targetId: string | null = null;
            let targetIds: string[] = [];
            let targetName: string | null = null;
            let targetNames: string[] = [];
            let targetEmployee: User | null = null;
            let targetEmployees: User[] = [];
            
            const firstTarget = funcionarioArray[0];
            const companyAllRegex = /^Todos funcionários \((.+)\)$/;
            const companyAllMatch = firstTarget.nome ? companyAllRegex.exec(firstTarget.nome) : null;

            if (firstTarget.nome === 'Todos os Vendedores') {
                targetScope = 'all'; targetName = 'Todos os Vendedores';
            } else if (companyAllMatch) {
                targetScope = 'company_all_employees';
                const companyNameFromRegex = companyAllMatch[1];
                targetName = companyNameFromRegex;
                const company = users.find(u => u.companyName === companyNameFromRegex && u.role === UserRole.COMPANY);
                targetId = company?.id || null;
            } else if (firstTarget.empresa && Object.keys(firstTarget).length === 1) { // Backward compatibility
                targetScope = 'company_all_employees';
                targetName = firstTarget.empresa;
                const company = users.find(u => u.companyName === firstTarget.empresa && u.role === UserRole.COMPANY);
                targetId = company?.id || null;
            } else if (funcionarioArray.length === 1) {
                targetScope = 'specific';
                const employeeData = funcionarioArray[0];
                const foundEmployee = mappedEmployees.find(e => e.id === `employee-api-${employeeData.id}` || e.email === employeeData.email);
                targetId = foundEmployee?.id || `employee-api-${employeeData.id}`;
                targetEmployee = foundEmployee || { id: targetId, name: employeeData.nome, companyName: employeeData.empresa, role: UserRole.EMPLOYEE, status: UserStatus.APPROVED, email: '', phone: '', passwordHash: '', photoUrl: employeeData.foto };
                targetName = targetEmployee?.name || employeeData.nome;
            } else {
                targetScope = 'multiple';
                targetIds = funcionarioArray.map((ed: any) => {
                    const found = mappedEmployees.find(e => e.id === `employee-api-${ed.id}` || e.email === ed.email);
                    return found?.id || `employee-api-${ed.id}`;
                }).filter(Boolean);
                targetEmployees = targetIds.map(id => mappedEmployees.find(e => e.id === id)).filter((e): e is User => !!e);
                targetNames = targetEmployees.map((e: User) => e.name);
            }
            
            const answersData = apiQuestion.respostas || [];
            const question: NeuroQuestion = {
                id: `api-q-func-${apiQuestion.id || Math.random().toString(36).substring(7)}`, text: apiQuestion.pergunta, categoryId: category ? category.id : `unknown_category_${apiQuestion.categoria}`,
                isOpenEnded: apiQuestion.tipo_pergunta === 'Aberta',
                answers: apiQuestion.tipo_pergunta === 'Fechada' ? answersData.map((r: string, i: number) => ({ id: `api-ans-func-${apiQuestion.id}-${i}`, text: r, score: 0 })) : [],
                targetRole: UserRole.EMPLOYEE,
                targetScope, targetId, targetIds, targetName, targetNames, targetEmployee, targetEmployees
            };
            return question;
        }).filter((q): q is NeuroQuestion => q !== null && !!q.text);
        
        if (!companyQuestionsResponse.ok) throw new Error('Falha ao buscar perguntas de empresas.');
        const companyQuestionsText = await companyQuestionsResponse.text();
        const companyQuestionsApiData = companyQuestionsText ? JSON.parse(companyQuestionsText) : [];
        const mappedCompanyQuestions: NeuroQuestion[] = Array.isArray(companyQuestionsApiData) ? companyQuestionsApiData.map((apiQuestion: any) => {
            const category = mappedCategories.find(c => c.name === apiQuestion.categoria);
            const isSpecific = apiQuestion.empresa_alvo !== 'Todas Empresas';
            const answersData = apiQuestion.respostas || [];
            const question: NeuroQuestion = {
                id: `api-q-comp-${apiQuestion.id || Math.random().toString(36).substring(7)}`, text: apiQuestion.pergunta, categoryId: category ? category.id : `unknown_category_${apiQuestion.categoria}`,
                isOpenEnded: apiQuestion.tipo_pergunta === 'Aberta',
                answers: apiQuestion.tipo_pergunta === 'Fechada' ? answersData.map((r: string, i: number) => ({ id: `api-ans-comp-${apiQuestion.id}-${i}`, text: r, score: 0 })) : [],
                targetRole: UserRole.COMPANY,
                targetScope: isSpecific ? 'specific' : 'all',
                targetId: null,
                targetName: isSpecific ? apiQuestion.empresa_alvo : null,
                targetEmployee: null
            };
            return question;
        }).filter((q): q is NeuroQuestion => q !== null && !!q.text) : [];
        setNeuroQuestions([...mappedEmployeeQuestions, ...mappedCompanyQuestions]);
    } catch (error) {
        console.error('Erro ao buscar dados do NeuroMapa:', error);
        setNeuroCategories([]);
        setNeuroQuestions([]);
    }
  }, [users]);

  const addNeuroMapaSubmission = useCallback(async (submissionData: Omit<NeuroSubmission, 'id' | 'date'>): Promise<{ success: boolean; result?: string; message?: string; }> => {
    if (!currentUser) {
        return { success: false, message: 'Usuário não autenticado.' };
    }

    // Check for duplicate submission
    const categoryName = submissionData.categoryName;
    const hasAlreadySubmitted = currentUser.role === UserRole.EMPLOYEE
        ? neuroAnalysisResults.some(r => r.email === currentUser.email && r.categoria === categoryName)
        : companyNeuroAnalysisResults.some(r => r.empresa === currentUser.companyName && r.categoria === categoryName);

    if (hasAlreadySubmitted) {
        return { success: false, message: 'Você já respondeu a este questionário do NeuroMapa.' };
    }

    const respostasFormatadas = submissionData.answers.map((answer, index) => {
      return `Pergunta ${index + 1}: ${answer.questionText}\nResposta: ${answer.answer}`;
    }).join('\n\n');

    const payload = {
        dados_respondente: currentUser,
        respostas_formatadas: respostasFormatadas,
        categoria: submissionData.categoryName,
    };
    
    try {
        const endpoint = 'https://webhook.triad3.io/webhook/recrepostasneuro';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        const responseText = await response.text();

        if (response.ok) {
            const newSubmission: NeuroSubmission = {
              ...submissionData,
              id: `neuro-sub-${Date.now()}`,
              date: new Date().toISOString(),
            };
            setNeuroSubmissions(prev => [...prev, newSubmission]);
            // Manually add the new analysis to the local state to reflect the change immediately
            const newAnalysisResult: NeuroAnalysisResult = {
                id: Date.now(),
                nome: currentUser.name,
                perguntas_e_respostas: respostasFormatadas,
                resultado: responseText,
                email: currentUser.email,
                telefone: currentUser.phone,
                empresa: currentUser.companyName,
                data: new Date().toLocaleDateString('pt-BR'),
                horario: new Date().toLocaleTimeString('pt-BR'),
                foto: currentUser.photoUrl || '',
                categoria: submissionData.categoryName,
            };
            if (currentUser.role === UserRole.EMPLOYEE) {
                setNeuroAnalysisResults(prev => [...prev, newAnalysisResult]);
            } else {
                setCompanyNeuroAnalysisResults(prev => [...prev, newAnalysisResult]);
            }

            return { success: true, result: responseText };
        }
        return { success: false, message: responseText || 'Falha ao enviar respostas.' };
    } catch (error) {
        console.error("Error submitting NeuroMapa answers:", error);
        return { success: false, message: 'Erro de comunicação ao enviar respostas.' };
    }
  }, [currentUser, neuroAnalysisResults, companyNeuroAnalysisResults]);

  const fetchNeuroSubmissions = useCallback(async () => {
    if (!currentUser) return;
    try {
        const response = await fetch(`https://webhook.triad3.io/webhook/buscasubmissneuromapa?userId=${currentUser.id}`);
        if(!response.ok) {
            setNeuroSubmissions([]);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        const subs: NeuroSubmission[] = Array.isArray(data) ? data : [];
        setNeuroSubmissions(subs);
    } catch(e) {
        setNeuroSubmissions([]);
    }
  }, [currentUser]);

  const fetchNeuroAnalysisResults = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/respostasneurofuncionarios');
        if (!response.ok) {
            console.error('Falha ao buscar resultados de análise do NeuroMapa. Status:', response.status);
            setNeuroAnalysisResults([]);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        if (Array.isArray(data)) {
            setNeuroAnalysisResults(data);
        } else {
            console.error('API de resultados de análise não retornou um array. Resposta:', data);
            setNeuroAnalysisResults([]);
        }
    } catch (error) {
        console.error('Erro ao processar busca de resultados de análise do NeuroMapa:', error);
        setNeuroAnalysisResults([]);
    }
  }, []);

  const fetchCompanyNeuroAnalysisResults = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/empresasneurorespostas');
        if (!response.ok) {
            console.error('Falha ao buscar resultados de análise de empresa. Status:', response.status);
            setCompanyNeuroAnalysisResults([]);
            return;
        }
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        if (Array.isArray(data)) {
            setCompanyNeuroAnalysisResults(data);
        } else {
            console.error('API de resultados de análise de empresa não retornou um array. Resposta:', data);
            setCompanyNeuroAnalysisResults([]);
        }
    } catch (error) {
        console.error('Erro ao processar busca de resultados de análise de empresa:', error);
        setCompanyNeuroAnalysisResults([]);
    }
  }, []);
  
  const fetchOralTestResults = useCallback(async () => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/resultado-provaoral');
        if (!response.ok) {
            throw new Error(`Falha ao buscar resultados da prova oral. Status: ${response.status}`);
        }
        const text = await response.text();
        const apiData = text ? JSON.parse(text) : [];

        if (!Array.isArray(apiData)) {
            console.error('API de resultados da prova oral não retornou um array. Resposta:', apiData);
            setOralTestResults([]);
            return;
        }
        
        setOralTestResults(apiData);

    } catch (error) {
        console.error('Erro ao processar busca de resultados da prova oral da API:', error);
        setOralTestResults([]);
    }
}, []);

  const startOralTest = useCallback(async (payload: any): Promise<{ success: boolean; message?: string; }> => {
    try {
        const response = await fetch('https://webhook.triad3.io/webhook/iniciarprovaoral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (response.ok && data.resposta === "Prova oral iniciada com sucesso!") {
            return { success: true, message: data.resposta };
        } else {
            return { success: false, message: data.resposta || "Falha ao iniciar prova oral." };
        }
    } catch (error) {
        console.error('startOralTest API error:', error);
        return { success: false, message: 'Ocorreu um erro de comunicação.' };
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    currentUser, users, allEmployees, categories, questions, submissions, employeeSubmissions, loading, logs,
    neuroQuestions, neuroCategories, neuroSubmissions, neuroAnalysisResults, companyNeuroAnalysisResults,
    oralTestResults,
    login, logout, register, registerEmployee, updateUserStatus, addCategory, updateCategory, deleteCategory,
    addQuestion, updateQuestion, deleteQuestion, addSubmission, addAdmin, updateAdmin, deleteAdmin,
    changePassword, changeAdminPassword, fetchAdminQuestionnaireData, fetchPendingUsers, approveUser, fetchApprovedUsersLogs,
    fetchLoginLogs,
    fetchSubmissions,
    fetchEmployeeScoresForAdmin,
    fetchAllEmployees,
    fetchNeuroData,
    addNeuroMapaSubmission,
    fetchNeuroSubmissions,
    fetchNeuroAnalysisResults,
    fetchCompanyNeuroAnalysisResults,
    fetchOralTestResults,
    startOralTest,
  }), [
    currentUser, users, allEmployees, categories, questions, submissions, employeeSubmissions, loading, logs,
    neuroQuestions, neuroCategories, neuroSubmissions, neuroAnalysisResults, companyNeuroAnalysisResults,
    oralTestResults,
    login, logout, register, registerEmployee, updateUserStatus, addCategory, updateCategory, deleteCategory,
    addQuestion, updateQuestion, deleteQuestion, addSubmission, addAdmin, updateAdmin, deleteAdmin,
    changePassword, changeAdminPassword, fetchAdminQuestionnaireData, fetchPendingUsers, approveUser, fetchApprovedUsersLogs,
    fetchLoginLogs,
    fetchSubmissions,
    fetchEmployeeScoresForAdmin,
    fetchAllEmployees,
    fetchNeuroData,
    addNeuroMapaSubmission,
    fetchNeuroSubmissions,
    fetchNeuroAnalysisResults,
    fetchCompanyNeuroAnalysisResults,
    fetchOralTestResults,
    startOralTest,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
