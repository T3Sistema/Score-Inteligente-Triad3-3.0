
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../hooks/useApp';

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);

const EyeOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 01-1.563 3.029m-2.14 2.14l-3.289-3.29" />
    </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const LoginPage: React.FC = () => {
    const [view, setView] = useState<'login' | 'register-choice' | 'register-company' | 'register-employee' | 'admin'>('login');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    
    // Login type
    const [loginType, setLoginType] = useState<'company' | 'employee'>('company');

    // Common fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Company fields
    const [companyName, setCompanyName] = useState('');

    // Employee fields
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyCode, setCompanyCode] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [isTakingSelfie, setIsTakingSelfie] = useState(false);
    
    // Password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Refs for selfie functionality
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { login, register, registerEmployee } = useApp();
    
    // Stop camera stream when component unmounts or selfie mode is exited
    useEffect(() => {
        const stopCamera = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };

        if (!isTakingSelfie) {
            stopCamera();
        }
        
        return () => stopCamera();
    }, [isTakingSelfie]);

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setError('');
        setSuccess('');
        setCompanyName('');
        setConfirmPassword('');
        setCompanyCode('');
        setPhoto(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setIsTakingSelfie(false);
    }

    const handleViewChange = (newView: typeof view) => {
        resetFields();
        setView(newView);
    }

    const startCamera = async () => {
        setIsTakingSelfie(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
            setIsTakingSelfie(false);
        }
    };
    
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setPhoto(dataUrl);
            }
        }
        setIsTakingSelfie(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (view === 'login' || view === 'admin') {
            setIsLoggingIn(true);
            const loginPromise = login(email, password, view === 'admin', loginType);
            const timerPromise = new Promise(resolve => setTimeout(resolve, 4000));
            const [loginResult] = await Promise.all([loginPromise, timerPromise]);

            if (loginResult.success) {
                // O redirecionamento agora é tratado pelo App.tsx para uma lógica mais robusta.
            } else {
                setError(loginResult.message || 'Credenciais inválidas.');
                setIsLoggingIn(false);
            }
        } else if (view === 'register-company') {
            if(!name || !companyName || !email || !password || !phone) {
                setError('Todos os campos são obrigatórios para o cadastro.');
                return;
            }
            setIsRegistering(true);
            const registerPromise = register(name, companyName, email, password, phone);
            const timerPromise = new Promise(resolve => setTimeout(resolve, 3000));
            const [result] = await Promise.all([registerPromise, timerPromise]);
            setIsRegistering(false);

            if (result && result.success) {
                handleViewChange('login');
                setSuccess(result.message || 'Cadastro realizado! Aguarde a aprovação do administrador para acessar.');
            } else {
                setError(result?.message || 'Falha no cadastro. Tente novamente.');
            }
        } else if (view === 'register-employee') {
            if (password !== confirmPassword) {
                setError('As senhas não coincidem.');
                return;
            }
            if (!name || !phone || !email || !password || !companyCode || !photo) {
                setError('Todos os campos, incluindo a foto, são obrigatórios.');
                return;
            }
            setIsRegistering(true);
            const registerPromise = registerEmployee(name, phone, email, password, companyCode, photo);
            const timerPromise = new Promise(resolve => setTimeout(resolve, 3000));
            const [result] = await Promise.all([registerPromise, timerPromise]);
            setIsRegistering(false);

            if (result && result.success) {
                handleViewChange('login');
                setSuccess(result.message || 'Sua solicitação foi encaminhada à diretoria da Triad3 Inteligência Digital. Em breve, você receberá uma resposta pelo WhatsApp!');
            } else {
                setError(result?.message || 'Falha no cadastro de funcionário. Tente novamente.');
            }
        }
    };
    
    const renderFormContent = () => {
        if (view === 'admin') {
            return (
                <>
                    <h2 className="text-2xl font-bold text-dark-text text-center mb-4">Acesso do Administrador</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="E-mail de administrador" />
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10" placeholder="Senha de administrador" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Toggle password visibility">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-red-500 transition-all duration-300 ease-in-out">Entrar como Admin</button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => handleViewChange('login')} className="font-medium text-sm text-cyan-400 hover:underline">Voltar para o acesso da empresa</button>
                    </div>
                </>
            );
        }

        if (view === 'register-choice') {
            return (
                <>
                    <h2 className="text-2xl font-bold text-dark-text text-center mb-6">Criar Nova Conta</h2>
                    <div className="space-y-4">
                        <button onClick={() => handleViewChange('register-company')} className="w-full flex justify-center py-3 px-4 border border-dark-border text-base font-semibold rounded-lg text-dark-text bg-dark-card hover:bg-gray-800 transition-all">Sou uma Empresa</button>
                        <button onClick={() => handleViewChange('register-employee')} className="w-full flex justify-center py-3 px-4 border border-dark-border text-base font-semibold rounded-lg text-dark-text bg-dark-card hover:bg-gray-800 transition-all">Sou um Funcionário</button>
                    </div>
                    <div className="mt-6 text-center">
                        <button onClick={() => handleViewChange('login')} className="font-medium text-sm text-cyan-400 hover:underline">Já tem uma conta? Acesse aqui</button>
                    </div>
                </>
            );
        }

        if (view === 'register-company') {
            return (
                <>
                    <button onClick={() => handleViewChange('register-choice')} className="font-medium text-sm text-cyan-400 hover:underline mb-4">&larr; Voltar</button>
                    <h2 className="text-2xl font-bold text-dark-text text-center mb-4">Cadastro da Empresa</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Seu Nome Completo" />
                        <input name="companyName" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Nome da Empresa" />
                        <input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Seu e-mail" />
                        <input name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Seu telefone" />
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10" placeholder="Sua senha" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Toggle password visibility">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-blue-500 transition-all duration-300 ease-in-out">Finalizar Cadastro</button>
                    </form>
                </>
            );
        }

        if (view === 'register-employee') {
            return (
                <>
                    <button onClick={() => handleViewChange('register-choice')} className="font-medium text-sm text-cyan-400 hover:underline mb-4">&larr; Voltar</button>
                    <h2 className="text-2xl font-bold text-dark-text text-center mb-4">Cadastro de Funcionário</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Photo Section */}
                        <div className="flex flex-col items-center space-y-3">
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            {isTakingSelfie ? (
                                <div className="w-full p-2 bg-black rounded-lg">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-md h-48 object-cover transform -scale-x-100"></video>
                                    <div className="flex justify-center gap-4 mt-2">
                                        <button type="button" onClick={capturePhoto} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors">Capturar</button>
                                        <button type="button" onClick={() => setIsTakingSelfie(false)} className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-800 bg-gray-300 hover:bg-gray-400 transition-colors">Cancelar</button>
                                    </div>
                                </div>
                            ) : photo ? (
                                <div className="relative">
                                    <img src={photo} alt="Prévia da selfie" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-cyan-400" />
                                    <button type="button" onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold">&times;</button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-3 w-full">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-dark-background border-2 border-dashed border-dark-border flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">Sua Foto</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button type="button" onClick={startCamera} className="flex items-center justify-center px-4 py-2 border border-dark-border text-sm font-medium rounded-lg text-dark-text hover:bg-gray-800 transition-colors"><CameraIcon/>Tirar Selfie</button>
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center px-4 py-2 border border-dark-border text-sm font-medium rounded-lg text-dark-text hover:bg-gray-800 transition-colors"><UploadIcon/>Enviar Foto</button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <input name="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Nome Completo" />
                        <input name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Telefone" />
                        <input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="E-mail" />
                        <input name="companyCode" type="text" value={companyCode} onChange={e => setCompanyCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Código da Empresa" />
                        
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10" placeholder="Senha" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Toggle password visibility">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                        <div className="relative">
                            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10" placeholder="Confirmar Senha" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Toggle password visibility">{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-blue-500 transition-all duration-300 ease-in-out">Finalizar Cadastro</button>
                    </form>
                </>
            );
        }

        // Default login view
        return (
            <>
                <h2 className="text-2xl font-bold text-dark-text text-center mb-4">Acessar Plataforma</h2>

                {/* Login type toggle */}
                <div className="flex items-center justify-center mb-4 bg-dark-background p-1 rounded-full border border-dark-border">
                    <button
                        onClick={() => setLoginType('company')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${loginType === 'company' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        Empresa
                    </button>
                    <button
                        onClick={() => setLoginType('employee')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${loginType === 'employee' ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                    >
                        Funcionário
                    </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input name="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition" placeholder="Seu e-mail" />
                    <div className="relative">
                        <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-dark-border rounded-lg bg-dark-card text-dark-text focus:ring-2 focus:ring-blue-500 focus:outline-none transition pr-10" placeholder="Sua senha" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Toggle password visibility">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-blue-500 transition-all duration-300 ease-in-out">Entrar</button>
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => handleViewChange('register-choice')} className="font-medium text-sm text-cyan-400 hover:underline">Não tem uma conta? Cadastre-se aqui</button>
                </div>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-dark-border"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-dark-card text-gray-400">Ou</span></div>
                </div>
                <div className="text-center">
                    <button onClick={() => handleViewChange('admin')} className="w-full flex justify-center py-3 px-4 border border-gray-500 text-base font-semibold rounded-lg text-dark-text bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-card focus:ring-gray-500 transition-all duration-300 ease-in-out">Acessar como Administrador</button>
                </div>
            </>
        )
    }

    if (isLoggingIn || isRegistering) {
        return (
            <div className="bg-dark-background text-dark-text min-h-screen font-sans flex flex-col justify-center items-center p-4">
                <div className="loader-container">
                    <div className="loader triangle"><svg viewBox="0 0 86 80"><polygon points="43 8 79 72 7 72"></polygon></svg></div>
                    <div className="loadingtext"><p>Loading</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark-background text-dark-text min-h-screen font-sans flex flex-col justify-center items-center p-4 transition-colors duration-300 relative">
            <div className="text-center mb-8">
                 <img src="https://edrrnawrhfhoynpiwqsc.supabase.co/storage/v1/object/sign/imagenscientes/Logos%20Triad3/LOGO%20TRIAD3%20%20OFICIAL.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80Y2RiMjE3Ni0xMzVkLTQ2ZTItYjJjYi0zMDlhMTNlNzQxNWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zY2llbnRlcy9Mb2dvcyBUcmlhZDMvTE9HTyBUUklBRDMgIE9GSUNJQUwucG5nIiwiaWF0IjoxNzUzODg4NTQwLCJleHAiOjIxMzIzMjA1NDB9.c3GxZg4Lrz5Cb62aA69aubnEp0Vcnije64VcC3iAne8" alt="Logo Triad3" className="login-logo" />
                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Score Inteligente</span>
                    <span className="text-dark-text"> Triad3</span>
                </h1>
                <p className="text-lg text-gray-400 mt-2">Execute um raio-x de áreas vitais de sua empresa.</p>
            </div>

            <div className="w-full max-w-md bg-dark-card p-6 sm:p-8 rounded-xl shadow-2xl border border-dark-border">
                {renderFormContent()}
            </div>
             <div className="absolute bottom-4 text-center text-xs text-gray-400">
                <p>Powered by: <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Triad3 Inteligência Digital</span></p>
            </div>
        </div>
    );
};

export default LoginPage;
