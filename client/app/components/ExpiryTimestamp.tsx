/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTimer } from "react-timer-hook";

const ExpiryTimestamp = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 900);
  const {
    seconds,
    minutes,
    hours,
    // days
  } = useTimer({
    expiryTimestamp: time,
    onExpire: () => console.warn("onExpire called"),
  });
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "45px" }}>
        {/* <span>{`${days < 10 ? `0${days}` : days}`}</span>: */}
        <span>{hours < 10 ? `0${hours}` : hours}</span>:
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
    </div>
  );
};

export default ExpiryTimestamp;
