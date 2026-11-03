import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
function RequestDialog({ person, role, onClose, onSubmit }) {
  const ref = useRef(null);
  const [message, setMessage] = useState("");
  const invite = role === "business";
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={ref}
      className="request-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (message.trim().length >= 10) onSubmit(message.trim());
        }}
      >
        <button
          type="button"
          className="dialog-close icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={19} />
        </button>
        <p className="eyebrow">
          {invite ? "INVITE A CREATOR" : "APPLY TO AN OPPORTUNITY"}
        </p>
        <h2>{invite ? `Create with ${person.name}.` : person.opportunity}</h2>
        <p>
          Introduce yourself and your idea. This saves a local demo draft only;
          it does not contact {person.name}.
        </p>
        <label htmlFor="proposal">
          {invite ? "Your collaboration idea" : "Why you’re a good fit"}
        </label>
        <textarea
          id="proposal"
          autoFocus
          required
          minLength={10}
          maxLength={1500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your idea, relevant experience, and any questions…"
        />
        <small>{message.trim().length}/1500 characters · Minimum 10</small>
        <button
          className="button"
          type="submit"
          disabled={message.trim().length < 10}
        >
          Save demo {invite ? "invitation" : "application"}
        </button>
      </form>
    </dialog>
  );
}

export { RequestDialog };
