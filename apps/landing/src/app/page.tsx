'use client';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://nexaboard-production.up.railway.app';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${apiBase}/api/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, workspace }),
      });
      if (!res.ok) throw new Error('Erreur');
      setStatus('success');
      setEmail('');
      setWorkspace('');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <main style={{maxWidth:800,margin:'2rem auto',padding:'0 1rem'}}>
      <h1>Rejoindre la bêta — nexaBoard</h1>
      <p>Inscris-toi pour être contacté(e) et tester la version early-access.</p>
      <form onSubmit={onSubmit} style={{display:'grid',gap:8,maxWidth:420}}>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input placeholder="Nom du workspace (optionnel)" value={workspace} onChange={(e)=>setWorkspace(e.target.value)} />
        <button type="submit" disabled={status==='loading'}>Rejoindre la bêta</button>
      </form>
      {status==='success' && <p style={{color:'green'}}>Merci — nous vous contacterons bientôt.</p>}
      {status==='error' && <p style={{color:'red'}}>Erreur lors de l'envoi, réessayez.</p>}
    </main>
  );
}
