"use client";

export default function ErrorPage() {
  return <main style={{padding:32,color:"#f3f1f8",background:"#101015",minHeight:"100vh"}}><h1>Something went wrong</h1><p>ORACLE hit an unexpected error. Refresh the page to try again.</p><button onClick={() => window.location.reload()}>Reload</button></main>;
}
