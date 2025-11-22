import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Login from "./loginScreen/Login";
import { Link } from "react-router-dom";
import Desktop from "./Desktop/Desktop";


function App() {


  return <div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to='/login' replace />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/desktop" element={<Desktop/>} />
    </Routes>
    </BrowserRouter>
  </div>
}

export default App;

