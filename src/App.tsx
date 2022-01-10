import React from 'react';
import './App.css';
import Landing from './pages/Main';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}


export const theme = createTheme({
  palette: {
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: '0px', padding: '0px', minWidth: '100%', position: 'relative'}}>
            <Landing />
          </div>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
