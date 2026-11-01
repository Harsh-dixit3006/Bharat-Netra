import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { ScanSearch } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../Context/AppContext.js';

const tools = [
  'WHOIS Lookup',
  'Subdomain Finder',
  'IP History Lookup',
  'Reverse IP Lookup',
  'MAC Address Lookup',
  'Mobile Carrier Lookup',
  'Malware Check',
  'Password Hash Breaker',
  'Port Scanner',
  'Email Header Analyzer',
  'Email Validator',
];

// map tool -> placeholder text
const placeholders = {
  'WHOIS Lookup': 'Enter domain (example.com)...',
  'Subdomain Finder': 'Enter domain to discover subdomains (example.com)...',
  'IP History Lookup': 'Enter domain to check IP history (example.com)...',
  'Password Hash Breaker': 'Enter hash to attempt to break (e.g. 5f4dcc3b...)',
  'Port Scanner': 'Enter host and ports (example.com 80,443,8080)...',
  'Reverse IP Lookup': 'Enter IP address (e.g., 8.8.8.8)...',
  'Reverse WHOIS Lookup': 'Enter domain or email to perform reverse WHOIS...',
  'Bulk IP Lookup': 'Enter comma separated IPs or CIDR (e.g. 8.8.8.8,1.1.1.0/24)...',
  'Abuse Contact Lookup': 'Enter IP or domain to find abuse contacts...',
  'Malware Check': 'Enter URL or file hash to check for malware (https://... or sha256)...',
  'Email Header Analyzer': 'Paste full email headers to analyze...',
  'Mobile Carrier Lookup': 'Enter phone number with country code (e.g. +919876543210)...',
  'Reverse Image Search': 'Enter image URL to perform reverse image search...',
  'Email Validator': 'Enter email to validate (user@example.com)...',
  'MAC Address Lookup': 'Enter MAC address (e.g. 00:1A:2B:3C:4D:5E)...',
};

// Helper for formatting contacts in RDAP/WHOIS (kept from your original)
function formatContact(entity) {
  if (!entity) return null;
  const emails = (entity.vcard_array || [])
    .filter((v) => v.name === 'email')
    .map((v) => v.values)
    .flat();
  const phones = (entity.vcard_array || [])
    .filter((v) => v.name === 'tel')
    .map((v) => v.values)
    .flat();
  const names = (entity.vcard_array || [])
    .filter((v) => v.name === 'fn')
    .map((v) => v.values)
    .flat();

  return [
    `Name: ${names.join(', ') || 'N/A'}`,
    `Email: ${emails.join(', ') || 'N/A'}`,
    `Phone: ${phones.join(', ') || 'N/A'}`,
    `Roles: ${(entity.roles || []).join(', ') || 'N/A'}`,
  ].join('\n');
}

function summarizeMalwareData(data) {
  if (!data?.attributes) return 'No VirusTotal data.';
  const stats = data.attributes.last_analysis_stats || {};
  const totalEngines = Object.values(stats).reduce((a, b) => a + b, 0);

  let status = 'Safe';
  if (stats.malicious > 0) status = 'Malicious';
  else if (stats.suspicious > 0) status = 'Suspicious';

  const maliciousEngines = [];
  const results = data.attributes.last_analysis_results || {};
  for (let engine in results) {
    if (results[engine].category === 'malicious') {
      maliciousEngines.push(engine);
    }
  }

  return `Status: ${status}
Detections: ${stats.malicious || 0} / ${totalEngines || 0}
Malicious engines: ${maliciousEngines.length ? maliciousEngines.join(', ') : 'None'}`;
}

