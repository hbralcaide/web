import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Stalls from './pages/Stalls';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import VendorConfirmed from './pages/VendorConfirmed';
import MarketSections from './pages/MarketSections';
import MarketLayout from './pages/MarketLayout';
import Products from './pages/Products';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import IndoorMap from './pages/IndoorMap';
import SectionStalls from './pages/SectionStalls';
import PublicHome from './pages/PublicHome';
import PublicHomeDebug from './pages/PublicHomeDebug';
import VendorApplication from './pages/VendorApplication';
import PersonalInfoForm from './pages/PersonalInfoForm';
import PhotoPerson from './pages/PhotoPerson';
import PhotoBarangay from './pages/PhotoBarangay';
import PhotoId from './pages/PhotoId';
import PhotoBirthCert from './pages/PhotoBirthCert';
import PhotoMarriageCert from './pages/PhotoMarriageCert';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationCompletion from './pages/ApplicationCompletion';
import ApplicationPending from './pages/ApplicationPending';
import ApplicationApproved from './pages/ApplicationApproved';
import ApplicationRejected from './pages/ApplicationRejected';
import ResumeApplication from './pages/ResumeApplication';
import VendorCredentialSetup from './pages/VendorCredentialSetup';
import VendorCredentialSuccess from './pages/VendorCredentialSuccess';
import VendorStatus from './pages/VendorStatus';
import RaffleWinnerDocuments from './pages/RaffleWinnerDocuments';
import Raffle from './pages/Raffle';
import AdminManagement from './pages/AdminManagement';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<PublicHome />} />

          {/* Public debug page for stalls (dev only) */}
          <Route path="/debug-stalls" element={<PublicHomeDebug />} />

          {/* Authentication: login page */}
          <Route path="/login" element={<Login />} />

          {/* Authentication: sign-up / vendor registration start */}
          <Route path="/signup" element={<Signup />} />

          {/* Confirmation page shown after vendor confirms email/registration */}
          <Route path="/vendor-confirmed" element={<VendorConfirmed />} />

          {/* Vendor Application Routes - multi-step application flow */}
          {/* Application landing / overview */}
          <Route path="/vendor-application" element={<VendorApplication />} />
          {/* Step: personal information form */}
          <Route path="/vendor-application/personal-info" element={<PersonalInfoForm />} />
          {/* Step: upload portrait or personal photo */}
          <Route path="/vendor-application/photo-person" element={<PhotoPerson />} />
          {/* Step: upload barangay clearance photo */}
          <Route path="/vendor-application/photo-barangay" element={<PhotoBarangay />} />
          {/* Step: upload government ID */}
          <Route path="/vendor-application/photo-id" element={<PhotoId />} />
          {/* Step: upload birth certificate */}
          <Route path="/vendor-application/photo-birth-cert" element={<PhotoBirthCert />} />
          {/* Step: upload marriage certificate (if applicable) */}
          <Route path="/vendor-application/photo-marriage-cert" element={<PhotoMarriageCert />} />
          {/* Step: application form with details and declarations */}
          <Route path="/vendor-application/application-form" element={<ApplicationForm />} />
          {/* Final page: application completion summary */}
          <Route path="/vendor-application/completion" element={<ApplicationCompletion />} />
          {/* Application pending state (waiting for review) */}
          <Route path="/vendor-application/pending" element={<ApplicationPending />} />
          {/* Application approved notification */}
          <Route path="/vendor-application/approved" element={<ApplicationApproved />} />
          {/* Application rejected notification */}
          <Route path="/vendor-application/rejected" element={<ApplicationRejected />} />
          {/* Resume an in-progress application */}
          <Route path="/resume-application" element={<ResumeApplication />} />

          {/* Vendor credential setup: tokenized link to set password/credentials */}
          <Route path="/vendor-setup/:token" element={<VendorCredentialSetup />} />
          {/* Shown after successful vendor credential setup */}
          <Route path="/vendor-credential-success" element={<VendorCredentialSuccess />} />

          {/* Vendor status: view current application/profile status */}
          <Route path="/vendor-status" element={<VendorStatus />} />

          {/* Raffle winner documents upload / instructions page */}
          <Route path="/raffle-winner-documents" element={<RaffleWinnerDocuments />} />

          {/* Admin area - protected routes (requires auth + admin role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin dashboard (index) */}
            <Route index element={<Dashboard />} />

            {/* Admin: market management area (nested) */}
            <Route path="market" element={<MarketLayout />}>
              {/* Market map view (interactive indoor map) */}
              <Route path="map" element={<IndoorMap />} />
              {/* List / manage market sections */}
              <Route path="sections" element={<MarketSections />} />
              {/* View stalls within a specific section */}
              <Route path="sections/:sectionId/stalls" element={<SectionStalls />} />
              {/* Market-level stalls management */}
              <Route path="stalls" element={<Stalls />} />
            </Route>

            {/* Generic stalls management page */}
            <Route path="stalls" element={<Stalls />} />
            {/* Vendors management and listing */}
            <Route path="vendors" element={<Vendors />} />
            {/* Admin raffle management */}
            <Route path="raffle" element={<Raffle />} />
            {/* Products management */}
            <Route path="products" element={<Products />} />
            {/* Admin Management */}
            <Route path="admins" element={<AdminManagement />} />
            {/* Admin user/profile settings */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;