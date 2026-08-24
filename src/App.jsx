import { useState } from 'react'
import Header from './components/layout/Header.jsx'
import TabNav from './components/layout/TabNav.jsx'
import BriefingTab from './components/briefing/BriefingTab.jsx'
import FeedCalendarTab from './components/feed/FeedCalendarTab.jsx'
import CaptureTab from './components/capture/CaptureTab.jsx'

const TAB_COMPONENTS = {
  briefing: BriefingTab,
  feed: FeedCalendarTab,
  captacao: CaptureTab,
}

export default function App() {
  const [tab, setTab] = useState('briefing')
  const ActiveTab = TAB_COMPONENTS[tab]

  return (
    <div className="app">
      <Header />
      <TabNav activeTab={tab} onChange={setTab} />
      <main className="content">
        <ActiveTab />
      </main>
    </div>
  )
}
