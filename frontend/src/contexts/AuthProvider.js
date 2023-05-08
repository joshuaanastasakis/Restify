
import { createContext, useState } from "react";
// axios login validation snippets taken from https://blog.openreplay.com/user-registration-and-login-with-react-and-axios/
const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;