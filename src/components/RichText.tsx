import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

const components: PortableTextComponents = {
  block: {
    // Map Portable Text styles to the same classes the Lexical RichText
    // component produced inside .prose-content (styles come from globals.css).
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || ''
      const isInternal = href.startsWith('/') || href.startsWith('#')
      if (isInternal) {
        return (
          <Link href={href} className="underline hover:text-sage-800">
            {children}
          </Link>
        )
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-sage-800">
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: ({ children }) => <li>{children}</li>,
}

/**
 * Renders Sanity Portable Text with the same visual output as the
 * previous Payload Lexical <RichText /> inside .prose-content.
 */
export function RichText({ data }: { data: any }) {
  if (!data) return null
  return <PortableText value={data} components={components} />
}
