import assert from 'node:assert/strict';
import test from 'node:test';

import {
  rankFeaturedCandidates,
  scoreFeaturedCandidate,
  type FeaturedCurationCandidate,
} from './featured-curation';

const candidate = (
  title: string,
  overrides: Partial<FeaturedCurationCandidate> = {}
): FeaturedCurationCandidate => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  publicId: 'candidate',
  title,
  sourceTitle: title,
  categoryKey: 'poster',
  images: ['https://media.vogueai.net/example.webp'],
  imageAssets: [{ width: 1024, height: 1536 }],
  ...overrides,
});

test('featured curation scores user-approved visual template directions above utility cards', () => {
  const footballPoster = scoreFeaturedCandidate(
    candidate('Identity Lock Across Scenes Football Supporter Poster AI Prompt')
  );
  const foodCommercial = scoreFeaturedCandidate(
    candidate('High Impact Commercial Food Double Juice Burger Commercial')
  );
  const fantasyThemeCard = scoreFeaturedCandidate(
    candidate('Aira Stormglass Theme Card AI', { categoryKey: 'art' })
  );
  const reportCard = scoreFeaturedCandidate(
    candidate('Traditional Face Reading Analysis Report', {
      categoryKey: 'social',
    })
  );
  const profileCard = scoreFeaturedCandidate(
    candidate('Professional Profile Avatar', { categoryKey: 'portrait' })
  );

  assert.ok(footballPoster.score >= 12);
  assert.ok(foodCommercial.score >= 12);
  assert.ok(fantasyThemeCard.score >= 8);
  assert.equal(reportCard.reject, true);
  assert.ok(profileCard.score < fantasyThemeCard.score);
});

test('featured curation ranking excludes seen entries and keeps bucket diversity', () => {
  const entries = [
    candidate('Last Dance Football Supporter Poster AI', { id: 'football-a' }),
    candidate('World Cup National Supporter Poster AI', { id: 'football-b' }),
    candidate('Sports Supporter Poster AI', { id: 'football-c' }),
    candidate('Retro Aviation Travel Poster AI', { id: 'travel-a' }),
    candidate('Creator Personal Brand Identity Mockup AI Prompt', {
      id: 'brand-a',
      categoryKey: 'brandAds',
    }),
  ];

  const ranked = rankFeaturedCandidates(entries, {
    excludedIds: new Set(['football-a']),
    limit: 4,
    maxPerBucket: 2,
  });

  assert.deepEqual(
    ranked.map((entry) => entry.id),
    ['football-b', 'travel-a', 'brand-a', 'football-c']
  );
});

test('featured curation learns the latest commercial and object-led selections', () => {
  const skincareBottle = scoreFeaturedCandidate(
    candidate('Monochrome Skincare Bottle Kinetic Motion Blur', {
      categoryKey: 'product',
    })
  );
  const floatingProfile = scoreFeaturedCandidate(
    candidate('Floating Profile Card Close-Up Photo', { categoryKey: 'photo' })
  );
  const commercialJuice = scoreFeaturedCandidate(
    candidate('Modern Juice Ad Poster')
  );
  const youtubeThumbnail = scoreFeaturedCandidate(
    candidate('YouTube Thumbnail Social Media Content Factory')
  );
  const storyboardSheet = scoreFeaturedCandidate(
    candidate('Cinematic Storyboard Sheet')
  );
  const lowSignalProduct = scoreFeaturedCandidate(
    candidate('Features Exact Model Your', { categoryKey: 'product' })
  );

  assert.ok(skincareBottle.score >= 8);
  assert.ok(floatingProfile.score >= 7);
  assert.ok(commercialJuice.score >= 12);
  assert.ok(youtubeThumbnail.reject);
  assert.ok(storyboardSheet.score < skincareBottle.score);
  assert.equal(lowSignalProduct.reject, true);
});

test('featured curation rejects utility sheets that look like prompt tools instead of featured assets', () => {
  const storyboard = scoreFeaturedCandidate(
    candidate('Winter Survival Thriller Storyboard', { categoryKey: 'diagram' })
  );
  const ecommercePage = scoreFeaturedCandidate(
    candidate('E Commerce Main Image Luxury Skincare Product Page', {
      categoryKey: 'product',
    })
  );
  const relationshipChart = scoreFeaturedCandidate(
    candidate('Ornate Japanese Light Novel Character Relationship Chart Poster', {
      categoryKey: 'diagram',
    })
  );
  const genericProduct = scoreFeaturedCandidate(
    candidate('AI Image AI', { categoryKey: 'product' })
  );
  const genericPerson = scoreFeaturedCandidate(
    candidate('Person', { categoryKey: 'brandAds' })
  );

  assert.equal(storyboard.reject, true);
  assert.equal(ecommercePage.reject, true);
  assert.equal(relationshipChart.reject, true);
  assert.equal(genericProduct.reject, true);
  assert.equal(genericPerson.reject, true);
});