function displayIPReport(res) {
  if (!res) return 'No Reverse IP data found';

  const lines = [];
  lines.push(`Reverse IP Lookup for ${res.ip}`);

  if (res.geo) {
    lines.push(`Geo Info: 
  Country: ${res.geo.country || 'N/A'}
  Region: ${res.geo.regionName || 'N/A'}
  City: ${res.geo.city || 'N/A'}
  ISP/Org: ${res.geo.org || res.geo.isp || 'N/A'}
  Timezone: ${res.geo.timezone || 'N/A'}
  Coords: (${res.geo.lat}, ${res.geo.lon})`);
  }

  lines.push(`PTR Records: ${res.ptr?.length ? res.ptr.join(', ') : 'None'}`);

  if (res.rdap) {
    lines.push(`RDAP:
  Org: ${res.rdap.owner || res.rdap.network?.name || 'N/A'}
  Country: ${res.rdap.country || 'N/A'}
  ASN: ${res.rdap.asn || 'N/A'}
  Note: ${res.rdap.note || 'N/A'}
  Success: ${typeof res.rdap.success === 'boolean' ? (res.rdap.success ? 'Yes' : 'No') : 'N/A'}`);
  }

  if (res.whois) {
    lines.push(`WHOIS:
${res.whois.substring(0, 500)}${res.whois.length > 500 ? '...(truncated)' : ''}`);
  }

  if (res.virusTotal?.summary) {
    const vt = res.virusTotal.summary;
    lines.push(`VirusTotal:
  Reputation: ${vt.reputation}
  Detections: ${vt.last_analysis_stats?.malicious || 0} malicious
  Harmless: ${vt.last_analysis_stats?.harmless || 0}
  Undetected: ${vt.last_analysis_stats?.undetected || 0}
  Tags: ${(vt.tags || []).join(', ') || 'None'}`);

    if (res.virusTotal.raw?.data?.attributes?.last_analysis_results) {
      const dangerous = Object.entries(
        res.virusTotal.raw.data.attributes.last_analysis_results
      ).filter(([_, v]) => v.category === 'malicious');
      if (dangerous.length > 0) {
        lines.push('Malicious virus engines: ' + dangerous.map(([k]) => k).join(', '));
      }
    }
  } else {
    lines.push('VirusTotal: N/A');
  }

  return lines.join('\n\n');
}

