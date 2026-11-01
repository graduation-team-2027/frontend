import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type Status = 'suspected' | 'confirmed' | 'rejected' | 'unresolved';
type EventType = 'vape' | 'cigarette' | 'uncertain';
interface HistoryItem { decision: Status; by: string; at: string; reason: string; }
interface Incident { id: string; event: EventType; camera: string; location: string; day: string; start: string; end: string; score: number; identity: string; status: Status; clip: boolean; history: HistoryItem[]; }
interface Notice { id: number; incidentId: string; title: string; at: string; read: boolean; }

@Component({
  selector: 'app-dashboard', standalone: true, imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html', styleUrl: './dashboard.css'
})
export class Dashboard {
  tab = 'overview';
  language: 'ar' | 'en' = 'ar';
  theme: 'light' | 'dark' = 'light';
  role: 'staff' | 'observer' = 'staff';
  filterStatus = 'all';
  filterType = 'all';
  query = '';
  selected: Incident | null = null;
  decision: Status | null = null;
  reason = '';
  modal = false;
  alert = '';
  playbackMessage = false;
  incidents: Incident[] = [
    { id:'INC-001', event:'vape', camera:'CAM-01', location:'Gate 2', day:'2026-10-19', start:'10:42:10', end:'10:42:35', score:.87, identity:'Unknown', status:'suspected', clip:true, history:[] },
    { id:'INC-002', event:'cigarette', camera:'CAM-02', location:'Yard', day:'2026-10-19', start:'11:05:20', end:'11:05:44', score:.79, identity:'Candidate · P-001', status:'suspected', clip:true, history:[] },
    { id:'INC-003', event:'uncertain', camera:'CAM-03', location:'Cafeteria', day:'2026-10-19', start:'12:10:02', end:'12:10:19', score:.41, identity:'Insufficient quality', status:'rejected', clip:false, history:[{decision:'rejected',by:'Reviewer A',at:'2026-10-19 12:40',reason:'Not a smoking or vaping action.'}] },
    { id:'INC-004', event:'vape', camera:'CAM-01', location:'Gate 2', day:'2026-10-18', start:'15:21:44', end:'15:22:06', score:.91, identity:'Unknown', status:'confirmed', clip:true, history:[{decision:'confirmed',by:'Reviewer B',at:'2026-10-18 16:02',reason:'Device and exhale clearly visible.'}] },
    { id:'INC-005', event:'cigarette', camera:'CAM-02', location:'Yard', day:'2026-10-18', start:'09:12:03', end:'09:12:21', score:.58, identity:'Candidate · P-002', status:'unresolved', clip:true, history:[{decision:'unresolved',by:'Reviewer A',at:'2026-10-18 09:50',reason:'Video too dark to tell what the person is holding.'}] }
  ];
  notices: Notice[] = [
    {id:1,incidentId:'INC-002',title:'New suspected event',at:'2026-10-19 11:05',read:false},
    {id:2,incidentId:'INC-001',title:'New suspected event',at:'2026-10-19 10:42',read:false},
    {id:3,incidentId:'INC-005',title:'Incident updated',at:'2026-10-18 09:50',read:true},
    {id:4,incidentId:'INC-003',title:'Incident updated',at:'2026-10-19 12:40',read:true}
  ];
  constructor(private router: Router) {
    const savedTheme = localStorage.getItem('sentinelTheme');
    if (savedTheme === 'dark') this.theme = 'dark';
  }
  get unreadCount() { return this.notices.filter(n => !n.read).length; }
  get filteredIncidents() {
    const q = this.query.trim().toLowerCase();
    return this.incidents.filter(i => (this.filterStatus === 'all' || i.status === this.filterStatus) && (this.filterType === 'all' || i.event === this.filterType) && (!q || `${i.id} ${i.event} ${i.camera} ${i.location} ${i.identity}`.toLowerCase().includes(q)));
  }
  count(status: Status) { return this.incidents.filter(i => i.status === status).length; }
  canReview(i: Incident) { return this.role === 'staff' && (i.status === 'suspected' || i.status === 'unresolved'); }
  labelStatus(s: Status) { return ({suspected:this.language==='ar'?'مشتبه':'Suspected',confirmed:this.language==='ar'?'مؤكدة':'Confirmed',rejected:this.language==='ar'?'مرفوضة':'Rejected',unresolved:this.language==='ar'?'غير محسومة':'Unresolved'})[s]; }
  labelEvent(e: EventType) { return ({vape:this.language==='ar'?'تدخين إلكتروني':'Vaping',cigarette:this.language==='ar'?'سيجارة':'Cigarette',uncertain:this.language==='ar'?'غير مؤكد':'Uncertain'})[e]; }
  openIncident(i: Incident) { this.selected = i; this.reason = ''; this.decision = null; this.modal = false; this.playbackMessage = false; this.tab = 'incidents'; }
  closeIncident() { this.selected = null; this.modal = false; }
  startReview(s: Status) {
    if (!this.selected || !this.canReview(this.selected)) return;
    if (!this.reason.trim()) { this.alert = this.language === 'ar' ? 'سبب المراجعة إجباري.' : 'Review reason is required.'; return; }
    this.alert = ''; this.decision = s; this.modal = true;
  }
  submitReview() {
    if (!this.selected || !this.decision || !this.reason.trim()) return;
    const decision = this.decision;
    this.selected.status = decision;
    this.selected.history.push({decision,by:'Staff reviewer',at:new Date().toISOString().slice(0,16).replace('T',' '),reason:this.reason.trim()});
    this.notices.unshift({id:Date.now(),incidentId:this.selected.id,title:'Incident updated',at:new Date().toISOString().slice(0,16).replace('T',' '),read:false});
    this.modal = false; this.reason = ''; this.decision = null;
    this.alert = this.language === 'ar' ? 'تم حفظ المراجعة.' : 'Review recorded.';
    setTimeout(() => this.alert = '', 3000);
  }
  markAllRead() { this.notices.forEach(n => n.read = true); }
  openNotice(n: Notice) { n.read = true; const item = this.incidents.find(i => i.id === n.incidentId); if (item) this.openIncident(item); }
  setTheme(value: 'light'|'dark') { this.theme = value; localStorage.setItem('sentinelTheme', value); }
  signOut() { localStorage.removeItem('sentinelUser'); this.router.navigate(['/login']); }
  nav(tab: string) { this.tab = tab; this.selected = null; }
  filterBy(status: Status) { this.filterStatus = status; this.tab = 'incidents'; this.selected = null; }
  get isArabic() { return this.language === 'ar'; }
}
