import { getPayload } from 'payload'
import config from '../payload.config'

// ── Lexical helpers ──────────────────────────────────────────────

function textNode(text: string): any {
  return { type: 'text', format: 0, version: 1, text }
}

function paragraphNode(children: any[] = []): any {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    children: children.length ? children : [textNode('')],
  }
}

function headingNode(tag: 'h2' | 'h3', text: string): any {
  return {
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    tag,
    children: [textNode(text)],
  }
}

function linkNode(url: string, text: string): any {
  return {
    type: 'link',
    format: '',
    indent: 0,
    version: 1,
    url,
    children: [textNode(text)],
    linkType: 'internal',
  }
}

function listNode(items: any[]): any {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    listType: 'bullet',
    start: 1,
    children: items.map((item) => ({
      type: 'listitem',
      format: '',
      indent: 0,
      version: 1,
      value: 1,
      children: [paragraphNode(Array.isArray(item) ? item : [textNode(item)])],
    })),
  }
}

function lexicalRoot(children: any[]): any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children,
    },
  }
}

// ── Page definitions ─────────────────────────────────────────────

interface PageSeed {
  title: string
  slug: string
  subtitle?: string
  showSidebar?: boolean
  layout?: 'standard' | 'centered' | 'full-width'
  content: any
}

const pages: PageSeed[] = [
  {
    title: 'Fees & Insurance',
    slug: 'fees',
    subtitle: 'Reimbursement, confidentiality, and what to expect.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      paragraphNode([
        textNode(
          'You are eligible for reimbursement by major insurance companies that have out-of-network coverage. I will assist you in filing your claim. Most insurance companies do not reimburse for sexual therapy. Other types of psychotherapy are reimbursable. If, however, you are seeking a therapist on your insurance panel, and confidentiality is important, take into consideration that managed care/HMO plans require that your therapist discuss your case to assess determination of treatment, discuss your diagnosis/treatment plans and authorize the number of sessions that will be covered.',
        ),
      ]),
      paragraphNode([
        textNode(
          'I am committed to your well-being and look to establish a trusting, discrete relationship that regards confidentiality with the utmost importance.',
        ),
      ]),
    ]),
  },
  {
    title: 'Disclaimer',
    slug: 'disclaimer',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      paragraphNode([
        textNode(
          'This web site is provided for information and education purposes only. No doctor/patient relationship is established by your use of this site. No diagnosis or treatment is being provided. No guarantees or warranties are made regarding any of the information contained within the web site. This web site is not intended to offer specific medical or psychological advice to anyone.',
        ),
      ]),
      paragraphNode([
        textNode(
          'This website and the material contained herein, are the sole and exclusive property of Dr. Valerie Pinhas and Long Island Sex Therapy. This website is independent of all institutions and organizations that may be referred to herein, and nothing herein shall be construed to the contrary.',
        ),
      ]),
    ]),
  },
  {
    title: 'Contact/Location',
    slug: 'contact',
    showSidebar: false,
    layout: 'centered',
    content: lexicalRoot([
      paragraphNode([
        textNode(
          'I am conveniently located in Great Neck, Long Island, approachable from all parts of Long Island, Queens, the Bronx, Westchester and New Jersey. I am a 24-minute LIRR ride from Manhattan\u2019s PENN station. To make an appointment for a consultation at my Great Neck office, contact me at ',
        ),
        linkNode('mailto:vlp@longislandsextherapy.com', 'vlp@longislandsextherapy.com'),
        textNode(' or '),
        linkNode('tel:+15164828314', '(516) 482-8314'),
        textNode(' or '),
        linkNode('tel:+15169876943', '(516) 987-6943'),
        textNode('.'),
      ]),
      paragraphNode([
        textNode(
          'Pandemic has made remote work a viable internet option. I am available for virtual work as well.',
        ),
      ]),
    ]),
  },
  {
    title: 'Links',
    slug: 'links',
    subtitle: 'Recommended resources and professional organizations.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      headingNode('h2', 'RateMyProfessor'),
      paragraphNode([
        textNode(
          'This is a site where students can post their reflections of their academic and personal experiences of their professors.',
        ),
      ]),
      paragraphNode([
        linkNode(
          'https://www.ratemyprofessors.com/ShowRatings.jsp?tid=466259',
          'Visit RateMyProfessor \u2192',
        ),
      ]),
      headingNode('h2', 'National Psychological Association for Psychoanalysis'),
      paragraphNode([
        textNode(
          'The NPAP Membership Association is an organization of psychoanalysts dedicated to the advancement of psychoanalysis as a science and a profession. It was founded by Theodor Reik in 1948, for the purpose of offering all interested and qualified applicants, including those other than physicians, the opportunity for psychoanalytic study and training in the United States. It has continued to evolve into a vibrant professional association of analysts representing the diversity of theories that comprise contemporary psychoanalytic inquiry.',
        ),
      ]),
      paragraphNode([
        linkNode('https://npap.org', 'Visit NPAP \u2192'),
      ]),
    ]),
  },
  {
    title: 'Treatment Specialties',
    slug: 'treatment-specialties',
    subtitle: 'Specialized areas of practice and treatment modalities.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      listNode([
        'Psychoanalytic Psychotherapy',
        'Sexual Therapy',
        'Addiction Therapy',
      ]),
      paragraphNode([
        textNode(
          'I offer a variety of treatment modalities: Individual psychotherapy, once or twice per week, as needed, psychoanalysis, couples therapy, family therapy, and intervention therapy for families with a member who has an addiction.',
        ),
      ]),
    ]),
  },
  {
    title: 'Treatment Perspectives',
    slug: 'treatment-perspectives',
    subtitle: 'Finding the right therapist and the right approach.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      paragraphNode([
        textNode(
          'When you are working with someone around issues of intimacy, you need the right fit between your personality and the therapist\u2019s treatment approach. Good psychotherapy requires a therapeutic match and collaborative effort between the therapist and the patient. What happens in the therapy office has an impact on your inner life and outside world. The goals of therapy are as varied as the people who pursue it. Ultimately, therapy helps you to change your life, your understanding of yourself and others, your satisfaction with work and personal life regardless of the reason(s) that brought you through the office door. Feel free to schedule a consultation to gauge your feelings about working with me.',
        ),
      ]),
      paragraphNode([
        textNode(
          'A good clinician is one who is experienced and fully trained in depth and scope, able to bring practical results. A good clinician is trained in the widest area of life\u2019s difficulties. A good clinician is sensitive to your personal needs. A good clinician is able to ascertain when personal psychotherapy is connected to sexual and or addictions therapy.',
        ),
      ]),
      headingNode('h2', 'If you are seeking help for a problem in the sexual sphere'),
      paragraphNode([textNode('Here are a few things to keep in mind:')]),
      paragraphNode([
        textNode(
          'Seeking help for sexual problems requires a clinician with a full repertoire of skills and treatment modalities that range from behavior-modification sexual therapy to psychoanalytical sexual therapy for more difficult to treat problems. Addiction therapy skills and expertise are also valuable in rounding out the clinical picture because many sexual problems stem from families with addictions. The type of sexual difficulty determines the treatment modality. For example, a man who has difficulty developing and/or maintaining an erection (erectile dysfunction, E.D.) due to lifestyle issues may require a behavior modification sexual therapy approach. This problem may be due to environmental issues, which create performance anxiety. However, this same man may also have more entrenched deep-seated difficulties that show up as symptoms of E.D. His problem with erections may not be the "whole story." He may be bored and disinterested in sex, in general, or with a specific partner. Problems with desire require a more intense treatment approach. Many clinicians that practice sexual therapy are only trained in a short-range clinical focus\u2014that is, behavior modification and cognitive therapy. These techniques are excellent when the reasons for the sexual difficulties are surface-oriented. Psychoanalytic psychotherapists are skilled clinicians trained in dual treatment to deal with the personality deficits and conflicts that underlie the sexual difficulty. The RIGHT clinician is the one with training in both treatment modalities, not one or the other. My training is in both areas, for individuals and couples.',
        ),
      ]),
    ]),
  },
  {
    title: 'Psychoanalytic Psychotherapy',
    slug: 'psychoanalytic-psychotherapy',
    subtitle: 'Areas of practice and concerns treated.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      listNode([
        'Depression and anxiety',
        'Self-esteem issues / self-sabotage / self-punishment',
        'Anger management',
        'Fears and panic anxieties',
        'Work related difficulties',
        'Relationship difficulties / couple communication problems',
        'Parenting concerns',
        'Impulse disorders',
      ]),
    ]),
  },
  {
    title: 'Sex Therapy',
    slug: 'sex-therapy',
    subtitle: 'Areas of practice and concerns treated.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      listNode([
        'Sexual Dysfunctions: sexual desire and arousal problems / erectile inhibition / lack of lubrication / rapid ejaculation / inhibited female orgasm / inhibited male orgasm / vaginismus / painful intercourse',
        'Infertility',
        'Menopausal concerns',
        'Sexual shyness / fears',
        'Sexual abuse and coercion, and trauma',
        'Gender identity conflicts / Cross-dressing / Transgender issues',
      ]),
    ]),
  },
  {
    title: 'Addiction Therapy',
    slug: 'addiction-therapy',
    subtitle: 'Areas of practice and concerns treated.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      listNode([
        'Gambling addiction',
        'Compulsive shopping / hoarding',
        'Sexual addiction',
        'Alcohol and substance abuse / addiction',
        'Eating disorders',
      ]),
    ]),
  },
  {
    title: 'About Dr. Pinhas',
    slug: 'about',
    subtitle: 'Over five decades of compassionate care in sex therapy, psychoanalysis, and addictions treatment.',
    showSidebar: true,
    layout: 'standard',
    content: lexicalRoot([
      paragraphNode([
        textNode(
          'I am a licensed New York State R-LCSW #034069-1, and a Licensed New York State Psychoanalyst #000033. I am Board Certified as a Sexual Therapist and Supervisor from the American Board of Sexology #1775. I am a New York State certified Alcoholism and Substance Abuse Counselor Emeritus #1578. I received my doctoral training at New York University, specializing in Human Sexuality and Alcoholism Psychotherapy, and my psychoanalytic training at the National Psychological Association for Psychoanalysis. Throughout the decades, in addition to my private practice, I have trained many professionals in Addictions therapy and Sexual therapy at private psychiatric hospitals, psychiatric institutes, Colleges and Universities, and nationally recognized training programs throughout the country and internationally.',
        ),
      ]),
      paragraphNode([
        textNode(
          'I love to teach. There is something magical and exciting about interpersonal engagement in a classroom. (It also doesn\u2019t hurt that the subject matter is brimming with aliveness and relevancy!) For 38 years, Nassau Community College has been my home where I have authored and taught courses in Human Sexuality, Alcoholism, Addictions and other Abusive Behaviors, and Death and Dying for both honors and regular college students. In addition, I have taught adjunct courses at the graduate school level at Queens College and Adelphi University.',
        ),
      ]),
    ]),
  },
]

// ── Migration ──────────────────────────────────────────────────────

async function run() {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding pages...')

  for (const page of pages) {
    // Check if page with this slug already exists
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      payload.logger.info(`Page "${page.slug}" already exists — skipping.`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        subtitle: page.subtitle || '',
        content: page.content,
        showSidebar: page.showSidebar ?? true,
        layout: page.layout || 'standard',
        _status: 'published',
      },
    })

    payload.logger.info(`Created page "${page.slug}"`)
  }

  payload.logger.info('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