const Terminal = () => {
  const { backendUrl } = useContext(AppContext);
  const [selectedTool, setSelectedTool] = useState(null);
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('Enter input...');
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedTool) {
      setPlaceholder(placeholders[selectedTool] || 'Enter input...');
      if (inputRef.current) inputRef.current.focus();
    }
  }, [selectedTool]);

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setHistory([`⚡ ${tool} terminal opened`]);
    setInputValue('');
    setLoading(false);
    setPlaceholder(placeholders[tool] || 'Enter input...');
  };

  const handleBack = () => {
    setSelectedTool(null);
    setHistory([]);
    setInputValue('');
    setLoading(false);
    setPlaceholder('Enter input...');
  };

  const handleInputKey = async (e) => {
    if (e.key !== 'Enter') return;

    const command = inputValue.trim();
    if (!command) return;

    if (command.toLowerCase() === 'clear') {
      setHistory([`⚡ ${selectedTool} terminal opened`]);
      setInputValue('');
      return;
    }

    if (command.toLowerCase() === 'cd..') {
      handleBack();
      return;
    }

    // echo command in terminal
    setHistory((prev) => [...prev, `$ ${command}`]);
    setInputValue('');
    setLoading(true);

    try {
      if (selectedTool === 'Email Header Analyzer') {
        const res = await axios.post(`${backendUrl}/api/email/header-analyser`, {
          rawHeader: command,
        });
        if (res.data) {
          setHistory((prev) => [
            ...prev,
            `Email Header Analysis Result:`,
            JSON.stringify(res.data, null, 2),
          ]);
        } else {
          setHistory((prev) => [...prev, 'No analysis result found for given header.']);
        }
        setLoading(false);
        return;
      } else if (selectedTool === 'Reverse IP Lookup') {
        // POST { ip: command } to /api/ip/reverse-ip-lookup
        const res = await axios.post(`${backendUrl}/api/ip/reverse-ip-lookup`, { ip: command });
        if (res.data && res.data.ip) {
          setHistory((prev) => [...prev, displayIPReport(res.data)]);
        } else {
          setHistory((prev) => [...prev, 'No Reverse IP data found']);
        }
        setLoading(false);
        return;
      }
      // WHOIS Lookup
      else if (selectedTool === 'WHOIS Lookup') {
        const res = await axios.post(backendUrl + '/api/domain/domain-info', {
          domain: command,
        });
        setHistory((prev) => [...prev, JSON.stringify(res.data, null, 2)]);
      }

      // Subdomain Finder
      else if (selectedTool === 'Subdomain Finder') {
        const res = await axios.post(backendUrl + '/api/subdomain/discover-subdomain', {
          domain: command,
        });
        if (res.data.subdomains?.length > 0) {
          res.data.subdomains.forEach((sub) =>
            setHistory((prev) => [...prev, `${sub.subdomain} → ${sub.ip} (${sub.type})`])
          );
        } else {
          setHistory((prev) => [...prev, 'No subdomains found']);
        }
      }

      // IP History Lookup (POST)
      else if (selectedTool === 'IP History Lookup') {
        // send POST { domain: command } to backendUrl + "/api/ip/ip-history"
        const res = await axios.post(backendUrl + '/api/ip/ip-history', {
          domain: command,
        });

        // Example expected response:
        // {
        //   domain: "youtube.com",
        //   records: [
        //     { ip: "142.251.167.136", firstSeen: "2025-09-19", lastSeen: "2025-09-22" },
        //     ...
        //   ]
        // }

        if (res.data?.domain) {
          setHistory((prev) => [...prev, `📡 IP History for ${res.data.domain}:`]);
        }

        if (res.data.records?.length > 0) {
          // iterate and append each record in readable format
          res.data.records.forEach((rec) =>
            setHistory((prev) => [
              ...prev,
              `${rec.ip}  |  First Seen: ${rec.firstSeen || 'N/A'}  |  Last Seen: ${rec.lastSeen || 'N/A'}`,
            ])
          );
        } else {
          setHistory((prev) => [...prev, 'No IP history found']);
        }
      }

      // Email Validator
      else if (selectedTool === 'Email Validator') {
        const res = await axios.post(backendUrl + '/api/email/validate-email', {
          email: command,
        });
        setHistory((prev) => [...prev, JSON.stringify(res.data, null, 2)]);
      }

      // Malware Check
      else if (selectedTool === 'Malware Check') {
        const res = await axios.post(backendUrl + '/api/malware/check-malware', {
          url: command,
        });
        if (res.data?.data) {
          const summary = summarizeMalwareData(res.data.data);
          // show the command used + summary
          setHistory((prev) => [...prev, `Malware Check Result for ${command}:`, summary]);
        } else {
          setHistory((prev) => [...prev, `No malware information found for ${command}`]);
        }
      }

      // Port Scanner
      else if (selectedTool === 'Port Scanner') {
        const [host, portsStr] = command.split(' ');
        if (!host || !portsStr) {
          setHistory((prev) => [...prev, '❌ Invalid input. Use: hostname port1,port2,...']);
        } else {
          const ports = portsStr.split(',').map((p) => parseInt(p.trim()));
          const res = await axios.post(`${backendUrl}/api/ports/scan-ports`, {
            host,
            ports,
          });
          res.data.results.forEach((r) => {
            setHistory((prev) => [...prev, `Port ${r.port}: ${r.status}`]);
          });
        }
      }

      // MAC Address Lookup
      else if (selectedTool === 'MAC Address Lookup') {
        const res = await axios.post(backendUrl + '/api/macAddress/macAdd-lookup', {
          macAddress: command,
        });
        // small delay to show loading feel (optional)
        setTimeout(() => {
          if (res.data) {
            setHistory((prev) => [...prev, JSON.stringify(res.data, null, 2)]);
          }
          setLoading(false);
        }, 800);
        // skip setting loading=false here since we handle it in timeout
        return;
      }

      // Password Hash Breaker
      else if (selectedTool === 'Password Hash Breaker') {
        const res = await axios.post(backendUrl + '/api/password/pass-breaker', {
          targetHash: command,
        });
        setTimeout(() => {
          if (res.data) {
            setHistory((prev) => [...prev, JSON.stringify(res.data, null, 2)]);
          }
          setLoading(false);
        }, 800);
        return;
      }

      // Mobile Carrier Lookup
      else if (selectedTool === 'Mobile Carrier Lookup') {
        const res = await axios.post(backendUrl + '/api/carrier/check-carrier', { phone: command });
        setHistory((prev) => [
          ...prev,
          `Carrier Lookup Result for ${command}:`,
          `Valid: ${res.data.valid ? 'Yes' : 'No'}`,
          `Country: ${res.data.country || 'N/A'}`,
          `Carrier: ${res.data.carrier || 'N/A'}`,
          `Type: ${res.data.phone_type || 'N/A'}`,
          `International: ${res.data.international || 'N/A'}`,
        ]);
      }

      // default unimplemented
      else {
        setHistory((prev) => [...prev, `Tool "${selectedTool}" is not implemented yet`]);
      }

      setLoading(false);
    } catch (err) {
      setHistory((prev) => [...prev, `❌ Error: ${err.response?.data?.error || err.message}`]);
      setLoading(false);
    }
  };

  return (
    <div className="intel-console">
      <div className="console-topbar">
        <div className="console-lights">
          <i />
          <i />
          <i />
        </div>
        <p>
          <span className="console-pulse" />
          {selectedTool || 'BHARAT NETRA / TOOLKIT'}
        </p>
        <span className="console-state">{loading ? 'PROCESSING' : 'READY'}</span>
      </div>
      <div className="console-layout">
        <aside className="tool-rail">
          <div className="rail-label">
            COLLECTION TOOLS <span>11</span>
          </div>
          {tools.map((tool, index) => (
            <button
              key={tool}
              className={selectedTool === tool ? 'tool-choice active' : 'tool-choice'}
              onClick={() => handleToolClick(tool)}
            >
              <span className="tool-index">{String(index + 1).padStart(2, '0')}</span>
              <span>{tool}</span>
              <span className="tool-arrow">↗</span>
            </button>
          ))}
        </aside>
        <div className="console-main">
          {!selectedTool ? (
            <div className="console-empty">
              <div className="radar">
                <span />
                <span />
                <span />
                <b>
                  <ScanSearch size={25} />
                </b>
              </div>
              <div className="eyebrow">AWAITING INDICATOR SELECTION</div>
              <h3>Start an investigation</h3>
              <p>Select a capability from the collection panel to begin a targeted lookup.</p>
              <div className="empty-tags">
                <span>DOMAIN</span>
                <span>IP ADDRESS</span>
                <span>EMAIL</span>
                <span>HASH</span>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col space-y-3">
              <button className="console-back" onClick={handleBack}>
                <FaArrowLeft /> BACK TO TOOLKIT
              </button>
              <div className="console-intro">
                <div className="eyebrow">ACTIVE INVESTIGATION MODULE</div>
                <h3>{selectedTool}</h3>
                <p>{placeholders[selectedTool] || 'Enter an indicator to investigate'}</p>
              </div>
              <div className="console-output">
                {history.map((line, idx) => (
                  <pre key={idx} className="whitespace-pre-wrap">
                    {line}
                  </pre>
                ))}
                {loading && <pre className="loading-line">◌ Contacting intelligence source…</pre>}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <span className="input-prompt">›</span>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKey}
                  className="intel-input"
                  placeholder={placeholder}
                />
                <span className="input-hint">ENTER TO RUN</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
