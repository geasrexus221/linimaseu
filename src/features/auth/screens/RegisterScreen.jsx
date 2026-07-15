import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';

export default function RegisterScreen({ onRegisterSuccess, onBackToLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterSuccess();
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button className="back-btn" onClick={onBackToLogin}>
          <ArrowLeft size={24} />
          <span>KEMBALI KE MASUK</span>
        </button>

        <div className="register-header">
          <div className="reg-icon-circle">
            <UserPlus size={40} color="#58CC02" />
          </div>
          <h1>Daftar Akun Baru</h1>
          <p>Bergabunglah bersama ribuan murid lainnya!</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama Anda" required />
          </div>

          <div className="input-group">
            <label>Email atau Kode Akun</label>
            <input type="text" placeholder="nama@email.com atau kode unik" required />
          </div>

          <div className="input-group">
            <label>Kata Sandi</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Buat kata sandi minimal 6 karakter"
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

          <button type="submit" className="submit-reg-btn">
            DAFTAR SEKARANG
          </button>
        </form>
      </div>

      <style jsx>{`
        .register-page {
          position: fixed; inset: 0;
          background: #fff; display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; padding: 20px; z-index: 9999;
        }
        .register-container { width: 100%; max-width: 420px; animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .back-btn {
          display: flex; align-items: center; gap: 10px; background: none; border: none;
          color: #AFAFAF; font-weight: 900; font-size: 0.9rem; cursor: pointer;
          margin-bottom: 40px; padding: 0;
        }
        .back-btn:hover { color: #4B4B4B; }

        .register-header { text-align: center; margin-bottom: 35px; }
        .reg-icon-circle {
          width: 80px; height: 80px; background: #F2FFF2; border-radius: 25px;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }
        .register-header h1 { font-size: 2rem; font-weight: 900; color: #4B4B4B; margin: 0; }
        .register-header p { color: #777; font-weight: 600; margin-top: 5px; }

        .register-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-weight: 800; font-size: 0.9rem; color: #4B4B4B; }
        .input-group input {
          width: 100%; padding: 15px 20px; border-radius: 16px; border: 2px solid #E5E5E5;
          background: #F7F7F7; font-weight: 600; font-family: inherit; font-size: 1rem;
        }
        .input-group input:focus { outline: none; border-color: #58CC02; background: #fff; }

        .password-wrapper { position: relative; }
        .peek-btn {
          position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: #AFAFAF; cursor: pointer; display: flex;
        }

        .submit-reg-btn {
          margin-top: 10px; width: 100%; padding: 18px; border-radius: 18px;
          background: #1CB0F6; color: white; border: none; font-weight: 900; font-size: 1.1rem;
          box-shadow: 0 6px 0 #1485BA; cursor: pointer; transition: all 0.1s;
        }
        .submit-reg-btn:active { transform: translateY(4px); box-shadow: 0 0 0 transparent; }
      `}</style>
    </div>
  );
}
