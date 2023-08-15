import Login from './Login';
import Register from './Register';
import {BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/login' element={<Login/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
