import Header from "./header"
import Footer from "./footer"
import type { ReactNode } from "react"
import ScrollButton from "./scrollButton"

export default function Layout({ title, children }: { title: string, children: ReactNode }) {
  return (
    <>
      <ScrollButton />
      <Header />
      <div className="titleContainer">
        <h1 className="title">{title}</h1>
      </div>
      <div className="mainContainer">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
