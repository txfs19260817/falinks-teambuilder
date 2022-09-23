import { useContext, useEffect, useRef, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

// TODO: implement
export function HistoryDialog() {
  const { teamState } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLLabelElement>(null);

  // lazy load showdown
  useEffect(() => {
    if (isOpen) {
      if (modalRef.current) {
        modalRef.current.scrollLeft = 100000; // rtl
      }
    }
  }, [isOpen]);

  return (
    <>
      <input
        type="checkbox"
        id="history-modal"
        className="modal-toggle"
        onChange={(e) => {
          setIsOpen(e.target.checked);
        }}
      />
      {/* Right-side drawer implemented with rtl modal, allowing to click outside to close */}
      <label htmlFor="history-modal" className="modal-right modal" ref={modalRef}>
        <label className="modal-box" dir="rtl" htmlFor="">
          <label htmlFor="history-modal" className="btn-sm btn-circle btn absolute left-1.5 top-1.5">
            ✕
          </label>
          <div className="ml-2 mt-2" dir="ltr">
            <h3 className="text-lg font-bold">Edit History</h3>
            <ul className="steps steps-vertical">
              {teamState.history.map((change, idx) => (
                <li key={idx} className="step-primary step">
                  {JSON.stringify(change)}
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-action">
            <button className="btn-primary btn-sm btn">Copy</button>
          </div>
        </label>
      </label>
    </>
  );
}
