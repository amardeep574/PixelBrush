import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigation from './src/routes/AppNavigation';

const App = () => {
  return (
    <PaperProvider>
      <AppNavigation />
    </PaperProvider>
  );
};

export default App;
