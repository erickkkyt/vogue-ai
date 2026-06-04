import assert from 'node:assert/strict';
import test from 'node:test';

import gptImagePrompts from './generated/awesome-gptimage2-prompts.json';
import midjourneyPrompts from './generated/awesome-ai-prompts-midjourney.json';
import nanoBananaPrompts from './generated/awesome-ai-prompts-nano-banana.json';
import {
  getVoguePromptCategoryKey,
  getVoguePromptDisplayTitle,
  VOGUE_PROMPT_CATEGORY_KEYS,
} from './prompt-taxonomy';
import { getFeaturedPromptEntries, type VoguePromptEntry } from './prompts';

const allEntries = [
  ...(gptImagePrompts as VoguePromptEntry[]),
  ...(nanoBananaPrompts as VoguePromptEntry[]),
  ...(midjourneyPrompts as VoguePromptEntry[]),
];

const getEntry = (id: string) => {
  const entry = allEntries.find((item) => item.id === id);
  assert.ok(entry, `Missing fixture ${id}`);
  return entry;
};

const getFeaturedEntry = (id: string) => {
  const entry = getFeaturedPromptEntries().find((item) => item.id === id);
  assert.ok(entry, `Missing featured fixture ${id}`);
  return entry;
};

test('vogue prompt taxonomy gives rough imported titles readable gallery titles', () => {
  assert.equal(
    getVoguePromptDisplayTitle(
      getEntry('x-2055485138080014769')
    ),
    'Flagship Smartphone Infographic'
  );
  assert.equal(
    getVoguePromptDisplayTitle(
      getEntry('x-2055511800834334829')
    ),
    'Stylized Anime Character Illustration'
  );
  assert.equal(
    getVoguePromptDisplayTitle(
      getEntry('x-2055091040147603647')
    ),
    'Anti-Gravity Drive Infographic'
  );
  assert.equal(
    getVoguePromptDisplayTitle(
      getEntry('x-2054012568650309959')
    ),
    'Nightclub Bar Conversation Photo'
  );
});

test('vogue prompt taxonomy assigns one precise second-level type per prompt', () => {
  assert.deepEqual(VOGUE_PROMPT_CATEGORY_KEYS, [
    'all',
    'product',
    'poster',
    'avatar',
    'ui',
    'diagram',
    'anime',
    'photo',
    'art',
    'epic',
  ]);
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055485138080014769')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055511800834334829')), 'anime');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055091040147603647')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2054012568650309959')), 'photo');
});

test('vogue prompt taxonomy keeps obvious use-case cues from being pulled into photo', () => {
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055491388310237685')), 'product');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2054139543423492547')), 'product');
  assert.equal(
    getVoguePromptCategoryKey(
      getEntry('x-2047218442030166086-r1-product-marketing-openai-merch-poster-grid')
    ),
    'product'
  );
  assert.equal(
    getVoguePromptCategoryKey(
      getEntry('x-2047008188285792724-e-commerce-main-image-3d-product-box-dieline-visualization')
    ),
    'product'
  );
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053843881553502219')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2054001359649906715')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053752582515122358')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053487042605326593')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053137918118572100')), 'diagram');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053730892103782706')), 'diagram');
});

test('vogue prompt taxonomy separates anime, poster, and illustration intent', () => {
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055493824227532906')), 'anime');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055486388145893605')), 'anime');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2054097062346821680')), 'poster');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2055506404455374935')), 'art');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2053822435062141367')), 'poster');
  assert.equal(getVoguePromptCategoryKey(getEntry('x-2054054476429009086')), 'poster');
});

test('featured prompt entries classify against curated display titles', () => {
  assert.equal(getFeaturedEntry('x-2053814655655543119').title, 'High Fashion Editorial Poster');
  assert.equal(getFeaturedEntry('x-2053814655655543119').categoryKey, 'poster');
});

test('featured prompt titles keep distinguishing cues for generic UI and character prompts', () => {
  const landingTitleIds = [
    'x-2047345174872044022',
    'x-2047061602315460747-r1-product-marketing-elegant-japanese-divorce-law-lp-hero',
    'x-2047061602315460747-r2-product-marketing-japanese-inheritance-tax-lp-hero',
    'x-2047061602315460747-r3-social-media-post-japanese-legal-services-lp-banner',
    'x-2044982293497090128',
    'x-2044974254769463312-r0-product-marketing-dark-mode-marketing-case-study-ui',
  ];
  const landingTitles = landingTitleIds.map((id) => getFeaturedEntry(id).title);

  assert.deepEqual(landingTitles, [
    'Kurigawa Ramen Landing Page',
    'Elegant Japanese Divorce Law LP Hero',
    'Japanese Inheritance Tax LP Hero',
    'Japanese Legal Services LP Banner',
    'Modern SaaS Homepage Design Boards',
    'Dark Mode Marketing Case Study UI',
  ]);
  assert.equal(new Set(landingTitles).size, landingTitles.length);
  assert.equal(
    landingTitles.some((title) => title === 'Landing Page Mockup'),
    false
  );
  assert.equal(
    getFeaturedEntry('x-2054116876591272081').title,
    'Ultra Detailed Anime Character Poster Futuristic Streetwear'
  );
});

test('midjourney prompt titles do not fall back to sref weight fragments', () => {
  const title = getVoguePromptDisplayTitle(
    getEntry('x-2055712049595121758')
  );

  assert.equal(title, 'Golden Era Fashion Portrait');
  assert.doesNotMatch(title, /::|\d{6,}/);
  assert.equal(
    getFeaturedEntry('x-2055712049595121758').title,
    'Golden Era Fashion Portrait'
  );
});

test('vogue prompt taxonomy repairs low-signal imported gallery titles', () => {
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061346154642805147')),
    'Luxury Country Travel Portal Poster'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061440881685680521')),
    'Negative-Space Optical Illusion Poster'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061328524821365211')),
    'Moss-Textured Brand Logo Artifact'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061373514276651047')),
    'Balcony Iced Coffee Lifestyle Portrait'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061290699224387653')),
    'Vogue Magazine Fashion Grid Collage'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061421488188932217')),
    'Dark Luxury Gothic Magazine Cover'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061439592549466615')),
    'Golden Window Cinematic Portrait'
  );
});

test('midjourney prompt titles prefer the visible subject over aspect-ratio fragments', () => {
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061040008937582812')),
    'Japanese Optimus Prime Movie Poster'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2061085293944467746')),
    'Yorkshire Terrier Style Reference'
  );
  assert.equal(
    getVoguePromptDisplayTitle(getEntry('x-2059273353228157181')),
    'Xenomorph Style Reference'
  );
});