test('featured curation keeps cinematic mood boards, atlases, and key visuals eligible', () => {
  const moodBoard = scoreFeaturedCandidate(
    candidate('Social Media Post Cinematic AI Mood Board', { categoryKey: 'social' })
  );
  const atlas = scoreFeaturedCandidate(
    candidate('Cinematic Atlas Visualization', { categoryKey: 'diagram' })
  );
  const y2kEditorial = scoreFeaturedCandidate(
    candidate('Ultra Stylized Y2K Inspired Fashion Editorial Poster', {
      categoryKey: 'portrait',
    })
  );
  const keyVisual = scoreFeaturedCandidate(
    candidate('Mecha Girl Derelict Sea City Key Visual', { categoryKey: 'art' })
  );
  const relationshipChart = scoreFeaturedCandidate(
    candidate('Ornate Japanese Light Novel Character Relationship Chart Poster', {
      categoryKey: 'diagram',
    })
  );
  const infographicPoster = scoreFeaturedCandidate(
    candidate('World Monuments Infographic Poster', { categoryKey: 'diagram' })
  );
  const developmentBoard = scoreFeaturedCandidate(
    candidate('Sci-Fi Character Development Board', { categoryKey: 'diagram' })
  );
  const designSheet = scoreFeaturedCandidate(
    candidate('Cinematic Character Design Sheet', { categoryKey: 'diagram' })
  );
  const faceReading = scoreFeaturedCandidate(
    candidate('Traditional Face Reading Analysis Poster AI')
  );
  const childPoster = scoreFeaturedCandidate(
    candidate('Retro-Futuristic Character Children', { categoryKey: 'photo' })
  );
  const designBoard = scoreFeaturedCandidate(
    candidate('Cinematic Character Design Board', { categoryKey: 'diagram' })
  );
  const eyeGrid = scoreFeaturedCandidate(
    candidate('Seasonal Eye Macro Grid AI', { categoryKey: 'diagram' })
  );
  const genericVisualPoster = scoreFeaturedCandidate(
    candidate('Visual Poster AI', { categoryKey: 'poster' })
  );
  const diagnosisBoard = scoreFeaturedCandidate(
    candidate('Personal Image Diagnosis Consulting Board AI', {
      categoryKey: 'diagram',
    })
  );
  const presentationBoard = scoreFeaturedCandidate(
    candidate('Architectural Competition Presentation Board AI', {
      categoryKey: 'diagram',
    })
  );
  const logoIdea = scoreFeaturedCandidate(
    candidate('Do Idea Of Logo From 80s Retro Aesthetic', {
      categoryKey: 'brandAds',
    })
  );
  const webtoonSelfie = scoreFeaturedCandidate(
    candidate('Sports Car Editorial Webtoon Selfie Transform AI', {
      categoryKey: 'portrait',
    })
  );
  const liveMatch = scoreFeaturedCandidate(
    candidate('Ultra Realistic Fifa World Cup Final Live', {
      categoryKey: 'photo',
    })
  );
  const genericCharacter = scoreFeaturedCandidate(
    candidate('Artistic 16:9 Character', { categoryKey: 'diagram' })
  );
  const animeIllustration = scoreFeaturedCandidate(
    candidate('Stylized Anime Character Illustration', { categoryKey: 'anime' })
  );
  const baziCharacter = scoreFeaturedCandidate(
    candidate('Bazi Personal Ip Character AI', { categoryKey: 'brandAds' })
  );
  const directBrandAd = scoreFeaturedCandidate(
    candidate('Minimalist Commercial Ad Featuring Oversized White Louis', {
      categoryKey: 'brandAds',
    })
  );

  assert.ok(moodBoard.score >= 9);
  assert.ok(atlas.score >= 8);
  assert.ok(y2kEditorial.score >= 13);
  assert.ok(keyVisual.score >= 11);
  assert.equal(relationshipChart.reject, true);
  assert.equal(infographicPoster.reject, true);
  assert.equal(developmentBoard.reject, true);
  assert.equal(designSheet.reject, true);
  assert.equal(faceReading.reject, true);
  assert.equal(childPoster.reject, true);
  assert.equal(designBoard.reject, true);
  assert.equal(eyeGrid.reject, true);
  assert.equal(genericVisualPoster.reject, true);
  assert.equal(diagnosisBoard.reject, true);
  assert.equal(presentationBoard.reject, true);
  assert.equal(logoIdea.reject, true);
  assert.equal(webtoonSelfie.reject, true);
  assert.equal(liveMatch.reject, true);
  assert.equal(genericCharacter.reject, true);
  assert.equal(animeIllustration.reject, true);
  assert.equal(baziCharacter.reject, true);
  assert.equal(directBrandAd.reject, true);
});
