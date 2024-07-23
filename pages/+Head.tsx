import { personalData } from "@/utils/data/personal-data";
import logoUrl from '@/assets/logo.svg';
import ogImageUrl from '@/assets/og_image.png';

function Head() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href={logoUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      <title>{personalData.pageTitle}</title>
      <meta name="description" content={personalData.pageDescription} />
      <meta property="og:site_name" content="Nathan Rico - Front-End Expert" />
      <meta property="og:title" content={personalData.pageTitle} />
      <meta property="og:description" content={personalData.pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImageUrl} />
      <meta name="author" content={personalData.name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={personalData.socialName} />
    </>
  )
}

export { Head }