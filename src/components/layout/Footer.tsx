import Link from 'next/link'

type NavItem = {
  label: string
  url: string
}

type SiteSettings = {
  siteName: string
  tagline: string
  contactEmail: string
  phoneNumber?: string
  address?: string
  officeHours?: string
  licenseInfo?: string
  socialLinks?: { platform: string; url: string }[]
}

export function Footer({
  footerNav = [],
  settings,
}: {
  footerNav: NavItem[]
  settings: SiteSettings
}) {
  return (
    <footer className="bg-sage-900 text-cream-100 mt-auto">
      <div className="container-wide py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-serif text-cream-50 mb-3">{settings.siteName}</h3>
            <p className="text-sm text-cream-200/80 mb-4">{settings.tagline}</p>
            {settings.licenseInfo && (
              <p className="text-xs text-cream-200/60">{settings.licenseInfo}</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-cream-200 mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="text-sm text-cream-200/80 hover:text-cream-50">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-cream-200 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-cream-200/80">
              {settings.address && (
                <li>
                  <span className="block text-xs text-cream-200/50 mb-0.5">Office</span>
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              <li>
                <span className="block text-xs text-cream-200/50 mb-0.5">Email</span>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-cream-50">
                  {settings.contactEmail}
                </a>
              </li>
              {settings.phoneNumber && (
                <li>
                  <span className="block text-xs text-cream-200/50 mb-0.5">Phone</span>
                  {settings.phoneNumber}
                </li>
              )}
              {settings.officeHours && (
                <li>
                  <span className="block text-xs text-cream-200/50 mb-0.5">Hours</span>
                  {settings.officeHours}
                </li>
              )}
            </ul>

            {settings.socialLinks && settings.socialLinks.length > 0 && (
              <div className="flex gap-4 mt-4">
                {settings.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cream-200/70 hover:text-cream-50 underline"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-sage-700">
          <p className="text-xs text-cream-200/50">
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
            The content on this site is for informational purposes only and does not constitute professional advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
