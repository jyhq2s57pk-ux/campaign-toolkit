import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/Badge.css';
import './CustomerJourneyPage.css';
import ImplementationLevels from '../components/ImplementationLevels';
import Badge from '../components/Badge';

const ChevronDown = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z" fill="var(--theme-icon-1, #F1F1F1)" /></svg>);
const ChevronUp = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5L13 10L12.3 10.7L8 6.4L3.7 10.7L3 10L8 5Z" fill="var(--theme-icon-1, #F1F1F1)" /></svg>);
const MarkerLine = () => (<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.375 9L0.375001 9" stroke="#D6D6D6" strokeWidth="0.75" strokeLinecap="round" /></svg>);
const PLATFORM_COLORS = { 'Web': { bg: 'rgba(232, 92, 74, 0.15)', text: '#E85C4A', border: '#E85C4A' }, 'App': { bg: 'rgba(139, 92, 246, 0.15)', text: '#8B5CF6', border: '#8B5CF6' }, 'Email': { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: '#3B82F6' }, 'Social': { bg: 'rgba(236, 72, 153, 0.15)', text: '#EC4899', border: '#EC4899' }, 'In-Store': { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E', border: '#22C55E' } };
const ChevronRight = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);

export default function CustomerJourneyPage() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('campaignId');
  const [pages, setPages] = useState([]);
  const [components, setComponents] = useState({});
  const [expandedPage, setExpandedPage] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCopyIdeas, setExpandedCopyIdeas] = useState(null);
  const detailRefs = useRef({});
  const sectionRefs = useRef({});
  const screenshotRef = useRef(null);

  useEffect(() => { fetchPages(); }, [campaignId]);

  const fetchPages = async () => {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data: platformsData, error: platformsError } = await supabase.from('platforms').select('*').order('name');
    if (platformsError) { setLoading(false); return; }

    const loadedPages = (platformsData || []).map(p => ({ id: p.name, title: p.name, platform_type: p.type || 'Web', screenshot_url: p.screenshot_url }));
    setPages(loadedPages);

    let touchpointsQuery = supabase.from('touchpoints').select('*');
    if (campaignId) {
      touchpointsQuery = touchpointsQuery.eq('campaign_id', campaignId);
    }
    const { data: touchpointsData } = await touchpointsQuery.order('sort_order', { ascending: true });

    let grouped = {};
    if (touchpointsData) {
      touchpointsData.forEach((comp) => { const key = comp.platform; if (!grouped[key]) grouped[key] = []; comp.marker_number = grouped[key].length + 1; grouped[key].push(comp); });
      setComponents(grouped);
    }
    setLoading(false);

    // Automatically expand the first page
    if (loadedPages.length > 0) {
      const firstPage = loadedPages[0];
      setExpandedPage(firstPage);
      const pc = grouped[firstPage.id] || [];
      if (pc.length > 0) setActiveComponent(pc[0]);
    }
  };

  const handlePageClick = (page) => {
    if (expandedPage?.id === page.id) {
      setExpandedPage(null);
      setActiveComponent(null);
    } else {
      setExpandedPage(page);
      const pc = components[page.id] || [];
      if (pc.length > 0) setActiveComponent(pc[0]);
      setTimeout(() => {
        const el = sectionRefs.current[page.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  const handleComponentClick = (component) => { setActiveComponent(component); if (detailRefs.current[component.id]) detailRefs.current[component.id].scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const handleDetailScroll = useCallback(() => { if (!expandedPage) return; for (const comp of (components[expandedPage.id] || [])) { const el = detailRefs.current[comp.id]; if (el) { const rect = el.getBoundingClientRect(); if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.3) { if (activeComponent?.id !== comp.id) setActiveComponent(comp); break; } } } }, [expandedPage, components, activeComponent]);
  useEffect(() => { const c = document.querySelector('.detail-scroll-container'); if (c) { c.addEventListener('scroll', handleDetailScroll); return () => c.removeEventListener('scroll', handleDetailScroll); } }, [handleDetailScroll]);
  const pageComponents = expandedPage ? (components[expandedPage.id] || []) : [];
  const toggleCopyIdeas = (compId, e) => { e.stopPropagation(); setExpandedCopyIdeas(expandedCopyIdeas === compId ? null : compId); };
  const getPlatformStyle = (pt) => { const c = PLATFORM_COLORS[pt] || PLATFORM_COLORS['Web']; return { background: c.bg, color: c.text, border: '1px solid ' + c.border }; };

  return (<div className="page-wrapper"><Header /><main className="journey-page"><div className="outer-container"><section className="page-header"><h1>Customer Touchpoints</h1><p>Explore touchpoints across the customer experience</p></section></div>{pages.length > 0 && (<div className="anchor-nav-strip"><div className="inner-content-wrapper"><div className="anchor-nav-pills">{pages.map((page) => {const isActive = expandedPage?.id === page.id; const style = getPlatformStyle(page.platform_type); return (<button key={page.id} className={`anchor-nav-pill ${isActive ? 'active' : ''}`} style={isActive ? { background: style.background, borderColor: style.border, color: style.color } : undefined} onClick={() => handlePageClick(page)}><span className="anchor-nav-dot" style={{ backgroundColor: style.color }} />{page.title}</button>);})}</div></div></div>)}<div className="inner-content-wrapper"><ImplementationLevels /><div className="journey-content"><div className="journey-section-header"><h2>Customer Touchpoints</h2></div>{loading ? (<div className="loading-state">Loading...</div>) : (<div className="accordion-container">{pages.map((page) => { const isExp = expandedPage?.id === page.id; const cc = (components[page.id] || []).length; return (<div key={page.id} ref={el => sectionRefs.current[page.id] = el} className={'accordion-item ' + (isExp ? 'expanded' : '')}><div className="accordion-header" onClick={() => handlePageClick(page)}><div className="accordion-title-area"><div className="accordion-title">{page.title}</div><div className="platform-badge platform-badge-colored" style={getPlatformStyle(page.platform_type)}><span className="platform-badge-text">{page.platform_type}</span></div></div><div className="accordion-meta"><span className="component-count">{cc} Touchpoints</span><div className="accordion-chevron">{isExp ? <ChevronUp /> : <ChevronDown />}</div></div></div>{isExp && (<div className="accordion-body"><div className="content-layout"><div className="image-frame" ref={screenshotRef}>{page.screenshot_url ? (<div className="screenshot-wrapper"><img src={page.screenshot_url} alt={page.title} className="screenshot-image" /><div className="markers-container">{pageComponents.map((comp, i) => { const t = comp.marker_positions?.[0]?.top || ((i * 140) + 58 + 'px'); return (<div key={comp.id} className={'marker-row ' + (activeComponent?.id === comp.id ? 'active' : '')} style={{ top: t }}><MarkerLine /><div className="number-label"><span className="number-label-text">{comp.marker_number}</span></div></div>); })}</div></div>) : (<div className="no-screenshot"><span>No screenshot</span></div>)}</div><div className="descriptions-container">{pageComponents.map((comp) => { const badges = []; if (comp.is_new) badges.push({ label: 'New', variant: 'new' }); if (comp.tier_executive) badges.push({ label: 'Executive', variant: 'executive' }); if (comp.tier_premium) badges.push({ label: 'Premium', variant: 'premium' }); if (comp.tier_standard !== false) badges.push({ label: 'Standard', variant: 'standard' }); const hasCopy = comp.copy_ideas?.length > 0; const isCopyExp = expandedCopyIdeas === comp.id; return (<div key={comp.id} ref={(el) => detailRefs.current[comp.id] = el} className={'feature-item ' + (activeComponent?.id === comp.id ? 'active' : '')} onClick={() => handleComponentClick(comp)}><div className="feature-content"><div className="feature-header"><div className="feature-number"><span className="feature-number-text">{comp.marker_number}</span></div><div className="feature-title">{comp.title}</div></div><div className="feature-description">{comp.description}</div><div className="feature-badges">{badges.map((b, i) => (<Badge key={i} variant={b.variant} size="sm">{b.label}</Badge>))}</div>{hasCopy && (<div className="copy-ideas-section"><button className={'copy-ideas-toggle ' + (isCopyExp ? 'expanded' : '')} onClick={(e) => toggleCopyIdeas(comp.id, e)}><span>Copy Ideas</span><span className={'copy-ideas-chevron ' + (isCopyExp ? 'rotated' : '')}><ChevronRight /></span></button>{isCopyExp && (<div className="copy-ideas-content">{comp.copy_ideas.map((idea, idx) => (<div key={idx} className="copy-idea-item"><p>{idea}</p></div>))}</div>)}</div>)}</div></div>); })}</div></div></div>)}</div>); })}</div>)}</div></div></main><Footer /></div>);
}