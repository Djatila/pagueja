"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "pendente" | "pago" | "atrasado" | "em_dia" | "pendente_conferencia";

interface AlunoForm {
  nome: string;
  clientPhone: string;
  plano: string;
}

interface MensalidadeForm {
  id: string | null;
  valor: string;
  data_vencimento: string;
  status: Status;
}

interface Props {
  alunoId: string | number;
  onClose: () => void;
  onSalvo: () => void;
  session: any;
  showToast: any;
}

// ─── Design tokens (espelha GymFlow.tsx) ─────────────────────────────────────
const overlay: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.78)",
  backdropFilter: "blur(6px)",
  zIndex: 200,
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: 16,
};
const card: React.CSSProperties = {
  background: "#111116",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  width: "100%", maxWidth: 560,
  boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
  display: "flex", flexDirection: "column",
  maxHeight: "92vh", overflow: "hidden",
};
const inp: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8, padding: "10px 13px",
  color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit",
};
const lbl: React.CSSProperties = {
  display: "block", color: "rgba(255,255,255,0.35)",
  fontSize: 10, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
};
const sectionTitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.1em",
  marginBottom: 14, paddingBottom: 8,
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const PLANOS = ["Mensal", "Mensal Plus", "Trimestral", "Semestral", "Anual"];
const STATUS_OPTS: { v: Status; l: string }[] = [
  { v: "pendente",  l: "A Vencer"  },
  { v: "pago",      l: "Pago / Em Dia" },
  { v: "atrasado",  l: "Atrasado"  },
];

