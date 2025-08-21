// // import React from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { AuthProvider } from './src/context/AuthContext';
// // import { AppNavigator } from './src/navigation/AppNavigator';

// // const App = () => (
// //   <AuthProvider>
// //     <NavigationContainer>
// //       <AppNavigator />
// //     </NavigationContainer>
// //   </AuthProvider>
// // );

// // export default App;

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { PaperProvider } from 'react-native-paper';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { AuthProvider } from './src/context/AuthContext';
// import { theme } from './src/theme/theme';

// export default function App() {
//   return (
//     <AuthProvider>
//       <PaperProvider theme={theme}>
//         <NavigationContainer>
//           <AppNavigator />
//         </NavigationContainer>
//       </PaperProvider>
//     </AuthProvider>
//   );
// }

// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => (
  <AuthProvider>
    <SocketProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SocketProvider>
  </AuthProvider>
);

export default App;
