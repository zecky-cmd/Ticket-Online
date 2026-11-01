/**
 * Composant Link Universel & Sécurisé (Single Page Application Friendly)
 * 
 * Évite rigoureusement tout rechargement de page (page reload) ou saut d'ancre '#'.
 * - Pour les navigations internes ou actions : se comporte comme un bouton sémantique non-rechargeant.
 * - Pour les liens externes (http/https) : ouvre dans un nouvel onglet sécurisé (target="_blank" rel="noopener noreferrer").
 * 
 * @param {string} to - Destination (ex: '/', '#ticket', 'https://...')
 * @param {string} href - Alias de 'to'
 * @param {boolean} external - Forcer en lien externe
 * @param {function} onClick - Action au clic
 * @param {string} className - Classes CSS Tailwind
 * @param {React.ReactNode} children - Contenu du lien
 */
export default function Link({
  to,
  href,
  external,
  onClick,
  className = '',
  children,
  ...props
}) {
  const targetUrl = to || href || '';
  const isExternal = external || targetUrl.startsWith('http://') || targetUrl.startsWith('https://');
  const isTelOrMail = targetUrl.startsWith('tel:') || targetUrl.startsWith('mailto:');

  const handleClick = (e) => {
    // Si ce n'est ni externe ni un lien protocole tel/mail, on stoppe net le rechargement de page
    if (!isExternal && !isTelOrMail) {
      e.preventDefault();
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Liens externes (nouvel onglet sécurisé)
  if (isExternal) {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Liens d'appel téléphonique ou courriel
  if (isTelOrMail) {
    return (
      <a
        href={targetUrl}
        onClick={handleClick}
        className={`cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Liens internes & interactions SPA (zéro rechargement de page)
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer inline-flex items-center text-left bg-transparent p-0 border-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
