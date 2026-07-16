import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Code, LogOut, Pencil, Bell, Shield, Globe, ChevronRight, User } from 'lucide-react';

export default function TeacherSettings({
  theme,
  setTheme,
  isDevMode,
  showDevMode,
  setShowDevMode,
  onLogout
}) {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="settings-view"
    >
      
      <div className="card-box desktop-only">
        <h2>Pengaturan Ruang Guru</h2>
        <p>Sesuaikan konfigurasi kelas, batas waktu pengerjaan kuis, dan preferensi dashboard.</p>
        
        <div className="settings-list">
          
          <div className="settings-section-title">PROFIL SAYA</div>
          <div style={{ background: 'var(--primary-bg-light)', borderRadius: '16px', padding: '20px', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: '900', flexShrink: 0 }}>
              BD
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', color: '#1D4ED8', fontWeight: '900' }}>Bapak Budi</h3>
              <p style={{ margin: 0, color: '#3B82F6', fontWeight: '600' }}>guru.budi@sekolah.id</p>
            </div>
            <button style={{ padding: '10px 16px', background: 'white', color: '#3B82F6', border: '2px solid #3B82F6', borderRadius: '12px', fontWeight: '800', display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <Pencil size={18} /> Edit
            </button>
          </div>

          
          <div className="settings-section-title">TAMPILAN & TEMA GLOBAL</div>
          <div className="theme-toggle-container">
            <div 
              className={`theme-card ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={24} />
              <span>Terang</span>
            </div>
            <div 
              className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={24} />
              <span>Gelap</span>
            </div>
          </div>

          
          <div className="settings-section-title">PREFERENSI NOTIFIKASI</div>
          <div className="settings-row" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#DBEAFE', padding: '10px', borderRadius: '50%', color: '#3B82F6' }}><Bell size={20} /></div>
              <div className="setting-desc" style={{ flex: 'none', margin: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-color)' }}>Pengaturan Notifikasi</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Peringatan tugas masuk & laporan email mingguan</p>
              </div>
            </div>
            <ChevronRight size={24} color="var(--border-color)" />
          </div>

          <div className="settings-section-title">KEAMANAN</div>
          <div className="settings-row" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#D1FAE5', padding: '10px', borderRadius: '50%', color: '#10B981' }}><Shield size={20} /></div>
              <div className="setting-desc" style={{ flex: 'none', margin: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-color)' }}>Keamanan</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Kata sandi & privasi kelas</p>
              </div>
            </div>
            <ChevronRight size={24} color="var(--border-color)" />
          </div>

          <div className="settings-section-title">PENGATURAN AKUN</div>
          <div className="settings-row" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#E0E7FF', padding: '10px', borderRadius: '50%', color: '#6366F1' }}><User size={20} /></div>
              <div className="setting-desc" style={{ flex: 'none', margin: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-color)' }}>Akun</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pusat kontrol data pribadi Anda</p>
              </div>
            </div>
            <ChevronRight size={24} color="var(--border-color)" />
          </div>

          <div className="settings-section-title">AKSESIBILITAS & LAINNYA</div>
          <div className="settings-row" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '50%', color: '#F59E0B' }}><Globe size={20} /></div>
              <div className="setting-desc" style={{ flex: 'none', margin: 0 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-color)' }}>Bahasa & Suara</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pilih bahasa aplikasi & pengaturan efek suara</p>
              </div>
            </div>
            <ChevronRight size={24} color="var(--border-color)" />
          </div>


          {isDevMode && (
            <>
              <div className="settings-section-title">PENGEMBANG / DEVELOPER</div>
              <div className="dev-entry" onClick={() => setShowDevMode(!showDevMode)}>
                <div className="dev-entry-left">
                  <Code size={20} color="#f4c265" />
                  <span>Developer Mode Active</span>
                </div>
                <div className={`toggle-switch ${showDevMode ? 'on' : ''}`} />
              </div>
            </>
          )}

          <div className="settings-section-title">AKUN</div>
          <button 
            className="quick-action-btn" 
            style={{ 
              borderColor: 'var(--danger-text)', 
              color: 'var(--danger-text)',
              marginTop: '10px'
            }}
            onClick={onLogout}
          >
            <LogOut size={20} />
            <span>Keluar Akun (Log Out)</span>
          </button>
        </div>
      </div>


      
      <div className="mobile-settings-container mobile-only" style={{ paddingBottom: '30px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', margin: '0 0 4px 0', color: 'var(--text-color)', fontWeight: '900' }}>Setelan</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Kelola konfigurasi ruang kelas Anda.</p>
        </div>

        
        <div style={{ background: 'var(--card-bg)', borderRadius: '20px', padding: '20px', border: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative', boxShadow: '0 4px 0 var(--border-color)' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem', fontWeight: '900' }}>
            BD
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-color)', fontWeight: '900' }}>Bapak Budi</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>guru.budi@sekolah.id</p>
          </div>
          <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--background-color)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3B82F6', cursor: 'pointer' }}>
            <Pencil size={16} />
          </button>
        </div>

        
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>Tampilan</h3>
        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          <div onClick={() => setTheme('light')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', background: theme === 'light' ? 'var(--primary-bg-light)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: theme === 'light' ? '#3B82F6' : '#E5E7EB', padding: '8px', borderRadius: '50%', color: theme === 'light' ? 'white' : '#6B7280' }}>
                <Sun size={18} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: theme === 'light' ? '700' : '500', color: theme === 'light' ? '#1D4ED8' : 'var(--text-color)' }}>Mode Terang</span>
            </div>
            {theme === 'light' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }}></div>}
          </div>
          <div onClick={() => setTheme('dark')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', background: theme === 'dark' ? 'var(--primary-bg-light)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: theme === 'dark' ? '#3B82F6' : '#E5E7EB', padding: '8px', borderRadius: '50%', color: theme === 'dark' ? 'white' : '#6B7280' }}>
                <Moon size={18} />
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: theme === 'dark' ? '700' : '500', color: theme === 'dark' ? '#1D4ED8' : 'var(--text-color)' }}>Mode Gelap</span>
            </div>
            {theme === 'dark' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }}></div>}
          </div>
        </div>

        
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>Lainnya</h3>
        <div style={{ background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#DBEAFE', padding: '8px', borderRadius: '50%', color: '#3B82F6' }}><Bell size={18} /></div>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>Pengaturan Notifikasi</span>
            </div>
            <ChevronRight size={20} color="var(--border-color)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#D1FAE5', padding: '8px', borderRadius: '50%', color: '#10B981' }}><Shield size={18} /></div>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>Keamanan</span>
            </div>
            <ChevronRight size={20} color="var(--border-color)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#E0E7FF', padding: '8px', borderRadius: '50%', color: '#6366F1' }}><User size={18} /></div>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>Akun</span>
            </div>
            <ChevronRight size={20} color="var(--border-color)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#FEF3C7', padding: '8px', borderRadius: '50%', color: '#F59E0B' }}><Globe size={18} /></div>
              <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>Bahasa & Suara</span>
            </div>
            <ChevronRight size={20} color="var(--border-color)" />
          </div>

        </div>


        
        {isDevMode && (
          <>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>Developer Mode</h3>
            <div style={{ background: 'var(--card-bg)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <div onClick={() => setShowDevMode(!showDevMode)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: showDevMode ? '#FDE68A' : '#E5E7EB', padding: '8px', borderRadius: '50%', color: showDevMode ? '#D97706' : '#6B7280' }}>
                    <Code size={18} />
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>Toggle Developer Options</span>
                </div>
                <div style={{ width: '40px', height: '24px', background: showDevMode ? '#10B981' : '#D1D5DB', borderRadius: '20px', position: 'relative', transition: 'background 0.2s' }}>
                  <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: showDevMode ? '18px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                </div>
              </div>
            </div>
          </>
        )}

        
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '8px' }}>Akun</h3>
        <button 
          onClick={onLogout}
          style={{ width: '100%', padding: '16px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '16px', fontWeight: '800', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 0 #FCA5A5' }}
        >
          <LogOut size={20} /> Keluar Akun
        </button>

      </div>
    </motion.div>
  );
}
