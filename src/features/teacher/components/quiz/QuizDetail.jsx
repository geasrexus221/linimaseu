import React from 'react';
import { ChevronRight, Pencil } from 'lucide-react';

export default function QuizDetail({
  activeCol,
  selectedCollectionId,
  setSelectedCollectionId,
  quizCollections,
  setQuizCollections,
  showAddQuestionForm,
  setShowAddQuestionForm,
  newQuestionText,
  setNewQuestionText,
  newQuestionOptionA,
  setNewQuestionOptionA,
  newQuestionOptionB,
  setNewQuestionOptionB,
  newQuestionOptionC,
  setNewQuestionOptionC,
  newQuestionCorrectIndex,
  setNewQuestionCorrectIndex,
  newQuestionType,
  setNewQuestionType,
  editingQuestionId,
  setEditingQuestionId,
  showDevMode,
  setTestingCollection,
  setTestingQuestion
}) {
  const [hoveredBtn, setHoveredBtn] = React.useState(null);

  const formatType = (t) => {
    if (t === 'CLASSIC') return 'Pilihan Ganda';
    if (t === '3D_MAP') return 'Peta 3D';
    if (t === 'GUESS_ARTIFACT') return 'Tebak Gambar';
    if (t === 'ANAGRAM') return 'Anagram';
    if (t === 'MATCHING') return 'Match Up';
    if (t === 'CATEGORIZATION') return 'Group Sort';
    if (t === 'BLANKS') return 'Lengkapi Kalimat';
    return t;
  };

  return (
    <div>
      
      <div className="desktop-only" style={{ marginBottom: '16px' }}>
        <button 
          className="back-to-classes-btn"
          onClick={() => {
            setSelectedCollectionId(null);
            setShowAddQuestionForm(false);
            setEditingQuestionId(null);
          }}
        >
          Kembali ke Daftar Bank Soal
        </button>
      </div>

      
      <div className="mobile-action-bar mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '2px solid var(--border-color)', marginBottom: '16px' }}>
        <button 
          onClick={() => {
            setSelectedCollectionId(null);
            setShowAddQuestionForm(false);
            setEditingQuestionId(null);
          }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--border-color)', background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-color)', padding: 0, cursor: 'pointer', flexShrink: 0 }}
        >
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text-color)', fontWeight: '800' }}>{activeCol.title}</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeCol.questions?.length || 0} Soal</p>
        </div>
      </div>

      <div 
        style={{ 
          background: 'var(--card-bg)', 
          border: '2px solid var(--border-color)', 
          borderRadius: '20px', 
          padding: '24px', 
          color: 'var(--text-color)',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>{activeCol.title}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {showDevMode && (
              <button
                onClick={() => {
                  if (!activeCol.questions || activeCol.questions.length === 0) {
                    alert('Tambahkan soal terlebih dahulu untuk dapat menguji kuis!');
                    return;
                  }
                  setTestingCollection(activeCol);
                  setTestingQuestion(activeCol.questions[0]);
                }}
                style={{ padding: '6px 14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 3px 0 #047857' }}
              >
                Uji Kuis
              </button>
            )}
            <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '30px', background: '#f4c26533', color: '#f4c265', fontWeight: '800', border: '1px solid #f4c26555', alignSelf: 'center' }}>
              Mode Soal: {(activeCol.questions && activeCol.questions.length > 0) 
                ? [...new Set(activeCol.questions.map(q => q.questionType || 'CLASSIC'))].map(t => t === 'CLASSIC' ? 'Klasik' : t === '3D_MAP' ? 'Peta 3D' : 'Tebak Gambar').join(', ') 
                : 'Klasik'}
            </span>
          </div>
        </div>
        <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{activeCol.description || 'Tidak ada deskripsi.'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', fontWeight: '700' }}>
          <span style={{ background: 'var(--border-color)', color: 'var(--warning-text)', padding: '6px 12px', borderRadius: '30px' }}>
            Kelas Target: {activeCol.targetClassName}
          </span>
          <span style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '6px 12px', borderRadius: '30px' }}>
            Jumlah Soal: {activeCol.questions ? activeCol.questions.length : 0}
          </span>
          <span style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '6px 12px', borderRadius: '30px' }}>
            Reward Selesai Kuis: +{activeCol.xpReward} ⭐
          </span>
        </div>

        
        <div style={{ marginTop: '16px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#0284C7' }}>Batas Durasi Kuis</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369A1' }}>Jumlah waktu (detik) yang diberikan kepada murid untuk menjawab kuis ini.</p>
          </div>
          <div style={{ background: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: '900', fontSize: '1.1rem', color: '#0284C7', border: '2px dashed #7DD3FC' }}>
            {activeCol.durationLimit} Detik
          </div>
        </div>
      </div>

      <div className="card-box">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>Daftar Pertanyaan</h3>
            {!showAddQuestionForm && (
              <button 
                onClick={() => {
                  setNewQuestionText('');
                  setNewQuestionOptionA('');
                  setNewQuestionOptionB('');
                  setNewQuestionOptionC('');
                  setNewQuestionCorrectIndex(0);
                  setNewQuestionType('CLASSIC');
                  setEditingQuestionId(null);
                  setShowAddQuestionForm(true);
                }}
                style={{ padding: '8px 16px', background: '#f4c265', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 3px 0 #d1a34b' }}
              >
                Tambah Soal Baru
              </button>
            )}
          </div>

          
          {showAddQuestionForm && (
            <div 
              style={{ 
                background: 'var(--card-bg)', 
                border: '2px dashed #f4c265', 
                borderRadius: '20px', 
                padding: '20px', 
                marginBottom: '20px'
              }}
            >
              <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-color)', fontWeight: '800' }}>
                {editingQuestionId ? 'Ubah Pertanyaan' : 'Formulir Soal Baru'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Teks Pertanyaan</label>
                  <textarea 
                    placeholder="Contoh: Apa ibukota pertama kerajaan Majapahit?"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    rows={2}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none', resize: 'none' }}
                  />
                </div>

                
                {newQuestionType === 'ANAGRAM' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kata Jawaban Kunci (Maks 15 huruf, satu kata tanpa spasi)</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: MAJAPAHIT"
                      value={newQuestionOptionA}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                        setNewQuestionOptionA(val);
                        setNewQuestionOptionB('');
                        setNewQuestionOptionC('');
                      }}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                    />
                  </div>
                )}

                
                {newQuestionType === 'MATCHING' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pasangan 1 (Kiri : Kanan)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Gajah Mada : Mahapatih"
                        value={newQuestionOptionA}
                        onChange={(e) => setNewQuestionOptionA(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pasangan 2 (Kiri : Kanan)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Hayam Wuruk : Raja"
                        value={newQuestionOptionB}
                        onChange={(e) => setNewQuestionOptionB(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pasangan 3 (Kiri : Kanan)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Raden Wijaya : Pendiri"
                        value={newQuestionOptionC}
                        onChange={(e) => setNewQuestionOptionC(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                
                {newQuestionType === 'CATEGORIZATION' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kategori A : Daftar Item (pisah koma)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Candi Hindu : Prambanan, Dieng"
                        value={newQuestionOptionA}
                        onChange={(e) => setNewQuestionOptionA(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kategori B : Daftar Item (pisah koma)</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Candi Buddha : Borobudur, Mendut"
                        value={newQuestionOptionB}
                        onChange={(e) => {
                          setNewQuestionOptionB(e.target.value);
                          setNewQuestionOptionC('');
                        }}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                
                {(newQuestionType === 'CLASSIC' || newQuestionType === 'BLANKS' || newQuestionType === '3D_MAP' || newQuestionType === 'GUESS_ARTIFACT') && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pilihan A</label>
                      <input 
                        type="text" 
                        placeholder="Pilihan A"
                        value={newQuestionOptionA}
                        onChange={(e) => setNewQuestionOptionA(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pilihan B</label>
                      <input 
                        type="text" 
                        placeholder="Pilihan B"
                        value={newQuestionOptionB}
                        onChange={(e) => setNewQuestionOptionB(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pilihan C</label>
                      <input 
                        type="text" 
                        placeholder="Pilihan C"
                        value={newQuestionOptionC}
                        onChange={(e) => setNewQuestionOptionC(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', flex: 1 }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Tipe / Tampilan Soal</label>
                    <select 
                      value={newQuestionType}
                      onChange={(e) => {
                        setNewQuestionType(e.target.value);
                        setNewQuestionOptionA('');
                        setNewQuestionOptionB('');
                        setNewQuestionOptionC('');
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                    >
                      <option value="CLASSIC">Klasik Pilihan Ganda</option>
                      <option value="3D_MAP">Gamifikasi: Petualangan Peta 3D (Template)</option>
                      <option value="GUESS_ARTIFACT">Gamifikasi: Tebak Gambar Peninggalan (Template)</option>
                      <option value="ANAGRAM">Anagram (Susun Huruf)</option>
                      <option value="MATCHING">Match Up (Mencocokkan Kata)</option>
                      <option value="CATEGORIZATION">Group Sort (Pengelompokan Kategori)</option>
                      <option value="BLANKS">Lengkapi Kalimat (Blank)</option>
                    </select>
                  </div>

                  {['CLASSIC', 'BLANKS', '3D_MAP', 'GUESS_ARTIFACT'].includes(newQuestionType) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Kunci Jawaban Yang Benar</label>
                      <select 
                        value={newQuestionCorrectIndex}
                        onChange={(e) => setNewQuestionCorrectIndex(parseInt(e.target.value, 10))}
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', outline: 'none' }}
                      >
                        <option value={0}>Pilihan A</option>
                        <option value={1}>Pilihan B</option>
                        <option value={2}>Pilihan C</option>
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    onClick={() => {
                      const isClassicOrBlank = ['CLASSIC', 'BLANKS', '3D_MAP', 'GUESS_ARTIFACT'].includes(newQuestionType);
                      if (newQuestionType === 'ANAGRAM') {
                        if (!newQuestionText.trim() || !newQuestionOptionA.trim()) {
                          alert('Harap isi instruksi pertanyaan dan kata jawaban kunci!');
                          return;
                        }
                      } else if (newQuestionType === 'MATCHING') {
                        if (!newQuestionText.trim() || !newQuestionOptionA.includes(':') || !newQuestionOptionB.includes(':') || !newQuestionOptionC.includes(':')) {
                          alert('Harap isi seluruh 3 pasangan dengan format Kiri : Kanan !');
                          return;
                        }
                      } else if (newQuestionType === 'CATEGORIZATION') {
                        if (!newQuestionText.trim() || !newQuestionOptionA.includes(':') || !newQuestionOptionB.includes(':')) {
                          alert('Harap isi kedua Kategori beserta daftar itemnya dengan format Kategori : Item1, Item2 !');
                          return;
                        }
                      } else if (isClassicOrBlank) {
                        if (!newQuestionText.trim() || !newQuestionOptionA.trim() || !newQuestionOptionB.trim() || !newQuestionOptionC.trim()) {
                          alert('Harap isi pertanyaan dan seluruh pilihan jawaban!');
                          return;
                        }
                      }

                      if (editingQuestionId) {
                        
                        setQuizCollections(prev => prev.map(c => {
                          if (c.id === selectedCollectionId) {
                            return {
                              ...c,
                              questions: c.questions.map(q => {
                                if (q.id === editingQuestionId) {
                                  return {
                                    ...q,
                                    text: newQuestionText.trim(),
                                    questionType: newQuestionType,
                                    options: [newQuestionOptionA.trim(), newQuestionOptionB.trim(), newQuestionOptionC.trim()],
                                    correctAnswerIndex: newQuestionCorrectIndex
                                  };
                                }
                                return q;
                              })
                            };
                          }
                          return c;
                        }));
                        setEditingQuestionId(null);
                      } else {
                        
                        const newQ = {
                          id: Date.now().toString(),
                          text: newQuestionText.trim(),
                          questionType: newQuestionType,
                          options: [newQuestionOptionA.trim(), newQuestionOptionB.trim(), newQuestionOptionC.trim()],
                          correctAnswerIndex: newQuestionCorrectIndex
                        };

                        setQuizCollections(prev => prev.map(c => {
                          if (c.id === selectedCollectionId) {
                            return {
                              ...c,
                              questions: [...c.questions, newQ]
                            };
                          }
                          return c;
                        }));
                      }

                      
                      setNewQuestionText('');
                      setNewQuestionOptionA('');
                      setNewQuestionOptionB('');
                      setNewQuestionOptionC('');
                      setNewQuestionCorrectIndex(0);
                      setNewQuestionType('CLASSIC');
                      setShowAddQuestionForm(false);
                    }}
                    style={{ flex: 1, padding: '10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Simpan Soal
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddQuestionForm(false);
                      setEditingQuestionId(null);
                    }}
                    style={{ flex: 1, padding: '10px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        
        {!activeCol.questions || activeCol.questions.length === 0 ? (
          <div style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            Belum ada pertanyaan kustom di dalam kuis ini.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeCol.questions.map((q, qIdx) => (
              <div 
                key={q.id}
                style={{ 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '16px', 
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-color)' }}>
                  <span style={{ 
                    display: 'inline-block',
                    fontSize: (!q.questionType || q.questionType === 'CLASSIC') ? '0.65rem' : '0.7rem', 
                    padding: '2px 6px', 
                    borderRadius: '6px', 
                    background: q.questionType === '3D_MAP' ? '#3B82F633' : q.questionType === 'GUESS_ARTIFACT' ? '#10B98133' : (!q.questionType || q.questionType === 'CLASSIC') ? 'rgba(156, 163, 175, 0.1)' : '#f4c26533', 
                    color: q.questionType === '3D_MAP' ? '#3B82F6' : q.questionType === 'GUESS_ARTIFACT' ? '#10B981' : (!q.questionType || q.questionType === 'CLASSIC') ? '#9CA3AF' : '#f4c265', 
                    border: (!q.questionType || q.questionType === 'CLASSIC') ? '1px solid rgba(156, 163, 175, 0.3)' : 'none',
                    fontWeight: '800',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}>
                    {formatType(q.questionType || 'CLASSIC')}
                  </span>
                  {qIdx + 1}. {q.text}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => {
                      setNewQuestionText(q.text);
                      setNewQuestionOptionA(q.options[0]);
                      setNewQuestionOptionB(q.options[1]);
                      setNewQuestionOptionC(q.options[2]);
                      setNewQuestionCorrectIndex(q.correctAnswerIndex);
                      setNewQuestionType(q.questionType || 'CLASSIC');
                      setEditingQuestionId(q.id);
                      setShowAddQuestionForm(true);
                    }}
                    onMouseEnter={() => setHoveredBtn(`${q.id}-edit`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    title="Ubah Soal"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: hoveredBtn === `${q.id}-edit` ? '#3B82F6' : '#6B7280', 
                      transition: 'color 0.2s',
                      cursor: 'pointer', 
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  {showDevMode && (
                    <button 
                      onClick={() => {
                        setTestingQuestion(q);
                      }}
                      onMouseEnter={() => setHoveredBtn(`${q.id}-test`)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      title="Tes Soal"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: hoveredBtn === `${q.id}-test` ? '#10B981' : '#6B7280', 
                        transition: 'color 0.2s',
                        cursor: 'pointer', 
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      
                      <span>Test</span>
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (confirm('Hapus soal ini?')) {
                        setQuizCollections(prev => prev.map(c => {
                          if (c.id === selectedCollectionId) {
                            return {
                              ...c,
                              questions: c.questions.filter(quest => quest.id !== q.id)
                            };
                          }
                          return c;
                        }));
                      }
                    }}
                    onMouseEnter={() => setHoveredBtn(`${q.id}-delete`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    title="Hapus Soal"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: hoveredBtn === `${q.id}-delete` ? '#EF4444' : '#6B7280', 
                      transition: 'color 0.2s',
                      cursor: 'pointer', 
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span>Del</span>
                  </button>
                </div>
              </div>

              
              {q.questionType === 'ANAGRAM' && (
                <div style={{ background: '#064E3B33', border: '1px solid #10B981', color: '#34D399', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700' }}>
                  Kunci Jawaban Huruf: {q.options[0]}
                </div>
              )}

              {q.questionType === 'MATCHING' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {q.options.map((opt, oIdx) => {
                    if (!opt) return null;
                    const parts = opt.split(':');
                    return (
                      <div key={oIdx} style={{ background: 'var(--background-color)', border: '1px solid var(--border-color)', color: 'var(--text-color)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '800', color: '#3B82F6' }}>{parts[0]?.trim()}</span>
                        <span style={{ color: '#9CA3AF' }}>➔</span>
                        <span style={{ fontWeight: '800', color: '#10B981' }}>{parts[1]?.trim()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {q.questionType === 'CATEGORIZATION' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {q.options.slice(0, 2).map((opt, oIdx) => {
                    if (!opt) return null;
                    const parts = opt.split(':');
                    return (
                      <div key={oIdx} style={{ background: 'var(--background-color)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '800', color: '#EAB308', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', marginBottom: '6px' }}>
                          Kategori: {parts[0]?.trim()}
                        </div>
                        <div style={{ color: 'var(--text-color)' }}>
                          {parts[1]?.split(',').map((item, iIdx) => (
                            <span key={iIdx} style={{ display: 'inline-block', background: 'var(--border-color)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', marginRight: '4px', marginBottom: '4px' }}>
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {(!q.questionType || ['CLASSIC', 'BLANKS', '3D_MAP', 'GUESS_ARTIFACT'].includes(q.questionType)) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '16px' }}>
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    return (
                      <div 
                        key={oIdx}
                        style={{ 
                          background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'transparent', 
                          border: 'none',
                          color: isCorrect ? '#10B981' : '#9CA3AF',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: isCorrect ? '700' : '500'
                        }}
                      >
                        {oIdx === 0 ? 'A. ' : oIdx === 1 ? 'B. ' : oIdx === 2 ? 'C. ' : 'D. '} {opt}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
}
