import {CircleCheck,ClipboardList,Laptop,Smartphone} from "lucide-react";

/**
 * Mobile-first, hand-coded, explicitly labelled demonstration.
 * Not a screenshot of a technician's real workspace or live business metrics.
 */
export function MobileDashboardPreview(){
 return <section className="mobile-product-preview" aria-label="Sample mobile repair dashboard">
  <div className="mobile-preview-top">
   <strong className="mini-wordmark">fixa<span>.</span></strong>
   <span>Sample workspace</span>
  </div>
  <div className="mobile-preview-body">
   <div className="mobile-preview-title">
    <span>Your workspace</span>
    <h2>A clearer day starts here.</h2>
   </div>
   <div className="mobile-preview-metrics">
    <div className="mobile-preview-metric">
     <span>Active repairs <ClipboardList size={16} aria-hidden="true"/></span>
     <strong>24</strong>
    </div>
    <div className="mobile-preview-metric">
     <span>Ready for pickup <CircleCheck size={16} aria-hidden="true"/></span>
     <strong>08</strong>
    </div>
   </div>
   <h3 className="mobile-preview-section-title">On the workbench</h3>
   <div className="mobile-preview-repairs">
    <div className="mobile-preview-repair">
     <span className="mobile-preview-device"><Smartphone size={19} aria-hidden="true"/></span>
     <div className="mobile-preview-repair-info">
      <strong>iPhone 13 Pro</strong>
      <span>Screen replacement</span>
     </div>
     <span className="mobile-preview-status">In progress</span>
    </div>
    <div className="mobile-preview-repair">
     <span className="mobile-preview-device"><Laptop size={19} aria-hidden="true"/></span>
     <div className="mobile-preview-repair-info">
      <strong>MacBook Air M2</strong>
      <span>Battery replacement</span>
     </div>
     <span className="mobile-preview-status is-ready">Ready</span>
    </div>
   </div>
  </div>
  <p className="mobile-preview-note">Illustrative data · Explore the demo to try Fixa.</p>
 </section>;
}
