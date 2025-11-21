import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ContentRoutes from './routes/contentRoutes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ContentRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
