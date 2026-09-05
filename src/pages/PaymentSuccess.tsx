import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NavLink, useSearchParams } from "react-router";
import gsap from "gsap";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface PaymentData {
  success: boolean;
  sessionId: string;
  email: string;
  displayName: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  productImage: string;
  productTitle: string;
}

const VERIFY_URL =
  "http://127.0.0.1:5001/novara-7b539/asia-southeast1/verifyCheckoutSession";

const PaymentSuccess = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------------
  // GET STRIPE SESSION ID & VERIFY
  // -----------------------------------------
  useEffect(() => {
    if (!sessionId) {
      setError("Stripe payment session was not found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        setError("");

        const url = `${VERIFY_URL}?session_id=${encodeURIComponent(sessionId)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Payment verification failed.");
        }

        setPaymentData(data);
      } catch (error) {
        console.error("Payment verification error:", error);

        setError(
          error instanceof Error ? error.message : "Unable to verify payment.",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);
  // -----------------------------------------
  // GSAP ANIMATIONS (Slide in from right)
  // -----------------------------------------
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
      )
        .fromTo(
          ".success-badge",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
        )
        .fromTo(
          cardRef.current,
          { x: 300, opacity: 0, scale: 0.9 }, // Slides in from right (x: 300)
          { x: 0, opacity: 1, scale: 1, duration: 0.9 },
          "-=0.3",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const cardNumber = "•••• •••• •••• 4242";
  const expiryDate = new Date().toLocaleString();
  const cardName = paymentData?.displayName || "VALUED CUSTOMER";
  const amountPaid = paymentData?.amount
    ? `$${paymentData.amount.toFixed(2)} ${paymentData.currency?.toUpperCase() || "USD"}`
    : "$1205.00 USD";

  if (loading) {
    return (
      <StyledWrapper>
        <div className="success-container loading-state">
          <Loader2 className="spinner" size={48} />
          <h2>Verifying payment...</h2>
        </div>
      </StyledWrapper>
    );
  }

  if (error) {
    return (
      <StyledWrapper>
        <div className="success-container error-state">
          <div className="error-badge">
            <AlertCircle size={32} />
          </div>
          <h1>Verification Failed</h1>
          <p className="subtitle">{error}</p>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <>
      <StyledWrapper ref={containerRef}>
        <div className="success-container">
          {/* Success Icon Badge */}
          <div className="success-badge">
            <CheckCircle2 size={32} />
          </div>

          {/* Credit Card Component (Starts showing front side by default) */}
          <div className="card-wrapper" ref={cardRef}>
            <div className="flip-card">
              <div className="flip-card-inner">
                {/* FRONT SIDE (Shown by default) */}
                <div className="flip-card-front">
                  <p className="heading_8264">MASTERCARD</p>
                  <svg
                    className="logo"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width={36}
                    height={36}
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#ff9800"
                      d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                    />
                    <path
                      fill="#d50000"
                      d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                    />
                    <path
                      fill="#ff3d00"
                      d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                    />
                  </svg>
                  <svg
                    version="1.1"
                    className="chip"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="30px"
                    height="30px"
                    viewBox="0 0 50 50"
                    xmlSpace="preserve"
                  >
                    <image
                      id="image0"
                      width={50}
                      height={50}
                      x={0}
                      y={0}
                      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOY fEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSW ekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GS e0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOW ekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bf u3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWua fUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1 lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrb tnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOh g0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU /f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dE orDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2Ng GAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVg OkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3d I2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6a /KoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkI JVU1RSiSalAt6rUxUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTS0F qBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAachpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM 1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSysjyPrRQ0oQVKDAQHlYFYUwIm4gqExGm BSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdC S24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpj cmVhdGUAMjAyMy0wMi0xM1QwODoxMToyOSswMDkoMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIw MjMtMoJNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAy LTEzTDA4OjE5OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="
                    />
                  </svg>
                  <svg
                    className="chip"
                    width="46"
                    height="34"
                    viewBox="0 0 70 50"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      {/* Metallic gold */}
                      <linearGradient id="chipGold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF4B0" />
                        <stop offset="18%" stopColor="#E8C45A" />
                        <stop offset="42%" stopColor="#C89B25" />
                        <stop offset="65%" stopColor="#F1D66F" />
                        <stop offset="82%" stopColor="#B27A08" />
                        <stop offset="100%" stopColor="#E6BE43" />
                      </linearGradient>

                      {/* Metallic shine */}
                      <linearGradient
                        id="chipHighlight"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#FFFFFF"
                          stopOpacity="0.42"
                        />
                        <stop
                          offset="35%"
                          stopColor="#FFFFFF"
                          stopOpacity="0.08"
                        />
                        <stop
                          offset="70%"
                          stopColor="#7A5200"
                          stopOpacity="0.08"
                        />
                        <stop
                          offset="100%"
                          stopColor="#6A4300"
                          stopOpacity="0.22"
                        />
                      </linearGradient>

                      <filter id="chipShadow">
                        <feDropShadow
                          dx="0"
                          dy="1"
                          stdDeviation="1"
                          floodOpacity="0.3"
                        />
                      </filter>
                    </defs>

                    {/* Real chip body */}
                    <rect
                      x="2"
                      y="2"
                      width="66"
                      height="46"
                      rx="9"
                      fill="url(#chipGold)"
                      filter="url(#chipShadow)"
                    />

                    {/* Metallic surface */}
                    <rect
                      x="2"
                      y="2"
                      width="66"
                      height="46"
                      rx="9"
                      fill="url(#chipHighlight)"
                    />

                    {/* EMV etched contacts */}
                    <g
                      fill="none"
                      stroke="#87620A"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {/* Left contacts */}
                      <path d="M2 16H15C18 16 20 18 20 21V25" />
                      <path d="M2 34H15C18 34 20 32 20 29V25" />

                      {/* Right contacts */}
                      <path d="M68 16H55C52 16 50 18 50 21V25" />
                      <path d="M68 34H55C52 34 50 32 50 29V25" />

                      {/* Top contacts */}
                      <path d="M18 2V10C18 13 20 16 23 16H35" />
                      <path d="M52 2V10C52 13 50 16 47 16H35" />

                      {/* Bottom contacts */}
                      <path d="M18 48V40C18 37 20 34 23 34H35" />
                      <path d="M52 48V40C52 37 50 34 47 34H35" />

                      {/* Central EMV section */}
                      <rect x="20" y="16" width="30" height="18" rx="3" />

                      {/* Center horizontal */}
                      <path d="M20 25H50" />

                      {/* Center vertical */}
                      <path d="M35 16V34" />

                      {/* Additional internal connections */}
                      <path d="M27 16V25" />
                      <path d="M43 16V25" />
                      <path d="M27 25V34" />
                      <path d="M43 25V34" />
                    </g>

                    {/* Outer metallic edge */}
                    <rect
                      x="2.5"
                      y="2.5"
                      width="65"
                      height="45"
                      rx="8.5"
                      fill="none"
                      stroke="#FFF0A0"
                      strokeOpacity="0.5"
                      strokeWidth="1"
                    />
                  </svg>
                  <p className="number">{cardNumber}</p>
                  <p className="valid_thru">VALID THRU</p>
                  <p className="date_8264">{expiryDate}</p>
                  <p className="name">{cardName}</p>
                </div>

                {/* BACK SIDE (Displays Amount Paid, flips on hover) */}
                <div className="flip-card-back">
                  <div className="strip" />
                  <div className="amount-container">
                    <span className="amount-label">Amount Paid</span>
                    <span className="amount-value">{amountPaid}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" active:scale-97 ">
            <NavLink
              to={"/cart"}
              className="bg-green-800 text-white w-full px-14 py-3 rounded-xl font-bold"
            >
              Dashbord
            </NavLink>
          </div>
        </div>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #1e1e2f 0%, #0d0d15 100%);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;

  .success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(25, 25, 35, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    width: auto;
    text-align: center;
    color: #ffffff;
    gap: 24px;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .spinner {
    animation: spin 1s linear infinite;
    color: #6366f1;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .success-badge,
  .error-badge {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #00b09b, #96c93d);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    box-shadow: 0 10px 20px rgba(0, 176, 155, 0.3);
  }

  .error-badge {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
  }

  .card-wrapper {
    display: flex;
    justify-content: center;
  }

  .flip-card {
    background-color: transparent;
    width: 280px;
    height: 180px;
    perspective: 1000px;
    color: white;
  }

  .heading_8264 {
    position: absolute;
    letter-spacing: 0.2em;
    font-size: 0.6em;
    top: 2em;
    left: 17.5em;
  }

  .logo {
    position: absolute;
    top: 5.5em;
    left: 12em;
  }

  .chip {
    position: absolute;
    top: 2.3em;
    left: 1.5em;
  }

  .contactless {
    position: absolute;
    top: 3.2em;
    left: 12.4em;
  }

  .number {
    position: absolute;
    font-weight: bold;
    font-size: 0.75em;
    top: 7.5em;
    left: 1.6em;
    letter-spacing: 1px;
  }

  .valid_thru {
    position: absolute;
    font-weight: bold;
    font-size: 0.4em;
    top: 11em;
    left: 4.5em;
  }

  .date_8264 {
    position: absolute;
    font-weight: bold;
    font-size: 0.6em;
    top: 11.8em;
    left: 3.2em;
  }

  .name {
    position: absolute;
    font-weight: bold;
    font-size: 0.6em;
    top: 14.5em;
    left: 2em;
    text-transform: uppercase;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .strip {
    position: absolute;
    background-color: black;
    width: 100%;
    height: 2.2em;
    top: 2em;
    background: repeating-linear-gradient(
      45deg,
      #303030,
      #303030 10px,
      #202020 10px,
      #202020 20px
    );
  }

  .amount-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    top: 5.5em;
    gap: 4px;
  }

  .amount-label {
    font-size: 0.55em;
    letter-spacing: 0.1em;
    color: #a0a0b0;
    text-transform: uppercase;
  }

  .amount-value {
    font-size: 0.9em;
    font-weight: bold;
    color: #4ade80;
    letter-spacing: 0.5px;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    /* Defaults to showing the front side first */
    transform: rotateY(0deg);
  }

  .flip-card:hover .flip-card-inner {
    /* Flips to back on hover */
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1rem;
  }

  .flip-card-front {
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 2px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
    background-color: #171717;
  }

  .flip-card-back {
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 2px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
    background-color: #171717;
    transform: rotateY(180deg);
  }
`;

export default PaymentSuccess;
