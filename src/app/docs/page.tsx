'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-purple-400 bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black">Agentic Wallet Simulator Documentation</h1>
          <Link href="/" className="text-purple-400 hover:underline">← Back to App</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <section className="bg-gray-900 border-4 border-purple-400 p-6">
          <h2 className="text-2xl font-black mb-4">Overview</h2>
          <p className="text-gray-300 mb-4">
            Simulate autonomous agent wallet operations with delegation and spending controls with real-time metrics and intuitive interface.
          </p>
          <p className="text-gray-400 text-sm">
            Built with TypeScript, Next.js 14, Tailwind CSS, and deployed on Vercel.
          </p>
        </section>

        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-2xl font-black mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-purple-500 text-white font-bold px-3 py-1 text-sm">1</div>
              <div>
                <h3 className="font-bold text-purple-400">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm">Link your Web3 wallet to interact with the protocol</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-purple-500 text-white font-bold px-3 py-1 text-sm">2</div>
              <div>
                <h3 className="font-bold text-purple-400">Configure Settings</h3>
                <p className="text-gray-400 text-sm">Set your preferences and parameters for the operation</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-purple-500 text-white font-bold px-3 py-1 text-sm">3</div>
              <div>
                <h3 className="font-bold text-purple-400">Execute & Monitor</h3>
                <p className="text-gray-400 text-sm">Submit transactions and track results in real-time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-2xl font-black mb-4">Key Features</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Real-time data visualization and analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Non-custodial and permissionless architecture
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Multi-chain support with optimized routing
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Gas-optimized smart contract interactions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Comprehensive transaction history and audit trail
            </li>
          </ul>
        </section>

        <section className="bg-gray-900 border-4 border-green-400 p-6">
          <h2 className="text-2xl font-black text-green-400 mb-4">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Install MetaMask or another Web3 wallet</li>
            <li>Connect to the application using the Connect Wallet button</li>
            <li>Explore the dashboard to understand available features</li>
            <li>Start with small amounts to test functionality</li>
            <li>Monitor your positions and track performance</li>
          </ol>
        </section>

        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-2xl font-black mb-4">Technical Architecture</h2>
          <div className="bg-gray-800 p-4 font-mono text-sm text-gray-300">
            <pre>┌─────────────────────────────────────┐
│           Frontend (Next.js)        │
├─────────────────────────────────────┤
│         Web3 Provider (wagmi)       │
├─────────────────────────────────────┤
│        Smart Contracts (EVM)        │
├─────────────────────────────────────┤
│     Blockchain Network (L1/L2)      │
└─────────────────────────────────────┘</pre>
          </div>
        </section>

        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-2xl font-black mb-4">Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/" className="block p-4 bg-gray-800 border-2 border-gray-600 hover:border-purple-400 transition">
              <h3 className="font-bold text-purple-400">← Back to App</h3>
              <p className="text-sm text-gray-400">Return to the main application</p>
            </Link>
            <a href="https://github.com/Samdevrel/agentic-wallet-sim" target="_blank" className="block p-4 bg-gray-800 border-2 border-gray-600 hover:border-purple-400 transition">
              <h3 className="font-bold text-purple-400">GitHub Repository</h3>
              <p className="text-sm text-gray-400">View source code and contribute</p>
            </a>
          </div>
        </section>

        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-purple-400 hover:underline">@samdevrel</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
