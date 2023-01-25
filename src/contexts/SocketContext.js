import React, { createContext, useContext, useState } from 'react';

const SocketContext = createContext({
  socket:null,
  setSocket: () => {}
});

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
 
    return (
      <SocketContext.Provider value={{
        socket,
        setSocket
      }}>
        {children}
      </SocketContext.Provider>
    );
  };
  
  export const SocketConsumer = SocketContext.Consumer;
  
  export default SocketProvider;