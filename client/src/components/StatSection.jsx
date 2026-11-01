import React from 'react';
import { Shield, TrendingUp, Lock, AlertTriangle } from 'lucide-react';

const StatSection = () => {
  const stats = [
    {
      icon: Shield,
      title: '65,893',
      desc: 'Total cyber crime cases in 2022',
    },
    {
      icon: TrendingUp,
      title: '24.4%',
      desc: 'Increase from 2021',
    },
    {
      icon: Lock,
      title: '64.8%',
      desc: 'Cases linked to fraud',
    },
    {
      icon: AlertTriangle,
      title: '13.5%',
      desc: 'Phishing & identity theft cases',
    },
    {
      icon: Shield,
      title: '10.3%',
      desc: 'Cases specifically targeting women',
    },
    {
      icon: TrendingUp,
      title: '45%',
      desc: 'Cases pending investigation',
    },
  ];

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0a0016] to-black px-6 py-20 text-white">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(136,11,209,0.15),transparent_70%)]"></div>

      {/* Title */}
      <h1 className="mb-6 bg-gradient-to-r from-white via-[#880bd1] to-white bg-clip-text text-center font-bruno text-5xl text-transparent">
        Cyber Crime in India (2022)
      </h1>
      <p className="mb-16 max-w-2xl text-center text-gray-300">
        Statistical highlights of cyber crime incidents reported across India (NCRB 2022 data).
      </p>

      {/* Stats Grid */}
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="group relative transform cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-black/40 p-8 transition-all duration-300 hover:scale-105 hover:border-[#880bd1]"
            >
              {/* Glow Overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#880bd1]/30 via-transparent to-[#880bd1]/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col items-start">
                <Icon className="mb-4 h-12 w-12 text-[#880bd1] transition-colors duration-300 group-hover:text-white" />
                <h3 className="text-4xl font-bold text-[#880bd1] transition-colors duration-300 group-hover:text-white">
                  {stat.title}
                </h3>
                <p className="mt-2 text-gray-300">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatSection;
