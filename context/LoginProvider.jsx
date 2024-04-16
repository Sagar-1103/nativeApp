import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const LoginContext = createContext();

const LoginProvider = props => {
    const [role, setRole] = useState(null);
    return (
      <LoginContext.Provider
        value={{role,setRole}}>
        {props.children}
      </LoginContext.Provider>
    );
  };

export default LoginProvider;

export const useLogin =()=> useContext(LoginContext);