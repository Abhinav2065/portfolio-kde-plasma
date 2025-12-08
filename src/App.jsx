import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import Login from "./loginScreen/Login";
import { Link } from "react-router-dom";
import Desktop from "./Desktop/Desktop";
import BootAnimation from "./Desktop/BootAnimation";


function App() {


  return <div>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to='/boot' replace />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/desktop" element={<Desktop/>} />
      <Route path="/boot" element={<BootAnimation/>} />
    </Routes>
    </BrowserRouter>
  </div>
}

export default App;

