"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import ConfiguracoesPix from "./ConfiguracoesPix";
import ModalEditarAluno from "./ModalEditarAluno";

// ─────────────────────────────────────────────────────────────────────────────
// ICONS  (SVG inline — zero extra dependencies)
// ─────────────────────────────────────────────────────────────────────────────
type IconProps = { size?: number; className?: string; style?: React.CSSProperties; onClick?: React.MouseEventHandler<SVGSVGElement> };

const mkIcon =
  (paths: string[]) =>
  ({ size = 16, className = "", style, onClick }: IconProps) =>
    (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
        onClick={onClick}
      >
        {paths.map((p, i) => (
          <path key={i} d={p} />
        ))}
      </svg>
    );

const LayoutDashboardIcon = ({ size = 16, className = "", style, onClick }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} onClick={onClick}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);
const DumbbellIcon = ({ size = 16, className = "", style, onClick }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} onClick={onClick}>
    <path d="M6 5v14M18 5v14M3 9h3M18 9h3M3 15h3M18 15h3M6 9h12M6 15h12" />
  </svg>
);
const LoaderIcon = ({ size = 16, className = "", style, onClick }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} onClick={onClick}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const UsersIcon       = mkIcon(["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]);
const ScanIcon        = mkIcon(["M3 7V5a2 2 0 0 1 2-2h2", "M17 3h2a2 2 0 0 1 2 2v2", "M21 17v2a2 2 0 0 1-2 2h-2", "M7 21H5a2 2 0 0 1-2-2v-2"]);
const MegaphoneIcon   = mkIcon(["m3 11 18-5v12L3 13v-2z", "M11.6 16.8a3 3 0 1 1-5.8-1.6"]);
const TrendingUpIcon  = mkIcon(["m22 7-8.5 8.5-5-5L2 17", "M16 7h6v6"]);
const AlertTriIcon    = mkIcon(["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", "M12 9v4", "M12 17h.01"]);
const AlertCircleIcon = mkIcon(["M12 8v4", "M12 16h.01", "M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z"]);
const CheckCircleIcon = mkIcon(["M22 11.08V12a10 10 0 1 1-5.93-9.14", "m9 11 3 3L22 4"]);
const ClockIcon       = mkIcon(["M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2", "M12 6v6l4 2"]);
const PlusIcon        = mkIcon(["M5 12h14", "M12 5v14"]);
const SearchIcon      = mkIcon(["m21 21-4.35-4.35", "M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0"]);
const MoreHorizIcon   = mkIcon(["M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2", "M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2", "M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2"]);
const XIcon           = mkIcon(["M18 6 6 18", "M6 6l12 12"]);
const XCircleIcon     = mkIcon(["m15 9-6 6", "M9 9l6 6", "M22 12A10 10 0 1 0 2 12a10 10 0 0 0 20 0"]);
const LogOutIcon      = mkIcon(["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"]);
const ImageOffIcon    = mkIcon(["M3 3l18 18", "M21 21H3a2 2 0 0 1-2-2V3", "M16 4H9c-1.1 0-2 .9-2 2v2", "M21 15V6a2 2 0 0 0-2-2h-1"]);
const ExtLinkIcon     = mkIcon(["M15 3h6v6", "M10 14 21 3", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"]);
const SendIcon        = mkIcon(["m22 2-7 20-4-9-9-4z", "M22 2 11 13"]);
const SettingsIcon    = mkIcon(["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]);
const TrashIcon       = mkIcon(["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", "M10 11v6", "M14 11v6"]);

// ─────────────────────────────────────────────────────────────────────────────
// DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Status = "em_dia" | "pendente" | "atrasado" | "pago" | "pendente_conferencia";

interface Aluno {
  id: string | number;
  nome: string;
  wpp: string;
  plano: string;
  venc: string;
  status: Status;
}

interface Comprovante {
  id: string;
  aluno: string;
  wpp: string;
  valorEsp: number | null;
  valorIA: number;
  data: string;
  chave: string;
  conf: number;
  motivo: string;
  imagem: string | null;
}

const PLANOS = ["Mensal", "Mensal Plus", "Trimestral", "Semestral", "Anual"];

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const toBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const STATUS_CFG: Record<Status, { label: string; dot: string; badge: string }> = {
  em_dia:   { label: "Em Dia",   dot: "#34d399", badge: "bg-emerald-950 text-emerald-300 border-emerald-800" },
  pago:     { label: "Pago",     dot: "#34d399", badge: "bg-emerald-950 text-emerald-300 border-emerald-800" },
  pendente: { label: "A Vencer", dot: "#60a5fa", badge: "bg-blue-950 text-blue-300 border-blue-800" },
  pendente_conferencia: { label: "Em Revisão", dot: "#fbbf24", badge: "bg-amber-950 text-amber-300 border-amber-800" },
  atrasado: { label: "Atrasado", dot: "#f87171", badge: "bg-red-950 text-red-300 border-red-800" },
};

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.badge}`}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function ConfBadge({ v }: { v: number }) {
  const c = v >= 80 ? "#34d399" : v >= 60 ? "#fbbf24" : "#f87171";
  return <span style={{ color: c }} className="font-mono font-bold text-sm">{v}%</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STYLES
// ─────────────────────────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: "#111116",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
};
const thStyle: React.CSSProperties = {
  padding: "10px 18px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 600,
  color: "rgba(255,255,255,0.25)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};
const tdBase: React.CSSProperties = {
  padding: "12px 18px",
  fontSize: 13,
  borderBottom: "1px solid rgba(255,255,255,0.03)",
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

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
type PageId = "dashboard" | "alunos" | "comprovantes" | "avisos" | "configuracoes";

const NAV: { id: PageId; label: string; Icon: React.FC<IconProps> }[] = [
  { id: "dashboard",    label: "Dashboard",        Icon: LayoutDashboardIcon },
  { id: "alunos",       label: "Alunos",           Icon: UsersIcon           },
  { id: "comprovantes", label: "Comprovantes",      Icon: ScanIcon            },
  { id: "avisos",       label: "Central de Avisos", Icon: MegaphoneIcon       },
  { id: "configuracoes",label: "Config. PIX",       Icon: SettingsIcon        },
];

function MobileNav({ active, onChange, comprovantesCount }: { active: PageId; onChange: (p: PageId) => void; comprovantesCount: number }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0d10] border-t border-white/10 flex justify-around items-center p-2 z-50 pb-safe">
      {NAV.map(({ id, label, Icon }) => {
        const on = active === id;
        const badge = id === "comprovantes" ? comprovantesCount : 0;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 4px",
              background: "transparent", border: "none", cursor: "pointer",
              color: on ? "#34d399" : "rgba(255,255,255,0.38)",
              position: "relative", flex: 1
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>{label.split(" ")[0]}</span>
            {badge > 0 && (
              <span style={{ position: "absolute", top: 4, right: "calc(50% - 16px)", background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function Sidebar({ active, onChange, session, comprovantesCount }: { active: PageId; onChange: (p: PageId) => void; session: any; comprovantesCount: number }) {
  const user = session?.user;
  const userEmail = user?.email || "academia@gym.com";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  return (
    <aside className="hidden md:flex" style={{ width: 220, background: "#0d0d10", borderRight: "1px solid rgba(255,255,255,0.06)", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#34d399,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DumbbellIcon size={15} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px" }}>Pague Já</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "monospace" }}>PRO PLAN</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ id, label, Icon }) => {
          const on = active === id;
          const badge = id === "comprovantes" ? comprovantesCount : 0;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8,
                border: "none", cursor: "pointer", width: "100%", textAlign: "left", position: "relative",
                background: on ? "rgba(255,255,255,0.07)" : "transparent",
                color: on ? "#fff" : "rgba(255,255,255,0.38)",
                fontSize: 13, fontWeight: 500, transition: "all .15s",
              }}
            >
              {on && <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: "#34d399", borderRadius: "0 4px 4px 0" }} />}
              <Icon size={15} style={on ? { color: "#34d399" } : {}} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#374151,#1f2937)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{userInitial}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500 }}>Admin</div>
          <div style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>
        </div>
        <LogOutIcon size={14} style={{ color: "rgba(255,255,255,0.22)", cursor: "pointer" }} onClick={handleLogout} />
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.4px", margin: 0 }}>{title}</h1>
        {sub && <p style={{ color: "rgba(255,255,255,0.33)", fontSize: 13, margin: "3px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({ session, showToast }: { session: any; showToast: any }) {
  const academiaId = session?.user?.id;
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [vencimentos, setVencimentos] = useState<any[]>([]);
  const [mrr, setMrr] = useState(0);
  const [alunosAtivos, setAlunosAtivos] = useState(0);
  const [inadimplencia, setInadimplencia] = useState(0);

  useEffect(() => {
    if (!academiaId) return;

    async function load() {
      // Últimos pagamentos
      const { data: pags } = await supabase.from('mensalidades_pix').select('id, valor, data_pagamento, alunos_pix(nome, plano)').eq('status', 'pago').eq('academia_id', academiaId).order('data_pagamento', { ascending: false }).limit(5);
      if (pags) {
        setPagamentos(pags.map((p: any) => ({ id: p.id, nome: p.alunos_pix?.nome || 'Desc', plano: p.alunos_pix?.plano || 'N/A', valor: p.valor, data: p.data_pagamento ? new Date(p.data_pagamento).toLocaleDateString('pt-BR') : '--/--/----' })));
      }

      // Próximos Vencimentos
      const today = new Date().toISOString().split('T')[0];
      const dateIn7Days = new Date();
      dateIn7Days.setDate(dateIn7Days.getDate() + 7);
      const iso7Days = dateIn7Days.toISOString().split('T')[0];
      
      const { data: vencs } = await supabase.from('mensalidades_pix').select('id, valor, data_vencimento, alunos_pix(nome, plano)').eq('academia_id', academiaId).gte('data_vencimento', today).lte('data_vencimento', iso7Days).neq('status', 'pago').order('data_vencimento', { ascending: true }).limit(5);
      if (vencs) {
        setVencimentos(vencs.map((v: any) => {
          const d = new Date(v.data_vencimento);
          const diff = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          return { id: v.id, nome: v.alunos_pix?.nome || 'Desc', plano: v.alunos_pix?.plano || 'N/A', valor: v.valor, dias: diff >= 0 ? diff : 0 };
        }));
      }

      // Métricas Principais
      const { data: mrrData } = await supabase.from('mensalidades_pix').select('valor').eq('status', 'pago').eq('academia_id', academiaId);
      if (mrrData) setMrr(mrrData.reduce((acc: number, curr: any) => acc + Number(curr.valor), 0));
      
      const { count: countAtivos } = await supabase.from('alunos_pix').select('*', { count: 'exact', head: true }).eq('academia_id', academiaId);
      if (countAtivos !== null) setAlunosAtivos(countAtivos);
      
      const { count: countAtrasados } = await supabase.from('mensalidades_pix').select('*', { count: 'exact', head: true }).eq('status', 'atrasado').eq('academia_id', academiaId);
      if (countAtrasados !== null && countAtivos) setInadimplencia(Math.round((countAtrasados / countAtivos) * 100));
    }
    load();
  }, [academiaId]);

  const metrics = [
    { label: "Receita (Total Pagos)", value: toBRL(mrr), sub: "Atualizado em tempo real", bg: "#052e16", icon: <TrendingUpIcon size={14} style={{ color: "#34d399" }} /> },
    { label: "Inadimplência", value: `${inadimplencia}%`, sub: "Porcentagem em atraso", bg: "#450a0a", icon: <AlertTriIcon size={14} style={{ color: "#f87171" }} /> },
    { label: "Alunos Ativos", value: alunosAtivos, sub: "Total na base de dados", bg: "#172554", icon: <UsersIcon size={14} style={{ color: "#60a5fa" }} /> },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" sub="Visão geral" />

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {metrics.map((m) => (
          <div key={m.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{m.label}</span>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.icon}</div>
            </div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "monospace", letterSpacing: "-0.5px" }}>{m.value}</div>
            <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 12, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Últimos pagamentos — TODO: supabase.from('pagamentos').select('*').eq('status','confirmado').order('created_at',{ascending:false}).limit(5) */}
        <div style={cardStyle}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircleIcon size={13} style={{ color: "#34d399" }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Últimos Pagamentos</span>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr>{["Aluno", "Plano", "Valor", "Data"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {pagamentos.map((p, i) => (
                  <tr key={p.id}>
                    <td style={{ ...tdBase, color: "#e5e7eb", fontWeight: 500, borderBottom: i === pagamentos.length - 1 ? "none" : tdBase.borderBottom }}>{p.nome}</td>
                    <td style={{ ...tdBase, color: "rgba(255,255,255,0.38)", borderBottom: i === pagamentos.length - 1 ? "none" : tdBase.borderBottom }}>{p.plano}</td>
                    <td style={{ ...tdBase, color: "#34d399", fontFamily: "monospace", fontWeight: 600, borderBottom: i === pagamentos.length - 1 ? "none" : tdBase.borderBottom }}>{toBRL(p.valor)}</td>
                    <td style={{ ...tdBase, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", borderBottom: i === pagamentos.length - 1 ? "none" : tdBase.borderBottom }}>{p.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Próximos vencimentos — TODO: supabase.from('alunos').select('*').lte('vencimento', dateIn7Days).gte('vencimento', today) */}
        <div style={cardStyle}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <ClockIcon size={13} style={{ color: "#fbbf24" }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Vencimentos em 7 dias</span>
          </div>
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr>{["Aluno", "Plano", "Valor", "Vence em"].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {vencimentos.map((v, i) => (
                  <tr key={v.id}>
                    <td style={{ ...tdBase, color: "#e5e7eb", fontWeight: 500, borderBottom: i === vencimentos.length - 1 ? "none" : tdBase.borderBottom }}>{v.nome}</td>
                    <td style={{ ...tdBase, color: "rgba(255,255,255,0.38)", borderBottom: i === vencimentos.length - 1 ? "none" : tdBase.borderBottom }}>{v.plano}</td>
                    <td style={{ ...tdBase, color: "rgba(255,255,255,0.6)", fontFamily: "monospace", borderBottom: i === vencimentos.length - 1 ? "none" : tdBase.borderBottom }}>{toBRL(v.valor)}</td>
                    <td style={{ ...tdBase, borderBottom: i === vencimentos.length - 1 ? "none" : tdBase.borderBottom }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: v.dias <= 2 ? "#f87171" : v.dias <= 4 ? "#fbbf24" : "rgba(255,255,255,0.45)" }}>{v.dias}d</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL NOVO ALUNO
// ─────────────────────────────────────────────────────────────────────────────
function ModalNovoAluno({ onClose, onCadastrado, session, showToast }: { onClose: () => void; onCadastrado?: () => void; session: any; showToast: any }) {
  const academiaId = session?.user?.id;
  const [form, setForm] = useState({ nome: "", wpp: "", plano: "", venc: "" });
  const [loading, setLoading] = useState(false);
  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    
    let cleanedWpp = form.wpp.replace(/\D/g, "");
    if (cleanedWpp.length === 10 || cleanedWpp.length === 11) {
      cleanedWpp = "55" + cleanedWpp;
    }

    const { data: aluno, error } = await supabase.from('alunos_pix').insert([{
      nome: form.nome,
      clientPhone: cleanedWpp,
      plano: form.plano,
      academia_id: academiaId
    }]).select().single();
    
    if (error) {
      console.error("Erro ao cadastrar aluno:", error);
      if (error.code === '23505') {
        showToast("Este número de telefone já está cadastrado para outro aluno.", "error");
      } else {
        showToast("Erro ao cadastrar aluno. Verifique as permissões ou tente novamente.", "error");
      }
      setLoading(false);
      return;
    }

    if (aluno && form.venc) {
      const { error: errorMens } = await supabase.from('mensalidades_pix').insert([{
        aluno_id: aluno.id,
        valor: form.plano.includes('Plus') ? 129.9 : form.plano === 'Trimestral' ? 299.7 : 89.9,
        data_vencimento: form.venc,
        status: 'pendente',
        academia_id: academiaId
      }]);

      if (errorMens) {
        console.error("Erro ao criar mensalidade:", errorMens);
        showToast("Aluno cadastrado, mas houve erro ao gerar mensalidade.", "error");
      } else {
        showToast("Aluno cadastrado com sucesso!", "success");
      }
    }
    
    setLoading(false);
    if (onCadastrado) onCadastrado();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ ...cardStyle, width: "100%", maxWidth: 420, boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Novo Aluno</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex" }}>
            <XIcon size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome completo</label>
            <input style={inputStyle} placeholder="Ex: João Silva" value={form.nome} onChange={up("nome")} />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp</label>
            <input style={inputStyle} placeholder="(11) 99999-0000" value={form.wpp} onChange={up("wpp")} />
          </div>
          <div>
            <label style={labelStyle}>Plano</label>
            <select style={{ ...inputStyle, appearance: "none" }} value={form.plano} onChange={up("plano")}>
              <option value="" style={{ background: "#111116" }}>Selecione...</option>
              {PLANOS.map((p) => <option key={p} value={p} style={{ background: "#111116" }}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Data de Vencimento</label>
            <input type="date" style={inputStyle} value={form.venc} onChange={up("venc")} />
          </div>
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Cadastrando..." : "Cadastrar Aluno"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GESTÃO DE ALUNOS
// TODO: supabase.from('alunos').select('*').order('nome')
// ─────────────────────────────────────────────────────────────────────────────
function Alunos({ session, showToast }: { session: any; showToast: any }) {
  const academiaId = session?.user?.id;
  const [showModal, setShowModal]           = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState<string | number | null>(null);
  const [busca, setBusca]                   = useState("");
  const [filtro, setFiltro]                 = useState<"todos" | Status>("todos");
  const [alunos, setAlunos]                 = useState<Aluno[]>([]);

  const carregarAlunos = async () => {
    if (!academiaId) return;
    const { data, error } = await supabase.from('alunos_pix').select('id, nome, clientPhone, plano, mensalidades_pix(data_vencimento, status)').eq('academia_id', academiaId).order('nome');
    if (error || !data || data.length === 0) return;
    const formatados = data.map((a: any) => {
      const mens = a.mensalidades_pix || [];
      mens.sort((x: any, y: any) => new Date(y.data_vencimento).getTime() - new Date(x.data_vencimento).getTime());
      const ultima = mens[0];
      let calcStatus = ultima?.status || 'em_dia';
      if (calcStatus === 'pago') calcStatus = 'em_dia';
      else if (calcStatus === 'pendente' && ultima?.data_vencimento) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const venc = new Date(ultima.data_vencimento + 'T12:00:00');
        venc.setHours(0, 0, 0, 0);
        if (today > venc) calcStatus = 'atrasado';
      }
      
      return {
        id: a.id,
        nome: a.nome,
        wpp: a.clientPhone,
        plano: a.plano || "N/A",
        venc: ultima ? new Date(ultima.data_vencimento + 'T12:00:00').toLocaleDateString('pt-BR') : "--/--/----",
        status: calcStatus
      };
    });
    setAlunos(formatados);
  };

  useEffect(() => {
    carregarAlunos();
  }, [academiaId]);

  const handleDeleteAluno = async (id: string | number) => {
    if (!window.confirm("Tem certeza que deseja deletar este aluno? Esta ação não pode ser desfeita.")) return;
    
    const { error } = await supabase.from('alunos_pix').delete().eq('id', id);
    if (error) {
      showToast("Erro ao deletar aluno.", "error");
      console.error(error);
    } else {
      showToast("Aluno deletado com sucesso.", "success");
      carregarAlunos();
    }
  };

  const filtered = alunos.filter(
    (a) =>
      a.nome.toLowerCase().includes(busca.toLowerCase()) &&
      (filtro === "todos" || a.status === filtro || (filtro === 'em_dia' && a.status === 'pago'))
  );

  const filtros: { v: "todos" | Status; l: string }[] = [
    { v: "todos",    l: "Todos"    },
    { v: "em_dia",   l: "Em Dia"   },
    { v: "pendente", l: "A Vencer" },
    { v: "pendente_conferencia", l: "Em Revisão" },
    { v: "atrasado", l: "Atrasado" },
  ];

  return (
    <div>
      {showModal && <ModalNovoAluno onClose={() => setShowModal(false)} onCadastrado={carregarAlunos} session={session} showToast={showToast} />}
      {alunoEditandoId !== null && (
        <ModalEditarAluno
          alunoId={alunoEditandoId}
          onClose={() => setAlunoEditandoId(null)}
          onSalvo={carregarAlunos}
          session={session}
          showToast={showToast}
        />
      )}
      <PageHeader
        title="Gestão de Alunos"
        sub={`${alunos.length} alunos cadastrados`}
        action={
          <button
            onClick={() => setShowModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "#10b981", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, padding: "9px 16px", cursor: "pointer" }}
          >
            <PlusIcon size={14} /> Novo Aluno
          </button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative w-full md:flex-1 md:max-w-[280px]">
          <SearchIcon size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar aluno..."
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filtros.map((f) => (
          <button
            key={f.v}
            onClick={() => setFiltro(f.v)}
            style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${filtro === f.v ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`, background: filtro === f.v ? "rgba(255,255,255,0.07)" : "transparent", color: filtro === f.v ? "#fff" : "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            {f.l}
          </button>
        ))}
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr>{["Nome", "WhatsApp", "Plano", "Vencimento", "Status", ""].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => {
              const last = i === filtered.length - 1;
              const bdr = last ? "none" : tdBase.borderBottom;
              return (
                <tr key={a.id}>
                  <td style={{ ...tdBase, color: "#e5e7eb", fontWeight: 500, borderBottom: bdr }}>{a.nome}</td>
                  <td style={{ ...tdBase, color: "rgba(255,255,255,0.38)", fontFamily: "monospace", borderBottom: bdr }}>{a.wpp}</td>
                  <td style={{ ...tdBase, color: "rgba(255,255,255,0.5)", borderBottom: bdr }}>{a.plano}</td>
                  <td style={{ ...tdBase, color: "rgba(255,255,255,0.38)", fontFamily: "monospace", borderBottom: bdr }}>{a.venc}</td>
                  <td style={{ ...tdBase, borderBottom: bdr }}><StatusBadge status={a.status} /></td>
                  <td style={{ ...tdBase, borderBottom: bdr, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setAlunoEditandoId(a.id)}
                        title="Editar aluno"
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          padding: "4px 6px", borderRadius: 6,
                          color: "rgba(255,255,255,0.22)",
                          display: "inline-flex", alignItems: "center",
                          transition: "color .15s, background .15s",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.22)";
                          (e.currentTarget as HTMLButtonElement).style.background = "none";
                        }}
                      >
                        <MoreHorizIcon size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteAluno(a.id)}
                        title="Deletar aluno"
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          padding: "4px 6px", borderRadius: 6,
                          color: "rgba(255,255,255,0.22)",
                          display: "inline-flex", alignItems: "center",
                          transition: "color .15s, background .15s",
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.22)";
                          (e.currentTarget as HTMLButtonElement).style.background = "none";
                        }}
                      >
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(255,255,255,0.22)", fontSize: 13 }}>Nenhum aluno encontrado.</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL DE COMPROVANTES (OCR Fallback)
// TODO: supabase.from('comprovantes').select('*').eq('status','revisao').order('created_at')
// ─────────────────────────────────────────────────────────────────────────────
function Comprovantes({ session, showToast }: { session: any; showToast: any }) {
  const academiaId = session?.user?.id;
  const [lista, setLista] = useState<Comprovante[]>([]);
  const [atual, setAtual] = useState<Comprovante | null>(null);
  const [vals, setVals] = useState({ valor: "", data: "", chave: "" });

  useEffect(() => {
    if (!academiaId) return;

    async function load() {
      const { data, error: errComp } = await supabase.from('mensalidades_pix').select('id, valor, ocr_raw_json, data_pagamento, id_transacao_pix, comprovante_url, created_at, alunos_pix(nome, clientPhone)').eq('status', 'pendente_conferencia').eq('academia_id', academiaId).order('created_at', { ascending: true });
      if (errComp) { console.error('COMPROVANTES QUERY ERROR:', JSON.stringify(errComp)); }
      if (data) {
        const formatados = data.map((c: any) => {
          let ocr = c.ocr_raw_json;
          if (typeof ocr === 'string') {
            try { ocr = JSON.parse(ocr); } catch(e) { ocr = {}; }
          }
          const valorIA = ocr?.valor_pago || 0;
          const valorIgual = Number(c.valor) === Number(valorIA);
          
          let motivoDeduzido = "Divergência de valores";
          if (ocr?.status_leitura && ocr.status_leitura !== "sucesso") {
            motivoDeduzido = "Falha na leitura (imagem ruim ou não é um PIX)";
          } else if (valorIgual) {
            motivoDeduzido = "Comprovante duplicado (Transação já utilizada)";
          } else {
            motivoDeduzido = `Valor divergente (Esperado: R$ ${c.valor} / Lido: R$ ${valorIA})`;
          }
          
          return {
            id: c.id,
            aluno: c.alunos_pix?.nome || "Desconhecido",
            wpp: c.alunos_pix?.clientPhone || "Sem número",
            valorEsp: c.valor,
            valorIA: valorIA,
            data: c.data_pagamento ? new Date(c.data_pagamento).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
            chave: c.id_transacao_pix || ocr?.id_transacao || "",
            conf: ocr?.confianca || 50,
            motivo: ocr?.motivo || motivoDeduzido,
            imagem: c.comprovante_url || null
          };
        });
        setLista(formatados);
        if (formatados.length > 0) {
          setAtual(formatados[0]);
          setVals({ valor: String(formatados[0].valorIA), data: formatados[0].data, chave: formatados[0].chave });
        }
      }
    }
    load();
  }, [academiaId]);

  const selecionar = (c: Comprovante) => {
    setAtual(c);
    setVals({ valor: String(c.valorIA), data: c.data, chave: c.chave });
  };

  const agir = async (acao: 'aprovar' | 'rejeitar') => {
    if (!atual) return;
    
    const formatPhone = (phone: string) => {
      if (!phone) return "";
      let cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = "55" + cleaned;
      }
      return cleaned;
    };
    
    const wppFormatado = formatPhone(atual.wpp);

    if (acao === 'aprovar') {
      const valorFinal = Number(vals.valor) || atual.valorIA;
      const { error } = await supabase.from('mensalidades_pix').update({ status: 'pago', valor: valorFinal }).eq('id', atual.id);
      if (error) {
        showToast("Erro ao aprovar pagamento.", "error");
        return;
      }
      
      if (wppFormatado) {
        const msg = `Olá ${atual.aluno}! Seu comprovante foi conferido e seu pagamento de ${toBRL(valorFinal)} foi aprovado com sucesso. Muito obrigado!`;
        await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publico: 'especifico', mensagem: msg, telefones: [wppFormatado] })
        }).catch(e => console.error("Erro ao notificar aprovação", e));
      }

      showToast("Pagamento aprovado com sucesso!", "success");
    } else {
      const { error } = await supabase.from('mensalidades_pix').update({ status: 'pendente' }).eq('id', atual.id);
      if (error) {
        showToast("Erro ao rejeitar comprovante.", "error");
        return;
      }
      
      if (wppFormatado) {
        const msg = `Olá ${atual.aluno}, verificamos seu comprovante PIX, porém houve um problema e ele foi rejeitado. Motivo: ${atual.motivo}. Por favor, entre em contato conosco para resolvermos.`;
        await fetch('/api/avisos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publico: 'especifico', mensagem: msg, telefones: [wppFormatado] })
        }).catch(e => console.error("Erro ao notificar rejeição", e));
      }

      showToast("Comprovante rejeitado. O aluno será notificado.", "success");
    }

    const novaLista = lista.filter((c) => c.id !== atual.id);
    setLista(novaLista);
    const proximo = novaLista[0] ?? null;
    setAtual(proximo);
    if (proximo) setVals({ valor: String(proximo.valorIA), data: proximo.data, chave: proximo.chave });
  };

  const monoInput: React.CSSProperties = { ...inputStyle, fontFamily: "monospace" };

  return (
    <div>
      <PageHeader title="Central de Comprovantes" sub="Revisão manual — baixa confiança da IA" />

      {lista.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 80, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#052e16", border: "1px solid #065f46", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <CheckCircleIcon size={24} style={{ color: "#34d399" }} />
          </div>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, margin: 0 }}>Fila limpa!</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 6 }}>Todos os comprovantes foram revisados.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Lista lateral */}
          <div className="w-full md:w-56 shrink-0 flex flex-col gap-2 max-h-[300px] md:max-h-none overflow-y-auto pr-1">
            {lista.map((c) => (
              <button
                key={c.id}
                onClick={() => selecionar(c)}
                style={{
                  ...cardStyle, padding: 14,
                  border: atual?.id === c.id ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.06)",
                  background: atual?.id === c.id ? "rgba(255,255,255,0.05)" : "#111116",
                  cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <div style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.aluno}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.motivo}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "monospace" }}>{toBRL(c.valorIA)}</span>
                  <ConfBadge v={c.conf} />
                </div>
              </button>
            ))}
          </div>

          {/* Painel principal */}
          {atual && (
            <div style={{ flex: 1, ...cardStyle, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#451a03", border: "1px solid #78350f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriIcon size={13} style={{ color: "#fbbf24" }} />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{atual.aluno}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{atual.motivo}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Confiança IA</div>
                  <ConfBadge v={atual.conf} />
                </div>
              </div>

              {/* Split */}
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-[45%] p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/10">
                  <div style={labelStyle}>Comprovante enviado via WhatsApp</div>
                  
                  {atual.imagem ? (
                    <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", borderRadius: 10, overflow: "hidden", background: "#000" }}>
                      <img src={atual.imagem} alt="Comprovante PIX" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      <button onClick={() => window.open(atual.imagem || undefined, '_blank')} style={{ position: "absolute", bottom: 12, right: 12, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer" }}>
                        <ExtLinkIcon size={11} /> Ampliar
                      </button>
                    </div>
                  ) : (
                    <div style={{ aspectRatio: "3/4", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <ImageOffIcon size={28} style={{ color: "rgba(255,255,255,0.12)" }} />
                      <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, textAlign: "center", margin: 0, lineHeight: 1.5 }}>Aguardando upload da<br />imagem do comprovante...</p>
                    </div>
                  )}
                </div>

                {/* Dados */}
                <div className="flex-1 p-4 md:p-5 flex flex-col">
                  <div style={labelStyle}>Dados para Conferência</div>

                  {/* Comparação de valores */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Valor Esperado</div>
                      <div style={{ color: atual.valorEsp ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{atual.valorEsp ? toBRL(atual.valorEsp) : "—"}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Lido pela IA</div>
                      <div style={{ color: atual.valorEsp && atual.valorIA !== atual.valorEsp ? "#fbbf24" : "#34d399", fontSize: 16, fontWeight: 700, fontFamily: "monospace" }}>{toBRL(atual.valorIA)}</div>
                    </div>
                  </div>

                  {/* Inputs editáveis */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    <div>
                      <label style={labelStyle}>Valor Lido (edite se necessário)</label>
                      <input type="number" style={monoInput} value={vals.valor} onChange={(e) => setVals({ ...vals, valor: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Data do Pagamento</label>
                      <input style={monoInput} value={vals.data} onChange={(e) => setVals({ ...vals, data: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Chave PIX / Destinatário</label>
                      <input style={monoInput} value={vals.chave} onChange={(e) => setVals({ ...vals, chave: e.target.value })} />
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                    <button
                      onClick={() => agir('aprovar')}
                      style={{ padding: "12px 0", borderRadius: 10, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                    >
                      <CheckCircleIcon size={15} /> Confirmar Pagamento
                    </button>
                    <button
                      onClick={() => agir('rejeitar')}
                      style={{ padding: "12px 0", borderRadius: 10, border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.08)", color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                    >
                      <XCircleIcon size={15} /> Rejeitar e Avisar Aluno
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL DE AVISOS
// TODO: ao enviar → fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK, { method:'POST', body: JSON.stringify({publico, msg}) })
// TODO: supabase.from('avisos_enviados').insert([{ publico, mensagem, enviado_em: new Date() }])
// ─────────────────────────────────────────────────────────────────────────────
type EstadoEnvio = "idle" | "loading" | "done";

function Avisos({ session, showToast }: { session: any; showToast: any }) {
  const academiaId = session?.user?.id;
  const [publico, setPublico] = useState("todos");
  const [busca, setBusca] = useState("");
  const [msg, setMsg] = useState("");
  const [estado, setEstado] = useState<EstadoEnvio>("idle");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);

  const [counts, setCounts] = useState({ todos: 0, inadimplentes: 0, vencendo: 0 });
  const [loadingCounts, setLoadingCounts] = useState(true);

  const carregarDados = async () => {
    setLoadingCounts(true);
    // 1. Carrega todos os alunos ativos
    const { data: allAlunos, count: totalCount } = await supabase
      .from('alunos_pix')
      .select('id, nome, clientPhone', { count: 'exact' })
      .eq('academia_id', academiaId);
    
    if (allAlunos) setAlunos(allAlunos);
    
    // 2. Conta inadimplentes (pelo menos uma mensalidade atrasada)
    const { count: inadCount } = await supabase
      .from('mensalidades_pix')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'atrasado')
      .eq('academia_id', academiaId);

    // 3. Conta vencendo em 7 dias (não pagos, vencimento entre hoje e 7 dias)
    const today = new Date().toISOString().split('T')[0];
    const dateIn7Days = new Date();
    dateIn7Days.setDate(dateIn7Days.getDate() + 7);
    const iso7Days = dateIn7Days.toISOString().split('T')[0];

    const { count: vencCount } = await supabase
      .from('mensalidades_pix')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'pago')
      .eq('academia_id', academiaId)
      .gte('data_vencimento', today)
      .lte('data_vencimento', iso7Days);

    setCounts({
      todos: totalCount || 0,
      inadimplentes: inadCount || 0,
      vencendo: vencCount || 0
    });
    setLoadingCounts(false);
  };

  useEffect(() => {
    if (academiaId) carregarDados();
  }, [academiaId]);

  const alunosFiltrados = busca.trim() === "" ? [] : alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase())).slice(0, 5);

  const PUBLICOS = [
    { v: "todos",         l: "Todos os Ativos",      n: counts.todos,         cor: "#60a5fa" },
    { v: "inadimplentes", l: "Apenas Inadimplentes",  n: counts.inadimplentes, cor: "#f87171" },
    { v: "vencendo",      l: "Vencendo em 7 dias",    n: counts.vencendo,      cor: "#fbbf24" },
    { v: "especifico",    l: "Aluno Específico",       n: null,                 cor: "rgba(255,255,255,0.4)" },
  ];

  const pub = PUBLICOS.find((p) => p.v === publico);

  const enviar = async () => {
    if (!msg.trim()) return;
    if (publico === "especifico" && !alunoSelecionado) return;
    
    // Formata o telefone para ter apenas números e garantir o 55 no início
    const formatPhone = (phone: string) => {
      if (!phone) return "";
      let cleaned = phone.replace(/\D/g, "");
      if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = "55" + cleaned;
      }
      return cleaned;
    };
    
    let telefones: string[] = [];
    if (publico === "especifico") {
      if (alunoSelecionado?.clientPhone) {
        telefones.push(formatPhone(alunoSelecionado.clientPhone));
      }
    } else if (publico === "todos") {
      telefones = alunos.map(a => formatPhone(a.clientPhone)).filter(t => t.length >= 12);
    } else if (publico === "inadimplentes") {
      const { data } = await supabase
        .from('mensalidades_pix')
        .select('alunos_pix(clientPhone)')
        .eq('status', 'atrasado')
        .eq('academia_id', academiaId);
      
      if (data) {
        telefones = data
          .map((m: any) => formatPhone(m.alunos_pix?.clientPhone))
          .filter(t => t.length >= 12);
      }
    } else if (publico === "vencendo") {
      const today = new Date().toISOString().split('T')[0];
      const dateIn7Days = new Date();
      dateIn7Days.setDate(dateIn7Days.getDate() + 7);
      const iso7Days = dateIn7Days.toISOString().split('T')[0];

      const { data } = await supabase
        .from('mensalidades_pix')
        .select('alunos_pix(clientPhone)')
        .neq('status', 'pago')
        .eq('academia_id', academiaId)
        .gte('data_vencimento', today)
        .lte('data_vencimento', iso7Days);
      
      if (data) {
        telefones = data
          .map((m: any) => formatPhone(m.alunos_pix?.clientPhone))
          .filter(t => t.length >= 12);
      }
    }

    if (telefones.length === 0) {
      showToast("Nenhum telefone válido encontrado para o público selecionado.", "error");
      return;
    }
    
    setEstado("loading");
    
    try {
      await fetch('/api/avisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publico, mensagem: msg, telefones })
      });
      
      // TODO: supabase.from('avisos_enviados').insert([{ publico, mensagem, enviado_em: new Date() }])
      
      setEstado("done");
      setTimeout(() => { 
        setEstado("idle"); 
        setMsg(""); 
        if (publico === "especifico") {
          setAlunoSelecionado(null);
          setBusca("");
        }
      }, 3000);
    } catch (err) {
      console.error("Erro ao enviar:", err);
      setEstado("idle");
      showToast("Falha ao se comunicar com o servidor de disparos.", "error");
    }
  };

  return (
    <div>
      <PageHeader title="Central de Avisos" sub="Envie comunicados via WhatsApp para os alunos" />

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>
        {/* Formulário */}
        <div style={{ ...cardStyle, padding: 22, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Público */}
          <div>
            <div style={labelStyle}>Selecione o Público</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PUBLICOS.map((p) => (
                  <label key={p.v} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: 8, border: publico === p.v ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.07)", background: publico === p.v ? "rgba(16,185,129,0.05)" : "transparent", cursor: "pointer" }}>
                    <input type="radio" name="pub" value={p.v} checked={publico === p.v} onChange={() => { setPublico(p.v); setAlunoSelecionado(null); setBusca(""); }} style={{ accentColor: "#10b981", width: 14, height: 14 }} />
                    <span style={{ flex: 1, color: "#e5e7eb", fontSize: 13 }}>{p.l}</span>
                    {p.n !== null && (
                      <span style={{ color: p.cor, fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
                        {loadingCounts ? "..." : `${p.n} alunos`}
                      </span>
                    )}
                  </label>
                ))}
            </div>
            {publico === "especifico" && (
              <div style={{ marginTop: 10, position: "relative" }}>
                <SearchIcon size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
                
                {alunoSelecionado ? (
                  <div style={{ ...inputStyle, paddingLeft: 34, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{alunoSelecionado.nome}</span>
                    <button onClick={() => { setAlunoSelecionado(null); setBusca(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", padding: 4 }}>
                      <XIcon size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno pelo nome..." style={{ ...inputStyle, paddingLeft: 34 }} />
                    {alunosFiltrados.length > 0 && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#111116", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden", zIndex: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                        {alunosFiltrados.map(a => (
                          <div 
                            key={a.id} 
                            onClick={() => setAlunoSelecionado(a)}
                            style={{ padding: "10px 14px", color: "#e5e7eb", fontSize: 13, cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            <span>{a.nome}</span>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace" }}>{a.clientPhone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mensagem */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={labelStyle}>Mensagem</span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "monospace" }}>{msg.length}/500</span>
            </div>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="Olá! Informamos que nossa academia estará fechada no feriado de..."
              style={{ ...inputStyle, resize: "none", borderRadius: 10, lineHeight: 1.5 }}
            />
          </div>

          {/* Botão */}
          <button
            onClick={enviar}
            disabled={!msg.trim() || estado !== "idle"}
            style={{
              padding: "13px 0", borderRadius: 10,
              border: estado === "done" ? "1px solid #065f46" : "none",
              background: estado === "done" ? "#052e16" : "#10b981",
              color: estado === "done" ? "#34d399" : "#fff",
              fontSize: 13, fontWeight: 700,
              cursor: estado === "idle" && msg.trim() ? "pointer" : "default",
              opacity: !msg.trim() && estado === "idle" ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .2s",
            }}
          >
            {estado === "done"    && <><CheckCircleIcon size={15} /> Enviado para a fila!</>}
            {estado === "loading" && <><LoaderIcon size={15} className="animate-spin" /> Enfileirando...</>}
            {estado === "idle"    && <><SendIcon size={15} /> Enviar Aviso via WhatsApp</>}
          </button>
        </div>

        {/* Preview + Resumo */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...cardStyle, padding: 18 }}>
            <div style={{ ...labelStyle, marginBottom: 14 }}>Preview da Mensagem</div>
            <div style={{ background: "#0a0a0d", borderRadius: 10, padding: 14, minHeight: 80, border: "1px solid rgba(255,255,255,0.04)" }}>
              {msg ? (
                <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "0 10px 10px 10px", padding: "10px 13px", display: "inline-block", maxWidth: "100%" }}>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}>{msg}</p>
                  <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontFamily: "monospace", margin: "8px 0 0", textAlign: "right" }}>Pague Já · agora</p>
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.14)", fontSize: 13, textAlign: "center", padding: "16px 0", margin: 0 }}>Digite a mensagem para ver o preview</p>
              )}
            </div>
          </div>

          <div style={{ ...cardStyle, padding: 18 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>Resumo do Envio</div>
            {[
              { k: "Público",       v: pub?.l ?? "—",    vc: "#e5e7eb",                    mono: false },
              { k: "Destinatários", v: publico === "especifico" ? (busca ? "1" : "—") : `${pub?.n} alunos`, vc: pub?.cor ?? "#fff", mono: true },
              { k: "Canal",         v: "WhatsApp",        vc: "#4ade80",                    mono: false },
              { k: "Via",           v: "n8n → Evolution API", vc: "rgba(255,255,255,0.3)", mono: true  },
            ].map((r) => (
              <div key={r.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 13 }}>{r.k}</span>
                <span style={{ color: r.vc, fontSize: r.mono ? 11 : 13, fontFamily: r.mono ? "monospace" : "inherit", fontWeight: r.mono ? 400 : 500 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastContainer({ toasts }: { toasts: any[] }) {
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 12 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${t.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          padding: '12px 20px',
          borderRadius: 12,
          color: t.type === 'success' ? '#34d399' : '#f87171',
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'toastIn 0.3s ease-out forwards'
        }}>
          {t.type === 'success' ? <CheckCircleIcon size={18} /> : <XCircleIcon size={18} />}
          {t.msg}
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function Login({ onLogin, showToast }: { onLogin: (s: any) => void; showToast: any }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) showToast(error.message, "error");
      else {
        showToast("Conta criada com sucesso! Faça login para entrar.", "success");
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) showToast(error.message, "error");
      else onLogin(data.session);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0d", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24, width: "100%", maxWidth: 400, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#34d399,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <DumbbellIcon size={24} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }}>Pague Já</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 }}>
            {isSignUp ? "Crie sua conta de administrador" : "Entre na sua conta para gerenciar sua academia"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none", fontSize: 15 }} placeholder="seu@email.com" />
          </div>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#fff", outline: "none", fontSize: 15 }} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading} style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 700, fontSize: 15, cursor: loading ? "wait" : "pointer", marginTop: 10 }}>
            {loading ? "Processando..." : (isSignUp ? "Criar Conta" : "Entrar")}
          </button>

          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", marginTop: 8 }}
          >
            {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem uma conta? Crie uma agora"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
const PAGES: Record<PageId, React.FC<{ session: any; showToast: any }>> = {
  dashboard:    Dashboard,
  alunos:       Alunos,
  comprovantes: Comprovantes,
  avisos:       Avisos,
  configuracoes: (props: any) => <ConfiguracoesPix {...props} />,
};

export default function GymFlow() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" }[]>([]);
  const [page, setPage] = useState<PageId>("dashboard");
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [comprovantesCount, setComprovantesCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca quantidade de comprovantes pendentes de revisão
  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchCount = async () => {
      const { count } = await supabase
        .from('mensalidades_pix')
        .select('*', { count: 'exact', head: true })
        .eq('academia_id', session.user.id)
        .eq('status', 'pendente_conferencia');
      setComprovantesCount(count ?? 0);
    };
    fetchCount();
    // Atualiza a cada 60 segundos
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const Page = PAGES[page];

  if (loadingSession) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0d", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)" }}>
        <LoaderIcon size={24} className="animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <ToastContainer toasts={toasts} />
        <Login onLogin={(s) => setSession(s)} showToast={showToast} />
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "#0a0a0d", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", paddingBottom: "60px" /* for mobile nav */ }}>
      <ToastContainer toasts={toasts} />
      {/* Subtle grid texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 0 10 L 40 10 M 10 0 L 10 40 M 0 20 L 40 20 M 20 0 L 20 40 M 0 30 L 40 30 M 30 0 L 30 40' fill='none' stroke='rgba(255,255,255,0.018)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
      }} />

      <Sidebar active={page} onChange={setPage} session={session} comprovantesCount={comprovantesCount} />
      <MobileNav active={page} onChange={setPage} comprovantesCount={comprovantesCount} />

      <main className="flex-1 p-4 md:p-8 relative min-h-screen overflow-y-auto z-10" style={{ paddingBottom: "80px" /* extra space for mobile nav content */ }}>
        <Page session={session} showToast={showToast} />
      </main>
    </div>
  );
}
