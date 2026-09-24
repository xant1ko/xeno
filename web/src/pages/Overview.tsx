import {
  AboutConclusion,
  AboutDataSection,
  AboutFutureSection,
  AboutHabitsSection,
  AboutHero,
  AboutPurposeSection,
} from "./about/components";
import { Logo } from "../components/AppLogo";

export function OverView() {
  return (
    <>
      <header className="overview-header">
        <div className="overview-header__content">
          <Logo />
          <span className="overview-header__placeholder">
            Навигация появится здесь
          </span>
        </div>
      </header>
      <main className="overview-page">
        <AboutHero />
        <AboutPurposeSection />
        <AboutDataSection />
        <AboutHabitsSection />
        <AboutFutureSection />
        <AboutConclusion />
      </main>
    </>
  );
}
