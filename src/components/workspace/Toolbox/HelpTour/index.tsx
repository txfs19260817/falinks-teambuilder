import { useTour } from '@reactour/tour';

function HelpTour() {
  const { setIsOpen } = useTour();
  return (
    <button id="show-help-btn" className="rounded" onClick={() => setIsOpen(true)}>
      <span>🦮</span>
      <span>Help</span>
    </button>
  );
}

export default HelpTour;
