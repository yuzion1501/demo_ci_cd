import { Routes, Route } from "react-router-dom";

// Components
import HomePage from "@/components/pages/home-page";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import FormApplyJob from "@/components/layout/form-apply-job";
import SearchResult from "./components/Search/search-result";
import JobDetailGuestPage from "./components/ui/job-detail-guest/job-detail-guest";
import ProfileManagement from "./components/profile/profile-management";

import SignIn from "./components/Authentications/signin";
import SignUp from "./components/Authentications/signup";
import VerifyEmail from "./components/Authentications/verify-email";
import ForgotPassword from "./components/Authentications/forgot-password";

import { AuthProvider } from "./contexts/authContext";
import ToastContainerNotification from "./components/Notifications/ToastContainerNotification";
import ProtectedRouteVerify from "./lib/protect-verify-email";
import AccountAction from "./components/Authentications/account-action";
import HomeEmployer from "./components/Employers/home-employer";

import EmployerContainer from "./components/Employer/employer-container";
import CVViewer from "./components/Employer/cv-detail";
import CustomerLogin from "./components/Employers/customer-login";
import CustomerRegister from "./components/Employers/customer-register";
import VerifyEmployer from "./components/Employers/verify-employer";
import ProfileManagementCv from "./components/profile/profile-management-cv";
import ProfileManagementJob from "./components/profile/profile-management-job";
import AdminDashboard from "./components/Admin/admin-dashboard";
import EmployeeJobManagement from "./components/Employee/employee-job-management";
import SettingsAccount from "./components/Authentications/settingsAccount";
import EmployeeJobRecent from "./components/Employee/employee-job-recent";
import EmployeeJobApplied from "./components/Employee/employee-job-applied";
import ProfileEmployer from "./components/profile/profile-employer";
import CompanyDetailPage from "./components/pages/company-detail-page";

import ProtectedRoute from "@/components/protected-route";

function App() {
    return (
        <AuthProvider>
            <ToastContainerNotification />

            <Header />
            <div className="h-[88px]" />

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/employer"
                    element={
                        <ProtectedRoute allowedRole="employer">
                            <EmployerContainer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/sign_in" element={<SignIn />} />
                <Route path="/sign_up" element={<SignUp />} />

                <Route path="/search" element={<SearchResult />} />
                
                <Route path="/companies" element={<CompanyDetailPage />} />

                <Route
                    path="/cv-detail/:applicationId"
                    element={<CVViewer />}
                />

                <Route
                    path="/job-detail/:jobId"
                    element={<JobDetailGuestPage />}
                />
                
                <Route
                    path="/form-apply-job/:jobId"
                    element={<FormApplyJob />}
                ></Route>

                <Route
                    path="/job-detail-guest"
                    element={<JobDetailGuestPage />}
                />

                <Route
                    path="/profile-cv"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <ProfileManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile-cv/manage-cv"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <ProfileManagementCv />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile-cv/job-preferences"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <ProfileManagementJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-jobs/"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <EmployeeJobManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-jobs/applied"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <EmployeeJobApplied />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-jobs/recent-viewed"
                    element={
                        <ProtectedRoute allowedRole="user">
                            <EmployeeJobRecent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/verify_email"
                    element={
                        <ProtectedRouteVerify>
                            <VerifyEmail />
                        </ProtectedRouteVerify>
                    }
                />

                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route path="/account_action" element={<AccountAction />} />

                <Route path="/for-employers" element={<HomeEmployer />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route
                    path="/customer/register"
                    element={<CustomerRegister />}
                />
                <Route path="/customer/profile" element={<ProfileEmployer />} />
                <Route
                    path="/customer/notification"
                    element={
                        <ProtectedRouteVerify>
                            <VerifyEmployer />
                        </ProtectedRouteVerify>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute allowedRole="user">
                            {" "}
                            <SettingsAccount />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Footer />
        </AuthProvider>
    );
}

export default App;
