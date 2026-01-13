export type CmsNavigationLink = {
  label: string
  href: string
}

export type CmsCtaLink = {
  label: string
  href: string
}

export type CmsHeroPill = {
  icon?: string
  label: string
}

export type CmsHeroStat = {
  label: string
  value: string
  icon?: string
}

export type CmsHeroTrust = {
  studentsLabel?: string
  ratingLabel?: string
  avatarInitials?: string[]
  avatarImages?: string[]
  ratingStars?: number
}

export type CmsHeroFloatingCard = {
  icon?: string
  value: string
  label: string
  color?: string
}

export type CmsHeroFeatureCard = {
  icon: string
  title: string
  description: string
  iconBg?: string
}

export type CmsHeroContent = {
  badgeText?: string
  badgeIconLeft?: string
  badgeIconRight?: string
  headline?: string
  headlineHighlight?: string
  subheading?: string
  subheadingHighlight?: string
  description?: string
  supporting?: string
  pills?: CmsHeroPill[]
  stats?: CmsHeroStat[]
  trust?: CmsHeroTrust
  floatingCards?: CmsHeroFloatingCard[]
  featureCards?: CmsHeroFeatureCard[]
}

export type CmsFeatureCard = {
  title: string
  description: string
  icon?: string
}

export type CmsJourneyStep = {
  title: string
  description?: string
  icon?: string
  badgeIcon?: string
  cta?: string
}

export type CmsMetric = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  icon?: string
  description?: string
}

export type CmsSandboxContent = {
  eyebrow?: string
  title?: string
  description?: string
  codeExample?: string
  bullets?: string[]
  primaryCta?: CmsCtaLink
  secondaryCta?: CmsCtaLink | null
}

export type CmsSuccessContent = {
  eyebrow?: string
  title?: string
  highlight?: string
  description?: string
  cta?: CmsCtaLink & { icon?: string }
  guarantee?: string
}

export type CmsHomepageContent = {
  hero?: CmsHeroContent
  featureGrid?: CmsFeatureCard[]
  journey?: CmsJourneyStep[]
  metrics?: CmsMetric[]
  sandbox?: CmsSandboxContent
  success?: CmsSuccessContent
}

export type CmsSiteData = {
  nav?: CmsNavigationLink[]
  cta?: {
    joinNow?: CmsCtaLink
    heroPrimary?: CmsCtaLink
    heroSecondary?: CmsCtaLink
  }
  footer?: {
    title: string
    links: CmsNavigationLink[]
  }[]
  homepage?: CmsHomepageContent | null
}
