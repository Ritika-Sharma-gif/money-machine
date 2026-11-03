import { Blocks } from "lucide-react";
export default function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <Blocks size={23} />
      </span>
      <span>
        money<span className="brand-light">machine</span>
        <small>THE CREATOR & BUSINESS NETWORK</small>
      </span>
    </span>
  );
}
