import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface IAuthContext {
  logged: boolean;
  user: IUser | null;
  signIn(email: string, password: string): void;
  signOut(): void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [logged, setLogged] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const isLogged = localStorage.getItem('@minha-carteira:logged');
    const storedUser = localStorage.getItem('@minha-carteira:user');
    setLogged(!!isLogged);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3008/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('@minha-carteira:logged', 'true');
        localStorage.setItem('@minha-carteira:user', JSON.stringify(data.user));
        setLogged(true);
        setUser(data);
        window.location.href = '/dashboard'; // Redireciona após login
      } else {
        alert('Senha ou usuário inválidos!');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  }

  const signOut = () => {
    localStorage.removeItem('@minha-carteira:logged');
    localStorage.removeItem('@minha-carteira:user');
    setLogged(false);
    setUser(null);
    window.location.href = '/'; // Redireciona após logout
  }

  return (
    <AuthContext.Provider value={{ logged, user, signIn, signOut }}>
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
