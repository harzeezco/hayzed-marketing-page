export function ShopIllustration() {
  return <div className="illustration"><div className="illustration-label"><span className="live-dot"/> LOCAL SHOPS. MORE POSSIBILITIES.</div><svg viewBox="0 0 560 440" role="img" aria-label="Illustration of a neighbourhood shop with a plant, shopping bag, and a location marker">
    <circle cx="285" cy="218" r="174" fill="#e4e9c9"/><path d="M52 366h454" stroke="#a5b592" strokeWidth="2"/><path d="M91 366V246h56v120m-43-142v-51h25v51" fill="#e2b988"/><path d="M90 246h58l-8-24h-42z" fill="#d09a63"/>
    <rect x="153" y="157" width="264" height="209" rx="5" fill="#f4ead4" stroke="#173e32" strokeWidth="3"/>
    <rect x="168" y="108" width="234" height="59" rx="9" fill="#173e32"/><text x="285" y="147" fill="#fff8eb" textAnchor="middle" fontFamily="Georgia,serif" fontSize="31">Your local finds</text>
    <path d="M153 167h264l21 53H132z" fill="#f2a45c" stroke="#173e32" strokeWidth="3"/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M${163+i*51} 168h25l${i*2-4} 52h-30z`} fill="#fff2d9"/>)}
    <path d="M132 220v12q15 23 31 0q15 23 31 0q15 23 31 0q15 23 31 0q15 23 31 0q15 23 31 0q15 23 31 0q15 23 31 0q15 23 29 0v-12" fill="#f2a45c" stroke="#173e32" strokeWidth="3"/>
    <rect x="177" y="262" width="115" height="78" rx="3" fill="#bed0b5" stroke="#173e32" strokeWidth="3"/><path d="M234 262v78m-57-23h115" stroke="#173e32" strokeWidth="3"/>
    <rect x="313" y="260" width="79" height="106" rx="3" fill="#78977b" stroke="#173e32" strokeWidth="3"/><path d="M324 273h56v57h-56z" fill="#c9d7bd"/><circle cx="379" cy="344" r="3" fill="#fff8eb"/>
    <path d="M196 311v-24h21v24m31 0v-33h22v33" stroke="#51735c" strokeWidth="9"/>
    <path d="M437 366v-81m0 37q-43-5-34-40q33 0 34 40m0-9q35-8 31-40q-31 1-31 40" stroke="#315b42" strokeWidth="3" fill="#78977b"/><path d="M416 339h43l-7 27h-29z" fill="#c8804d"/>
    <path d="M95 325h51l6 53H89z" fill="#e77b43" stroke="#173e32" strokeWidth="3"/><path d="M106 331v-11a14 14 0 0 1 28 0v11" fill="none" stroke="#173e32" strokeWidth="3"/>
    <path d="M434 90a29 29 0 1 0-58 0c0 23 29 46 29 46s29-23 29-46" fill="#e77b43" stroke="#173e32" strokeWidth="3"/><circle cx="405" cy="89" r="10" fill="#fff3dc"/>
    <path d="M116 122v20m-10-10h20m323 87v16m-8-8h16" stroke="#e77b43" strokeWidth="3"/>
  </svg><div className="illustration-caption"><span>Less searching.<br/><strong>More finding.</strong></span><span className="round-arrow" aria-hidden="true">↗</span></div><p className="art-note">A picture of what we’re working towards. Not a live shop.</p></div>;
}
