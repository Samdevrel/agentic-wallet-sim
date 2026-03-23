'use client';

import { useState, useEffect } from 'react';

type TransactionStatus = 'idle' | 'parsing' | 'simulating' | 'risk_check' | 'executing' | 'complete' | 'blocked';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Transaction {
  id: string;
  naturalLanguage: string;
  parsed: {
    action: string;
    amount: string;
    token: string;
    destination?: string;
    chain: string;
  };
  simulation: {
    gasEstimate: string;
    expectedOutput: string;
    priceImpact?: string;
  };
  riskLevel: RiskLevel;
  riskFactors: string[];
  status: TransactionStatus;
  timestamp: Date;
}

interface WalletState {
  address: string;
  balances: { token: string; amount: string; chain: string }[];
  delegations: { spender: string; allowance: string; token: string }[];
}

const exampleCommands = [
  "Swap 0.5 ETH for USDC on Ethereum",
  "Bridge 100 USDC to Arbitrum",
  "Stake 1 ETH on Lido",
  "Send 50 USDC to 0x742d...beef",
  "Approve 1000 USDC for Uniswap",
];

const riskColors: Record<RiskLevel, string> = {
  low: 'text-green-400 border-green-400',
  medium: 'text-yellow-400 border-yellow-400',
  high: 'text-orange-400 border-orange-400',
  critical: 'text-red-400 border-red-400',
};

const statusColors: Record<TransactionStatus, string> = {
  idle: 'bg-gray-600',
  parsing: 'bg-blue-500 animate-pulse',
  simulating: 'bg-purple-500 animate-pulse',
  risk_check: 'bg-yellow-500 animate-pulse',
  executing: 'bg-green-500 animate-pulse',
  complete: 'bg-green-600',
  blocked: 'bg-red-600',
};