function Spinner() {
  return (
    <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ModalEditarAluno({ alunoId, onClose, onSalvo, session, showToast }: Props) {
  const academiaId = session?.user?.id;
  const [tab, setTab]               = useState<"dados" | "cobranca">("dados");
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [aluno, setAluno]           = useState<AlunoForm>({ nome: "", clientPhone: "", plano: "Mensal" });
  const [mens, setMens]             = useState<MensalidadeForm>({ id: null, valor: "", data_vencimento: "", status: "pendente" });

  // ─── Load data ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: aData, error } = await supabase
        .from('alunos_pix')
        .select('nome, clientPhone, plano, mensalidades_pix(id, valor, data_vencimento, status)')
        .eq('id', alunoId)
        .eq('academia_id', academiaId)
        .single();

      if (aData) {
        setAluno({
          nome: aData.nome ?? "",
          clientPhone: aData.clientPhone ?? "",
          plano: aData.plano ?? "Mensal",
        });

        const mensArray = Array.isArray(aData.mensalidades_pix) ? [...aData.mensalidades_pix] : [];
        mensArray.sort((x: any, y: any) => new Date(y.data_vencimento).getTime() - new Date(x.data_vencimento).getTime());
        const mData = mensArray[0] || null;

        if (mData) {
          setMens({
            id: mData.id,
            valor: String(mData.valor ?? ""),
            data_vencimento: mData.data_vencimento?.slice(0, 10) ?? "",
            status: (mData.status as Status) ?? "pendente",
          });
        }
      }

      setLoading(false);
    }
    load();
  }, [alunoId, academiaId]);

  // ─── Save ────────────────────────────────────────────────────────────────
  const salvar = async () => {
    if (!aluno.nome.trim()) { showToast("Nome é obrigatório.", "error"); return; }
    setSaving(true);

    let cleanedWpp = aluno.clientPhone.replace(/\D/g, "");
    if (cleanedWpp.length === 10 || cleanedWpp.length === 11) {
      cleanedWpp = "55" + cleanedWpp;
    }

    const { error: eAluno } = await supabase
      .from('alunos_pix')
      .update({
        nome: aluno.nome,
        clientPhone: cleanedWpp,
        plano: aluno.plano
      })
      .eq('id', alunoId)
      .eq('academia_id', academiaId);

    if (eAluno) { showToast(`Erro ao salvar aluno: ${eAluno.message}`, "error"); setSaving(false); return; }

    if (mens.data_vencimento) {
      if (mens.id) {
        const { error: eMens } = await supabase.from('mensalidades_pix').update({
          valor: Number(mens.valor),
          data_vencimento: mens.data_vencimento,
          status: mens.status
        })
        .eq('id', mens.id)
        .eq('academia_id', academiaId);
        if (eMens) {
          showToast(`Erro ao salvar mensalidade: ${eMens.message}`, "error");
          setSaving(false);
          return;
        }
      } else {
        const { error: eMens } = await supabase.from('mensalidades_pix').insert([{
          aluno_id: alunoId,
          valor: Number(mens.valor),
          data_vencimento: mens.data_vencimento,
          status: mens.status,
          academia_id: academiaId
        }]);
        if (eMens) {
          showToast(`Erro ao criar mensalidade: ${eMens.message}`, "error");
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    showToast("Dados salvos com sucesso!", "success");
    setTimeout(() => { onSalvo(); onClose(); }, 1200);
  };

  // ─── Delete ──────────────────────────────────────────────────────────────
  const deletar = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o aluno "${aluno.nome}"? Esta ação é irreversível e removerá também todo o histórico de cobranças.`)) return;
    
    setDeleting(true);
    const { error } = await supabase
      .from('alunos_pix')
      .delete()
      .eq('id', alunoId)
      .eq('academia_id', academiaId);

    if (error) {
      showToast(`Erro ao excluir aluno: ${error.message}`, "error");
      setDeleting(false);
      return;
    }

    showToast("Aluno removido com sucesso.", "success");
    onSalvo();
    onClose();
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={card}>

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Editar Aluno</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>
              {loading ? "Carregando..." : aluno.nome || "—"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 6, display: "flex", borderRadius: 6 }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          {([
            { id: "dados",    label: "Dados do Aluno" },
            { id: "cobranca", label: "Configurações de Cobrança" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "12px 16px", background: "none", border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: tab === t.id ? "#fff" : "rgba(255,255,255,0.35)",
                borderBottom: tab === t.id ? "2px solid #10b981" : "2px solid transparent",
                marginBottom: -1, transition: "all .15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>


        {/* Body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0", gap: 10, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
              <Spinner /> Carregando dados...
            </div>
          ) : (
            <>
              {/* ── Tab: Dados do Aluno ── */}
              {tab === "dados" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={sectionTitle}>Informações Pessoais</div>

                  <div>
                    <label style={lbl}>Nome Completo *</label>
                    <input
                      style={inp}
                      value={aluno.nome}
                      onChange={(e) => setAluno({ ...aluno, nome: e.target.value })}
                      placeholder="Ex: João Silva"
                    />
                  </div>

                  <div>
                    <label style={lbl}>WhatsApp</label>
                    <input
                      style={{ ...inp, fontFamily: "monospace" }}
                      value={aluno.clientPhone}
                      onChange={(e) => setAluno({ ...aluno, clientPhone: e.target.value })}
                      placeholder="(11) 99999-0000"
                    />
                    <div style={{ marginTop: 5, fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
                      Inclua o DDD. Usado para os disparos automáticos via WhatsApp.
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Plano</label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={aluno.plano}
                        onChange={(e) => setAluno({ ...aluno, plano: e.target.value })}
                        style={{ ...inp, appearance: "none", cursor: "pointer", paddingRight: 36 }}
                      >
                        {PLANOS.map((p) => (
                          <option key={p} value={p} style={{ background: "#111116" }}>{p}</option>
                        ))}
                      </select>
                      <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }} width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tab: Configurações de Cobrança ── */}
              {tab === "cobranca" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={sectionTitle}>Mensalidade Atual</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label style={lbl}>Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        style={{ ...inp, fontFamily: "monospace" }}
                        value={mens.valor}
                        onChange={(e) => setMens({ ...mens, valor: e.target.value })}
                        placeholder="0,00"
                      />
                    </div>

                    <div>
                      <label style={lbl}>Data de Vencimento</label>
                      <input
                        type="date"
                        style={{ ...inp, fontFamily: "monospace" }}
                        value={mens.data_vencimento}
                        onChange={(e) => setMens({ ...mens, data_vencimento: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Status da Mensalidade</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {STATUS_OPTS.map((s) => {
                        const active = mens.status === s.v;
                        const colors: Record<string, string> = {
                          pago: "#34d399", em_dia: "#34d399",
                          pendente: "#60a5fa", atrasado: "#f87171",
                        };
                        const col = colors[s.v] ?? "#fff";
                        return (
                          <button
                            key={s.v}
                            onClick={() => setMens({ ...mens, status: s.v })}
                            style={{
                              padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                              background: active ? `${col}12` : "rgba(255,255,255,0.03)",
                              border: `1px solid ${active ? `${col}40` : "rgba(255,255,255,0.07)"}`,
                              color: active ? col : "rgba(255,255,255,0.4)",
                              fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 7,
                              transition: "all .15s",
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? col : "rgba(255,255,255,0.15)", display: "inline-block", flexShrink: 0 }} />
                            {s.l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Info block */}
                  <div style={{ marginTop: 4, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      Resumo da Cobrança
                    </div>
                    {[
                      { k: "Plano",       v: aluno.plano || "—"                                                        },
                      { k: "Valor",       v: mens.valor ? `R$ ${parseFloat(mens.valor).toFixed(2).replace(".", ",")}` : "—" },
                      { k: "Vencimento",  v: mens.data_vencimento ? new Date(mens.data_vencimento + "T12:00:00").toLocaleDateString("pt-BR") : "—" },
                      { k: "Status",      v: STATUS_OPTS.find(s => s.v === mens.status)?.l ?? "—"                       },
                    ].map((r) => (
                      <div key={r.k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>{r.k}</span>
                        <span style={{ color: "#e5e7eb", fontWeight: 500 }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={deletar}
            disabled={deleting || saving || loading}
            style={{ 
              padding: "11px 14px", borderRadius: 8, 
              border: "1px solid rgba(248,113,113,0.2)", 
              background: "rgba(248,113,113,0.05)", 
              color: "#f87171", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            title="Excluir Aluno"
          >
            {deleting ? <Spinner /> : (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={saving || loading}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 8, border: "none",
              background: saving ? "rgba(16,185,129,0.5)" : "#10b981",
              color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all .2s",
            }}
          >
            {saving ? <><Spinner /> Salvando...</> : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
