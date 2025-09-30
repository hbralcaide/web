import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import Vendors from './pages/Vendors'
import Stalls from './pages/Stalls'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import VendorConfirmed from './pages/VendorConfirmed'
import MarketSections from './pages/MarketSections'
import MarketLayout from './pages/MarketLayout'
import Products from './pages/Products'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import IndoorMap from './pages/IndoorMap'
import SectionStalls from './pages/SectionStalls'
import PublicHome from './pages/PublicHome'
import PublicHomeDebug from './pages/PublicHomeDebug'
import VendorApplication from './pages/VendorApplication'
import PersonalInfoForm from './pages/PersonalInfoForm'
import PhotoPerson from './pages/PhotoPerson'
import PhotoBarangay from './pages/PhotoBarangay'
import PhotoId from './pages/PhotoId'
import PhotoBirthCert from './pages/PhotoBirthCert'
import PhotoMarriageCert from './pages/PhotoMarriageCert'
import ApplicationForm from './pages/ApplicationForm'
import ApplicationCompletion from './pages/ApplicationCompletion'
import ApplicationPending from './pages/ApplicationPending'
import ApplicationApproved from './pages/ApplicationApproved'
import ApplicationRejected from './pages/ApplicationRejected'
import ResumeApplication from './pages/ResumeApplication'
import VendorCredentialSetup from './pages/VendorCredentialSetup'
import VendorCredentialSuccess from './pages/VendorCredentialSuccess'
import VendorStatus from './pages/VendorStatus'
import RaffleWinnerDocuments from './pages/RaffleWinnerDocuments'
import Raffle from './pages/Raffle'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/debug-stalls" element={<PublicHomeDebug />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/vendor-confirmed" element={<VendorConfirmed />} />

          {/* Vendor Application Routes */}
          <Route path="/vendor-application" element={<VendorApplication />} />
          <Route path="/vendor-application/personal-info" element={<PersonalInfoForm />} />
          <Route path="/vendor-application/photo-person" element={<PhotoPerson />} />
          <Route path="/vendor-application/photo-barangay" element={<PhotoBarangay />} />
          <Route path="/vendor-application/photo-id" element={<PhotoId />} />
          <Route path="/vendor-application/photo-birth-cert" element={<PhotoBirthCert />} />
          <Route path="/vendor-application/photo-marriage-cert" element={<PhotoMarriageCert />} />
          <Route path="/vendor-application/application-form" element={<ApplicationForm />} />
          <Route path="/vendor-application/completion" element={<ApplicationCompletion />} />
          <Route path="/vendor-application/pending" element={<ApplicationPending />} />
          <Route path="/vendor-application/approved" element={<ApplicationApproved />} />
          <Route path="/vendor-application/rejected" element={<ApplicationRejected />} />
          <Route path="/resume-application" element={<ResumeApplication />} />

          {/* Vendor Credential Setup Routes */}
          <Route path="/vendor-setup/:token" element={<VendorCredentialSetup />} />
          <Route path="/vendor-credential-success" element={<VendorCredentialSuccess />} />

          {/* Vendor Status Route */}
          <Route path="/vendor-status" element={<VendorStatus />} />

          {/* Raffle Winner Documents Route */}
          <Route path="/raffle-winner-documents" element={<RaffleWinnerDocuments />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="market" element={<MarketLayout />}>
              <Route path="map" element={<IndoorMap />} />
              <Route path="sections" element={<MarketSections />} />
              <Route path="sections/:sectionId/stalls" element={<SectionStalls />} />
              <Route path="stalls" element={<Stalls />} />
            </Route>
            <Route path="stalls" element={<Stalls />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="raffle" element={<Raffle />} />
            <Route path="products" element={<Products />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App