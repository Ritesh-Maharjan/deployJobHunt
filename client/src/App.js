import { Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Add from "./page/Add";
import Detail from "./page/Detail";
import Forbidden from "./page/Forbidden";
import Homepage from "./page/Homepage";
import JobApplications from "./page/JobApplications";
import Login from "./page/Login";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import ProtectedRoute from "./page/ProtectedRoute";
import Signup from "./page/Signup";
import Update from "./page/Update";
import Users from "./page/Users";

function App() {
  
  return (
    <div className="font-mono">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applications" element={<JobApplications />} />
          <Route path="addjob" element={<Add />} />
          <Route path="update/:id" element={<Update />} />
        </Route>

        <Route path="job/:id" element={<Detail />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
