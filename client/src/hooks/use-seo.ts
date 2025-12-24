import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
}

const BASE_URL = 'https://klaraproject.org';
const SITE_NAME = 'Klara Project';

/**
 * Hook for managing per-page SEO meta tags
 * Updates document title and meta tags when component mounts
 */
export function useSEO({ title, description, path = '/', type = 'website' }: SEOConfig) {
  useEffect(() => {
    // Update document title
    const fullTitle = title === SITE_NAME
      ? `${title} | Christian Clarity for the AI Age`
      : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    // Update meta description
    updateMetaTag('name', 'description', description);

    // Update canonical URL
    const canonicalUrl = `${BASE_URL}${path}`;
    updateLinkTag('canonical', canonicalUrl);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', type);

    // Update Twitter tags
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:url', canonicalUrl);

    // Cleanup: restore default values when unmounting
    return () => {
      document.title = `${SITE_NAME} | Christian Clarity for the AI Age`;
    };
  }, [title, description, path, type]);
}

function updateMetaTag(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (element) {
    element.setAttribute('content', value);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    element.setAttribute('content', value);
    document.head.appendChild(element);
  }
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
}

// SEO configurations for each page
export const SEO_CONFIG = {
  home: {
    title: 'Klara Project',
    description: 'Equipping churches with practical AI resources and engaging culture to ensure Christian perspectives shape technology development. Curricula, guides, and grants for the AI age.',
    path: '/'
  },
  about: {
    title: 'About Us',
    description: 'Learn about Klara Project\'s mission to equip churches with AI resources, engage culture with Christian perspectives, and empower the next generation for an AI-shaped world.',
    path: '/about'
  },
  getInvolved: {
    title: 'Get Involved',
    description: 'Join Klara Project in shaping how Christians engage with AI. Volunteer, share our mission, or subscribe to our newsletter for updates on faith and technology.',
    path: '/get-involved'
  },
  donate: {
    title: 'Donate',
    description: 'Support Klara Project\'s mission to equip churches and engage culture with a Christian perspective on AI. Your donation helps provide curricula, resources, and grants.',
    path: '/donate'
  },
  donateThankYou: {
    title: 'Thank You',
    description: 'Thank you for your generous donation to Klara Project. Your support helps us equip churches with AI resources and engage culture with Christian perspectives.',
    path: '/donate/thank-you'
  },
  nextGeneration: {
    title: 'Next Generation',
    description: 'Empowering Gen Z and Gen Alpha to lead with wisdom and faith in an AI-shaped world. Resources and programs for youth engagement with technology and Christianity.',
    path: '/next-generation'
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    description: 'Klara Project privacy policy. Learn how we collect, use, and protect your personal information.',
    path: '/privacy-policy'
  },
  termsOfService: {
    title: 'Terms of Service',
    description: 'Klara Project terms of service. Read our terms and conditions for using our website and services.',
    path: '/terms-of-service'
  }
} as const;
