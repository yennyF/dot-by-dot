"use client";

// import Calendar from "./Calendar";
// import { useState } from "react";
import CalendarList from "./components/CalendarList";
import { AppProvider } from "./AppContext";

export default function Home() {
  // const [option, setOption] = useState(1);

  return (
    <div>
      {/* <div className="flex"> */}
      {/* <button className="button-main" onClick={() => setOption(1)}>Calendar</button>
        <button className="button-main"onClick={() => setOption(2)} >Calendar List</button>
        </div>
        {option === 1 ? <Calendar/> : <CalendarList/>} */}
      <AppProvider>
        <CalendarList />
      </AppProvider>
    </div>
  );
}
