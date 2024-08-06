import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface IAuthContext {
  logged: boolean;
  signIn(email: string, password: string): void;
  signOut(): void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    const isLogged = localStorage.getItem('@minha-carteira:logged');
    setLogged(!!isLogged);
  }, []);

  const signIn = (email: string, password: string) => {
    if (email === 'william100william@gmail.com' && password === '123') {
      localStorage.setItem('@minha-carteira:logged', 'true');
      setLogged(true);
      window.location.href = '/dashboard'; // Redireciona após login
    } else {
      alert('Senha ou usuário inválidos!');
    }
  }

  const signOut = () => {
    localStorage.removeItem('@minha-carteira:logged');
    setLogged(false);
    window.location.href = '/'; // Redireciona após logout
  }

  return (
    <AuthContext.Provider value={{ logged, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