export default function Home() {
  const [command, setCommand] = useState('');
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [autoApprove, setAutoApprove] = useState(false);

  const wallet: WalletState = {
    address: '0xAgent...7710',
    balances: [
      { token: 'ETH', amount: '2.5', chain: 'Ethereum' },
      { token: 'USDC', amount: '5,000', chain: 'Ethereum' },
      { token: 'ETH', amount: '0.8', chain: 'Arbitrum' },
      { token: 'USDC', amount: '2,000', chain: 'Base' },
    ],
    delegations: [
      { spender: 'Uniswap', allowance: '∞', token: 'USDC' },
      { spender: 'Aave', allowance: '10,000', token: 'USDC' },
    ],
  };

  const parseCommand = (cmd: string): Transaction['parsed'] => {
    const lower = cmd.toLowerCase();
    
    if (lower.includes('swap')) {
      const match = cmd.match(/(\d+\.?\d*)\s*(\w+)\s*for\s*(\w+)/i);
      return {
        action: 'swap',
        amount: match?.[1] || '0',
        token: match?.[2] || 'ETH',
        destination: match?.[3] || 'USDC',
        chain: lower.includes('arbitrum') ? 'Arbitrum' : lower.includes('base') ? 'Base' : 'Ethereum',
      };
    }
    
    if (lower.includes('bridge')) {
      const match = cmd.match(/(\d+\.?\d*)\s*(\w+)\s*to\s*(\w+)/i);
      return {
        action: 'bridge',
        amount: match?.[1] || '0',
        token: match?.[2] || 'USDC',
        destination: match?.[3] || 'Arbitrum',
        chain: 'Cross-chain',
      };
    }
    
    if (lower.includes('stake')) {
      const match = cmd.match(/(\d+\.?\d*)\s*(\w+)/i);
      return {
        action: 'stake',
        amount: match?.[1] || '0',
        token: match?.[2] || 'ETH',
        destination: lower.includes('lido') ? 'Lido' : 'Unknown',
        chain: 'Ethereum',
      };
    }
    
    if (lower.includes('send')) {
      const match = cmd.match(/(\d+\.?\d*)\s*(\w+)\s*to\s*(0x[\w\.]+)/i);
      return {
        action: 'transfer',
        amount: match?.[1] || '0',
        token: match?.[2] || 'USDC',
        destination: match?.[3] || '0x...',
        chain: 'Ethereum',
      };
    }
    
    if (lower.includes('approve')) {
      const match = cmd.match(/(\d+\.?\d*)\s*(\w+)\s*for\s*(\w+)/i);
      return {
        action: 'approve',
        amount: match?.[1] || '0',
        token: match?.[2] || 'USDC',
        destination: match?.[3] || 'Unknown',
        chain: 'Ethereum',
      };
    }
    
    return { action: 'unknown', amount: '0', token: 'ETH', chain: 'Ethereum' };
  };

  const assessRisk = (parsed: Transaction['parsed']): { level: RiskLevel; factors: string[] } => {
    const factors: string[] = [];
    let level: RiskLevel = 'low';
    
    const amount = parseFloat(parsed.amount);
    
    if (amount > 1 && parsed.token === 'ETH') {
      factors.push(`Large ETH amount (${parsed.amount} ETH)`);
      level = 'medium';
    }
    
    if (amount > 1000 && parsed.token === 'USDC') {
      factors.push(`Large stablecoin transfer (${parsed.amount} USDC)`);
      level = 'medium';
    }
    
    if (parsed.action === 'approve' && parsed.amount === '∞') {
      factors.push('Unlimited approval requested');
      level = 'high';
    }
    
    if (parsed.action === 'bridge') {
      factors.push('Cross-chain operation');
      level = level === 'low' ? 'medium' : level;
    }
    
    if (parsed.destination?.startsWith('0x') && parsed.action === 'transfer') {
      factors.push('External address transfer');
      if (amount > 500) level = 'high';
    }
    
    if (factors.length === 0) {
      factors.push('Standard operation within limits');
    }
    
    return { level, factors };
  };

  const simulateTransaction = (parsed: Transaction['parsed']): Transaction['simulation'] => {
    const gasEstimates: Record<string, string> = {
      swap: '~$2.50',
      bridge: '~$8.00',
      stake: '~$5.00',
      transfer: '~$1.50',
      approve: '~$1.00',
    };
    
    return {
      gasEstimate: gasEstimates[parsed.action] || '~$2.00',
      expectedOutput: parsed.action === 'swap' 
        ? `${(parseFloat(parsed.amount) * 2450).toFixed(2)} ${parsed.destination}`
        : `${parsed.amount} ${parsed.token}`,
      priceImpact: parsed.action === 'swap' ? '0.05%' : undefined,
    };
  };

  const executeCommand = async () => {
    if (!command.trim()) return;
    
    const parsed = parseCommand(command);
    const { level, factors } = assessRisk(parsed);
    const simulation = simulateTransaction(parsed);
    
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      naturalLanguage: command,
      parsed,
      simulation,
      riskLevel: level,
      riskFactors: factors,
      status: 'parsing',
      timestamp: new Date(),
    };
    
    setCurrentTx(tx);
    
    // Simulate pipeline stages
    await new Promise(r => setTimeout(r, 800));
    setCurrentTx(prev => prev ? { ...prev, status: 'simulating' } : null);
    
    await new Promise(r => setTimeout(r, 1000));
    setCurrentTx(prev => prev ? { ...prev, status: 'risk_check' } : null);
    
    await new Promise(r => setTimeout(r, 800));
    
    if (level === 'critical') {
      setCurrentTx(prev => prev ? { ...prev, status: 'blocked' } : null);
    } else if (autoApprove || level === 'low') {
      setCurrentTx(prev => prev ? { ...prev, status: 'executing' } : null);
      await new Promise(r => setTimeout(r, 1200));
      setCurrentTx(prev => prev ? { ...prev, status: 'complete' } : null);
    }
    
    setTxHistory(prev => [tx, ...prev].slice(0, 10));
    setCommand('');
  };

  const approveTransaction = async () => {
    if (!currentTx || currentTx.status !== 'risk_check') return;
    
    setCurrentTx(prev => prev ? { ...prev, status: 'executing' } : null);
    await new Promise(r => setTimeout(r, 1200));
    setCurrentTx(prev => prev ? { ...prev, status: 'complete' } : null);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-cyan-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">Agentic Wallet Simulator</h1>
          <p className="text-gray-400 mt-2">Natural language → On-chain execution for AI agents</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Wallet Overview */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border-4 border-gray-700 p-4">
            <h2 className="text-sm font-bold text-gray-400 mb-2">AGENT WALLET</h2>
            <div className="font-mono text-cyan-400">{wallet.address}</div>
            <div className="text-xs text-gray-500 mt-1">TEE-secured • Multi-chain</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4">
            <h2 className="text-sm font-bold text-gray-400 mb-2">BALANCES</h2>
            <div className="space-y-1">
              {wallet.balances.slice(0, 3).map((b, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{b.token}</span>
                  <span className="text-gray-400">{b.amount} <span className="text-xs">({b.chain})</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4">
            <h2 className="text-sm font-bold text-gray-400 mb-2">ACTIVE DELEGATIONS</h2>
            <div className="space-y-1">
              {wallet.delegations.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-purple-400">{d.spender}</span>
                  <span className="text-gray-400">{d.allowance} {d.token}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Command Input */}
        <section className="bg-gray-900 border-4 border-cyan-400 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">NATURAL LANGUAGE COMMAND</h2>
          <div className="flex gap-4 flex-col md:flex-row">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
              placeholder="e.g., Swap 0.5 ETH for USDC on Ethereum"
              className="flex-1 p-4 bg-gray-800 border-2 border-gray-600 text-white text-lg"
            />
            <button
              onClick={executeCommand}
              disabled={!command.trim() || (currentTx?.status === 'executing')}
              className="px-8 py-4 bg-cyan-500 text-black font-bold border-4 border-cyan-400 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Execute
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {exampleCommands.map((cmd, i) => (
              <button
                key={i}
                onClick={() => setCommand(cmd)}
                className="px-3 py-1 text-sm bg-gray-800 border border-gray-600 hover:border-cyan-400 transition-all"
              >
                {cmd}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Auto-approve low/medium risk transactions</span>
          </label>
        </section>

        {/* Execution Pipeline */}
        {currentTx && (
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-sm font-bold text-gray-400 mb-4">EXECUTION PIPELINE</h2>
            
            {/* Status Bar */}
            <div className="flex gap-2 mb-6">
              {(['parsing', 'simulating', 'risk_check', 'executing', 'complete'] as TransactionStatus[]).map((status) => (
                <div
                  key={status}
                  className={`flex-1 h-2 rounded ${
                    currentTx.status === status ? statusColors[status] :
                    ['parsing', 'simulating', 'risk_check', 'executing', 'complete'].indexOf(currentTx.status) > 
                    ['parsing', 'simulating', 'risk_check', 'executing', 'complete'].indexOf(status)
                      ? 'bg-green-600' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Parsed Command */}
              <div className="p-4 bg-gray-800 border-2 border-blue-500">
                <h3 className="text-xs text-blue-400 font-bold mb-2">PARSED COMMAND</h3>
                <div className="space-y-1 text-sm">
                  <div>Action: <span className="text-cyan-400 font-bold">{currentTx.parsed.action.toUpperCase()}</span></div>
                  <div>Amount: <span className="text-white">{currentTx.parsed.amount} {currentTx.parsed.token}</span></div>
                  {currentTx.parsed.destination && (
                    <div>To: <span className="text-purple-400">{currentTx.parsed.destination}</span></div>
                  )}
                  <div>Chain: <span className="text-gray-400">{currentTx.parsed.chain}</span></div>
                </div>
              </div>

              {/* Simulation Results */}
              <div className="p-4 bg-gray-800 border-2 border-purple-500">
                <h3 className="text-xs text-purple-400 font-bold mb-2">SIMULATION</h3>
                <div className="space-y-1 text-sm">
                  <div>Gas Estimate: <span className="text-yellow-400">{currentTx.simulation.gasEstimate}</span></div>
                  <div>Expected Output: <span className="text-green-400">{currentTx.simulation.expectedOutput}</span></div>
                  {currentTx.simulation.priceImpact && (
                    <div>Price Impact: <span className="text-gray-400">{currentTx.simulation.priceImpact}</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className={`mt-4 p-4 bg-gray-800 border-2 ${riskColors[currentTx.riskLevel]}`}>
              <h3 className={`text-xs font-bold mb-2 ${riskColors[currentTx.riskLevel].split(' ')[0]}`}>
                RISK ASSESSMENT: {currentTx.riskLevel.toUpperCase()}
              </h3>
              <ul className="text-sm space-y-1">
                {currentTx.riskFactors.map((factor, i) => (
                  <li key={i}>• {factor}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            {currentTx.status === 'risk_check' && !autoApprove && currentTx.riskLevel !== 'low' && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={approveTransaction}
                  className="flex-1 py-3 bg-green-500 text-white font-bold border-4 border-green-400 hover:bg-green-400"
                >
                  Approve & Execute
                </button>
                <button
                  onClick={() => setCurrentTx(prev => prev ? { ...prev, status: 'blocked' } : null)}
                  className="flex-1 py-3 bg-red-600 text-white font-bold border-4 border-red-500 hover:bg-red-500"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Status Message */}
            <div className="mt-4 text-center">
              {currentTx.status === 'complete' && (
                <div className="text-green-400 font-bold">✓ Transaction executed successfully</div>
              )}
              {currentTx.status === 'blocked' && (
                <div className="text-red-400 font-bold">✕ Transaction blocked</div>
              )}
            </div>
          </section>
        )}

        {/* Transaction History */}
        {txHistory.length > 0 && (
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-sm font-bold text-gray-400 mb-4">TRANSACTION HISTORY</h2>
            <div className="space-y-2">
              {txHistory.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-800 border-l-4 border-cyan-400">
                  <div>
                    <div className="text-sm">{tx.naturalLanguage}</div>
                    <div className="text-xs text-gray-400">{tx.timestamp.toLocaleTimeString()}</div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-bold ${
                    tx.status === 'complete' ? 'bg-green-900 text-green-400' :
                    tx.status === 'blocked' ? 'bg-red-900 text-red-400' : 'bg-gray-700'
                  }`}>
                    {tx.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-gray-900 border-4 border-cyan-400 p-6">
          <h2 className="text-xl font-black text-cyan-400 mb-4">How Agentic Wallets Work</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-bold text-blue-400">1. Parse</div>
              <div className="text-xs text-gray-400">Natural language → structured intent</div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">🔮</div>
              <div className="font-bold text-purple-400">2. Simulate</div>
              <div className="text-xs text-gray-400">Preview execution results</div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="font-bold text-yellow-400">3. Risk Check</div>
              <div className="text-xs text-gray-400">Auto-grade & block critical ops</div>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-bold text-green-400">4. Execute</div>
              <div className="text-xs text-gray-400">Sign & broadcast on-chain</div>
            </div>
          </div>
        </section>

        {/* Context */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">ABOUT THIS DEMO</h2>
          <p className="text-gray-300 mb-4">
            This simulator demonstrates how <span className="text-cyan-400">agentic wallets</span> enable AI agents 
            to execute on-chain transactions using natural language. Inspired by OKX&apos;s Agentic Wallet 
            (launched March 18, 2026) and the broader x402/ERC-7710 ecosystem.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-cyan-400 mb-2">Key Features</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• Natural language command parsing</li>
                <li>• Transaction simulation before execution</li>
                <li>• Automatic risk assessment</li>
                <li>• TEE-secured private keys</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-cyan-400 mb-2">The Agent Stack</h3>
              <ul className="text-gray-400 space-y-1">
                <li>• ERC-7710: Delegations</li>
                <li>• ERC-8004: Agent identity</li>
                <li>• x402: HTTP payments</li>
                <li>• Agentic Wallet: Execution</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-cyan-400 hover:underline">@samdevrel</a>
            {' • '}
            <a href="https://github.com/Samdevrel/agentic-wallet-sim" className="text-gray-400 hover:underline">Source Code</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
