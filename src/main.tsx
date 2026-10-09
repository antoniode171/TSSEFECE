import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error in Telecom Survey app:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('site_survey_telecom_data_v1');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center mx-auto text-xl font-bold border border-rose-500/20">
              ⚠️
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Se detectó un error al iniciar la aplicación
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Es posible que los datos almacenados en el navegador correspondan a una versión anterior incompatible o corrupta.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-left overflow-auto max-h-32 text-[11px] font-mono text-rose-300">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-sky-600/20"
              >
                Restablecer datos y Recargar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
              >
                Reintentar cargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function mountApplication() {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Target #root container not found in DOM.');
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    );
    // Mark application as mounted to clear loader and diagnostic timers
    try {
      (window as any).__app_mounted = true;
    } catch (_) {}
  } catch (err: any) {
    console.error('Fatal initialization error mounting React app:', err);
    container.innerHTML = `
      <div style="min-height:100vh;background:#020617;color:#f8fafc;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;text-align:center;">
        <div style="max-width:420px;background:#0f172a;border:1px solid #334155;padding:24px;border-radius:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(244,63,94,0.15);color:#f43f5e;font-size:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">⚠️</div>
          <h2 style="font-size:16px;font-weight:700;color:#f8fafc;margin:0 0 8px;">Error al inicializar la aplicación</h2>
          <p style="font-size:12px;color:#94a3b8;margin:0 0 16px;line-height:1.5;">Se produjo un error inesperado al montar los componentes. Puede restablecer los datos locales para solucionar inconsistencias.</p>
          <div style="padding:10px;background:#020617;border:1px solid #1e293b;border-radius:8px;font-family:monospace;font-size:11px;color:#fda4af;text-align:left;overflow-x:auto;margin-bottom:16px;">
            ${(err && (err.message || String(err))) || 'Error desconocido'}
          </div>
          <button onclick="localStorage.removeItem('site_survey_telecom_data_v1');location.reload();" style="width:100%;padding:10px 16px;background:#0284c7;color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;">
            Restablecer datos locales y Recargar
          </button>
        </div>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApplication);
} else {
  mountApplication();
}

