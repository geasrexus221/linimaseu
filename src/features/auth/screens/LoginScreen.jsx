import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GraduationCap, BookOpen, Eye, EyeOff, X, Sparkles } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import LinimasaLogo from '../../../assets/UI/element/Linimasa.svg';
import Karakter1 from '../../../assets/UI/Character/karakter1.svg';

export default function LoginScreen({ onLogin, onNavigateToRegister }) {
  const { setIsDevMode } = useStore();
  const [modalType, setModalType] = useState(null); 
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    let loggedInRole = 'student';

    
    if (modalType === 'teacher') {
      if (formData.identifier === 'dev1' && formData.password === 'dev1') {
        setIsDevMode(true);
        loggedInRole = 'teacher';
      } else if (formData.identifier === 'guru1' && formData.password === 'guru1') {
        setIsDevMode(false);
        loggedInRole = 'teacher';
      } else {
        alert("Kode Akun atau Kata Sandi salah! (Petunjuk: gunakan guru1 / guru1)");
        return;
      }
    } else if (modalType === 'student') {
      if (formData.identifier === 'dev1' && formData.password === 'dev1') {
        setIsDevMode(true);
        loggedInRole = 'student';
      } else if (formData.identifier === 'murid1' && formData.password === 'murid1') {
        setIsDevMode(false);
        loggedInRole = 'student';
      } else {
        alert("Kode Akun atau Kata Sandi salah! (Petunjuk: gunakan murid1 / murid1)");
        return;
      }
    } else {
      if (!formData.password) {
        alert("Kata Sandi tidak boleh kosong!");
        return;
      }
      setIsDevMode(false);
      loggedInRole = 'student';
    }

    onLogin(loggedInRole);
  };

  const closeModals = () => {
    setModalType(null);
    setShowPassword(false);
    setFormData({ identifier: '', password: '' });
  };

  const handleTesterLogin = () => {
    setIsDevMode(false);
    onLogin('student');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        <div className="auth-header">
          <img src={LinimasaLogo} alt="Linimasa Logo" className="auth-logo-img" />
          <p className="auth-subtitle">Belajar tanpa batas waktu</p>
        </div>

        
        <div className="login-options">
          
          <button className="login-btn email-main" onClick={() => setModalType('email')}>
            <Mail size={24} />
            <span>Masuk dengan Email</span>
          </button>

          
          <div className="role-grid">
            <div className="role-card student" onClick={() => setModalType('student')}>
              <div className="role-icon">
                <GraduationCap size={40} />
              </div>
              <h3>MURID</h3>
            </div>

            <div className="role-card teacher" onClick={() => setModalType('teacher')}>
              <div className="role-icon">
                <BookOpen size={40} />
              </div>
              <h3>GURU</h3>
            </div>
          </div>

          <button className="login-btn tester-btn" onClick={handleTesterLogin}>
            <span>Masuk sebagai Tester</span>
          </button>
        </div>

        
        <div className="auth-footer">
          <p>Belum punya akun? <span onClick={onNavigateToRegister}>Coba daftar</span></p>
        </div>
      </div>

      
      <AnimatePresence>
        {modalType && (
          <div className="modal-overlay">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="auth-modal"
            >
              <button className="close-modal" onClick={closeModals}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <div className={`modal-icon-circle ${modalType}`}>
                  {modalType === 'email' && <Mail size={32} />}
                  {modalType === 'student' && <GraduationCap size={32} />}
                  {modalType === 'teacher' && <BookOpen size={32} />}
                </div>
                <h2>Masuk Sebagai {modalType === 'email' ? 'Pengguna Email' : modalType === 'student' ? 'Murid' : 'Guru'}</h2>
              </div>

              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label>{modalType === 'email' ? 'Alamat Email' : 'Kode Akun'}</label>
                  <input
                    type={modalType === 'email' ? 'email' : 'text'}
                    placeholder={modalType === 'email' ? 'nama@email.com' : 'Masukkan kode akun Anda'}
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Kata Sandi</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="peek-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-auth-btn">
                  MASUK SEKARANG
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="login-character">
        <img src={Karakter1} alt="Karakter 1" />
      </div>

      <style>{`
        .login-page {
          position: fixed; inset: 0;
          background: var(--sidebar-bg, #1CB0F6); display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; padding: 20px; z-index: 9999; overflow: hidden;
        }
        .login-character {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(45%);
          width: 450px;
          z-index: 0;
          pointer-events: none;
        }
        .login-character img {
          width: 100%;
          height: auto;
          display: block;
        }
        .login-container { width: 100%; max-width: 420px; animation: slideUp 0.5s ease-out; position: relative; z-index: 1; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .auth-header { text-align: center; margin-bottom: 40px; }
        .auth-logo-img { width: 280px; max-width: 100%; margin: 0 auto 15px; display: block; filter: brightness(0) invert(1) drop-shadow(0 8px 15px rgba(0,0,0,0.15)); }
        .auth-subtitle { color: rgba(255,255,255,0.9); font-weight: 600; font-size: 1.1rem; margin-top: 5px; }

        .login-options { display: flex; flex-direction: column; gap: 20px; }
        .login-btn {
          width: 100%; padding: 20px; border-radius: 24px; font-weight: 900; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center; gap: 15px;
          cursor: pointer; transition: all 0.1s; border: none;
        }
        .email-main { 
          background: #FFFFFF; color: #4B4B4B; border: 2px solid #E5E5E5; border-bottom: 6px solid #E5E5E5;
        }
        .email-main:active { transform: translateY(4px); border-bottom-width: 2px; }

        .tester-btn { 
          background: #4B4B4B; color: #FFFFFF; border: 2px solid #333333; border-bottom: 6px solid #333333;
          margin-top: 5px;
        }
        .tester-btn:active { transform: translateY(4px); border-bottom-width: 2px; }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .role-card {
          background: #FFFFFF; border: 2px solid #E5E5E5; border-bottom: 6px solid #E5E5E5;
          border-radius: 24px; padding: 25px 15px; display: flex; flex-direction: column;
          align-items: center; gap: 12px; cursor: pointer; transition: all 0.1s;
        }
        .role-card:active { transform: translateY(4px); border-bottom-width: 2px; }
        .role-icon { width: 70px; height: 70px; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
        .student .role-icon { background: #F2F7FF; color: #1CB0F6; }
        .teacher .role-icon { background: #F2FFF2; color: #58CC02; }
        .role-card h3 { margin: 0; font-size: 1.1rem; font-weight: 900; color: #4B4B4B; }

        .auth-footer { text-align: center; margin-top: 40px; }
        .auth-footer p { color: rgba(255,255,255,0.7); font-weight: 700; font-size: 1rem; }
        .auth-footer span { color: #FFF; cursor: pointer; margin-left: 5px; text-decoration: underline; font-weight: 900; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4);
          display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;
        }
        .auth-modal {
          background: white; width: 100%; max-width: 380px; border-radius: 32px;
          padding: 30px; position: relative; box-shadow: 0 20px 0 rgba(0,0,0,0.1);
        }
        .close-modal {
          position: absolute; top: 20px; right: 20px; background: none; border: none;
          color: #ccc; cursor: pointer;
        }

        .modal-header { text-align: center; margin-bottom: 25px; }
        .modal-icon-circle { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
        .modal-icon-circle.email { background: #F2F7FF; color: #1CB0F6; }
        .modal-icon-circle.student { background: #F2F7FF; color: #1CB0F6; }
        .modal-icon-circle.teacher { background: #F2FFF2; color: #58CC02; }
        .modal-header h2 { font-size: 1.4rem; font-weight: 900; color: #4B4B4B; margin: 0; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-weight: 800; font-size: 0.9rem; color: #4B4B4B; }
        .input-group input {
          width: 100%; padding: 15px 20px; border-radius: 16px; border: 2px solid #E5E5E5;
          background: #F7F7F7; font-weight: 600; font-family: inherit; font-size: 1rem;
        }
        .input-group input:focus { outline: none; border-color: #1CB0F6; background: #fff; }

        .password-wrapper { position: relative; }
        .peek-btn {
          position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #AFAFAF; cursor: pointer; display: flex;
        }

        .submit-auth-btn {
          margin-top: 10px; width: 100%; padding: 18px; border-radius: 18px;
          background: #58CC02; color: white; border: none; font-weight: 900; font-size: 1.1rem;
          box-shadow: 0 6px 0 #46A302; cursor: pointer; transition: all 0.1s;
        }
        .submit-auth-btn:active { transform: translateY(4px); box-shadow: 0 0 0 transparent; }

        @media (max-width: 600px) {
          .auth-title { font-size: 2.2rem; }
          .role-card { padding: 20px 10px; }
          .role-icon { width: 60px; height: 60px; }
          .role-icon :global(svg) { width: 32px; height: 32px; }
        }
      `}</style>
    </div>
  );
}
