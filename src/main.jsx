import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

import("./App")
  .then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("RecoverAI boot error", error);
    root.render(
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel max-w-2xl p-8 text-center">
          <p className="text-lg font-semibold text-critical">RecoverAI failed to boot</p>
          <p className="mt-3 text-slate-300">{error.message}</p>
        </div>
      </main>
    );
  });
