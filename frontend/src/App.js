import './App.css';
import Movies from './pages/Movies.jsx';
import Seats from './pages/Seats.jsx';
import UserInfo from './pages/UserInfo.jsx';
import Confirmation from './pages/Confirmation.jsx';
import CookieIsValid from './components/CookieIsValid.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Movies />} />
            <Route element={<CookieIsValid />}>
                <Route path='/seats' element={<Seats />} />
                <Route path='/user-information' element={<UserInfo />} />
                <Route path='/ticket-reservation-confirmation' element={<Confirmation />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;