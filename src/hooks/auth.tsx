import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Alert from '../components/Alert'; // Certifique-se de ajustar o caminho para o seu componente Alert

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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

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
        setUser(data.user);
        setAlertMessage('Login realizado com sucesso!');
        setAlertType('success');
        window.location.href = '/dashboard'; // Redireciona após login
      } else {
        setAlertMessage('Senha ou usuário inválidos!');
        setAlertType('error');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setAlertMessage('Erro ao fazer login. Tente novamente.');
      setAlertType('error');
    }
  }

  const signOut = () => {
    localStorage.removeItem('@minha-carteira:logged');
    localStorage.removeItem('@minha-carteira:user');
    setLogged(false);
    setUser(null);
    setAlertMessage('Logout realizado com sucesso!');
    setAlertType('success');
    window.location.href = '/'; // Redireciona após logout
  }

  return (
    <AuthContext.Provider value={{ logged, user, signIn, signOut }}>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType as 'success' | 'error'}
          onClose={() => {
            setAlertMessage(null);
            setAlertType(null);
          }}
        />
      )}
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
