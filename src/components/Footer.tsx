import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
    logoSrc?: string;
}

export function Footer({ logoSrc = `${import.meta.env.BASE_URL}images/logo 2.png` }: FooterProps) {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src={logoSrc} alt="Frost Pursuit" className="footer-logo" />
                        <p>{t.footer.tagline}</p>
                    </div>
                    <nav className="footer-links">
                        <a href="#showcase">{t.nav.showcase}</a>
                        <a href="#highlights">{t.nav.highlights}</a>
                        <a href="#redstone">{t.nav.redstone}</a>
                        <a href="#hero">{t.nav.download}</a>
                    </nav>
                </div>
                <div className="footer-bottom">
                    <p>{t.footer.copyright.replace('2024', String(currentYear))}</p>
                </div>
            </div>
        </footer>
    );
}
