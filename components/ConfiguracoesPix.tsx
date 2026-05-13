"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

// ─── academia_id (recuperado do auth) ─────────────────────────────────────────
// const MOCK_ACADEMIA_ID = "00000000-0000-0000-0000-000000000001";

type TipoChave = "cpf" | "cnpj" | "email" | "telefone" | "aleatoria";
type ToastState = { type: "success" | "error"; msg: string } | null;

// ─── Design tokens — espelha GymFlow.tsx ─────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "#111116",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "10px 13px",
  color: "#fff",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.35)",
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 6,
};

const TIPOS: { value: TipoChave; label: string; placeholder: string }[] = [
  { value: "cpf",       label: "CPF",             placeholder: "Ex: 000.000.000-00"                    },
  { value: "cnpj",      label: "CNPJ",            placeholder: "Ex: 00.000.000/0001-00"                },
  { value: "email",     label: "E-mail",           placeholder: "Ex: contato@academia.com"              },
  { value: "telefone",  label: "Telefone",         placeholder: "Ex: +55 11 99999-0000"                 },
  { value: "aleatoria", label: "Chave Aleatória",  placeholder: "Ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
];

function SpinnerIcon() {
  return (
    <svg
      width={14} height={14} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function ConfiguracoesPix({ showToast }: { showToast: any }) {
  const [tipo, setTipo]               = useState<TipoChave>("cpf");
  const [chave, setChave]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [configurado, setConfigurado] = useState(false);
  const tipoInfo = TIPOS.find((t) => t.value === tipo)!;

  // ─── GET: carrega config existente ────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const academiaId = session?.user?.id;
      
      if (!academiaId) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      const { data } = await supabase
        .from("configuracoes_pix")
        .select("chave_pix, tipo_chave")
        .eq("academia_id", academiaId)
        .maybeSingle();

      if (data) {
        setChave(data.chave_pix ?? "");
        setTipo((data.tipo_chave as TipoChave) ?? "cpf");
        setConfigurado(true);
      }
      setLoadingData(false);
    }
    load();
  }, []);

  // ─── UPSERT: salva ────────────────────────────────────────────────────────
  const handleSalvar = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const academiaId = session?.user?.id;

    if (!academiaId) {
      showToast("Sessão não encontrada. Faça login novamente.", "error");
      return;
    }

    if (!chave.trim()) {
      showToast("A chave PIX não pode estar vazia.", "error");
      return;
    }

    setLoading(true);
    const payload = {
      academia_id: academiaId,
      chave_pix: chave.trim(),
      tipo_chave: tipo,
      atualizado_em: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("configuracoes_pix")
      .upsert(payload, { onConflict: "academia_id" });
    setLoading(false);
    if (error) {
      showToast(`Erro ao salvar: ${error.message}`, "error");
    } else {
      setConfigurado(true);
      showToast("Chave PIX salva com sucesso!", "success");
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  if (loadingData) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <SpinnerIcon />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Carregando configurações...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", margin: 0 }}>
            Configurações PIX
          </h1>
          <p style={{ color: "rgba(255,255,255,0.33)", fontSize: 13, margin: "3px 0 0" }}>
            Gerencie sua chave de recebimento PIX
          </p>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: configurado ? "#052e16" : "rgba(255,255,255,0.04)",
          border: configurado ? "1px solid #065f46" : "1px solid rgba(255,255,255,0.08)",
          color: configurado ? "#34d399" : "rgba(255,255,255,0.3)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: configurado ? "#34d399" : "rgba(255,255,255,0.2)", display: "inline-block" }} />
          {configurado ? "Chave Configurada" : "Não Configurado"}
        </span>
      </div>


      {/* Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 items-start">

        {/* Formulário */}
        <div style={{ ...cardStyle, padding: 28 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              Chave de Recebimento PIX
            </div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 1.6 }}>
              Esta chave será utilizada pelo sistema de cobrança automática para gerar os links de pagamento
              enviados aos alunos via WhatsApp pela régua de cobrança.
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Tipo select */}
            <div>
              <label style={labelStyle}>Tipo de Chave</label>
              <div style={{ position: "relative" }}>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoChave)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: 36 }}
                >
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value} style={{ background: "#111116" }}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {/* chevron */}
                <svg
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }}
                  width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Chave input */}
            <div>
              <label style={labelStyle}>Chave PIX</label>
              <input
                type={tipo === "email" ? "email" : "text"}
                value={chave}
                onChange={(e) => setChave(e.target.value)}
                placeholder={tipoInfo.placeholder}
                style={{
                  ...inputStyle,
                  fontFamily: tipo === "aleatoria" ? "monospace" : "inherit",
                  borderColor: chave ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)",
                }}
              />
              {chave && (
                <div style={{ marginTop: 5, fontSize: 11, color: "rgba(52,211,153,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckIcon />
                  Chave preenchida
                </div>
              )}
            </div>

            {/* Botão salvar */}
            <button
              onClick={handleSalvar}
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px 0",
                borderRadius: 10,
                border: "none",
                background: loading ? "rgba(16,185,129,0.5)" : "#10b981",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? <><SpinnerIcon /> Salvando...</> : <><CheckIcon /> Salvar Configuração</>}
            </button>
          </div>
        </div>

        {/* Coluna lateral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Preview da config atual */}
          {configurado && chave && (
            <div style={{ ...cardStyle, padding: 18 }}>
              <div style={labelStyle}>Configuração Atual</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, marginBottom: 3 }}>Tipo</div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                  {TIPOS.find((t) => t.value === tipo)?.label}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, marginBottom: 3 }}>Chave</div>
                <div style={{ color: "#34d399", fontSize: 12, fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {chave}
                </div>
              </div>
            </div>
          )}

          {/* Como funciona */}
          <div style={{ ...cardStyle, padding: 18 }}>
            <div style={labelStyle}>Como funciona</div>
            {[
              "O sistema de cobrança automática usa sua chave PIX para gerar mensagens de pagamento.",
              "Os alunos recebem a chave via WhatsApp com o valor e a data de vencimento.",
              "Ao salvar, o workflow n8n usa a nova chave imediatamente nos próximos disparos.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#34d399",
                }}>
                  {i + 1}
                </div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Aviso */}
          <div style={{ ...cardStyle, padding: 16, background: "rgba(28,17,0,0.8)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 600, marginBottom: 6 }}>⚠️  Atenção</div>
            <p style={{ color: "rgba(251,191,36,0.55)", fontSize: 11, margin: 0, lineHeight: 1.5 }}>
              Alterar a chave PIX afeta os próximos disparos automáticos. Certifique-se de que a chave está ativa e correta antes de salvar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
