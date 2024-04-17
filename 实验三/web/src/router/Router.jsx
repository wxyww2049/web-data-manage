import React from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import OverAll from "../pages/OverView/OverView";
import ResponsiveDrawer from "../pages/SiderBar/SiderBar";
import Techonology from "../pages/Technology/Techonology";
import Process from "../pages/Process/Process";
import WordCloud from "../pages/WordCloud/WordCloud";
import Passage from "../pages/Passage/Passage";
export default function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/" element={<OverAll />} />
          <Route path="总览" element={<OverAll />} />
          <Route path="技术" element={<Techonology />} />
          <Route path="进度" element={<Process />} />
          <Route path="词云" element={<WordCloud />} />
          <Route path="文章" element={<Passage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

const Index = () => {
  return (
    <ResponsiveDrawer>
      <Outlet />
    </ResponsiveDrawer>
  );
};
