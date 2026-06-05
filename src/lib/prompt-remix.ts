export type PromptRemixVariable = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
};

export type PromptRemixSchema = {
  promptId: string;
  variables: PromptRemixVariable[];
  keepTerms: string[];
};

export type PromptRemixValues = Record<string, string>;

export type PromptRemixSegment =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'variable';
      text: string;
      key: string;
      label: string;
    }
  | {
      type: 'keep';
      text: string;
    };

export type PromptRemixVariableRange = {
  key: string;
  label: string;
  defaultValue: string;
  suggestions: string[];
  start: number;
  end: number;
  text: string;
};

const promptRemixSchemas: Record<string, PromptRemixSchema> = {
  'vogueai-20260603-watercolor-travel-poster-ai-prompt': {
    promptId: 'vogueai-20260603-watercolor-travel-poster-ai-prompt',
    variables: [
      {
        key: 'landmark',
        label: 'Landmark',
        defaultValue: 'Sanssouci Palace',
        suggestions: [
          'Eiffel Tower',
          'Tower Bridge',
          'Kiyomizu-dera',
          'Brooklyn Bridge',
        ],
      },
      {
        key: 'city',
        label: 'City',
        defaultValue: 'Potsdam',
        suggestions: ['Paris', 'London', 'Kyoto', 'New York'],
      },
      {
        key: 'country',
        label: 'Country',
        defaultValue: 'Germany',
        suggestions: ['France', 'United Kingdom', 'Japan', 'United States'],
      },
      {
        key: 'viewpoint',
        label: 'Viewpoint',
        defaultValue: 'a graceful pedestrian path',
        suggestions: [
          'a quiet riverside street corner',
          'a temple approach lined with maple trees',
          'a garden path after light rain',
          'a narrow old-town alley',
        ],
      },
      {
        key: 'time',
        label: 'Light',
        defaultValue: 'warm late-afternoon light',
        suggestions: [
          'soft spring morning light',
          'pale morning light after rain',
          'misty golden hour',
          'quiet blue-hour glow',
        ],
      },
      {
        key: 'title',
        label: 'Title',
        defaultValue: 'Sanssouci',
        suggestions: ['Paris', 'London', 'Kyoto', 'Brooklyn'],
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        defaultValue: 'Potsdam, Germany',
        suggestions: [
          'La Seine, France',
          'Tower Bridge, London',
          'Higashiyama, Kyoto',
          'Brooklyn, New York',
        ],
      },
    ],
    keepTerms: [
      'watercolor and fine ink urban sketch',
      'visible cotton paper texture',
      'refined travel journal aesthetic',
      'large clean whitespace',
      'soft sepia ink',
    ],
  },
  'vogueai-20260603-double-exposure-city-poster-ai-prompt': {
    promptId: 'vogueai-20260603-double-exposure-city-poster-ai-prompt',
    variables: [
      {
        key: 'cityA',
        label: 'City A',
        defaultValue: 'San Antonio',
        suggestions: ['Los Angeles', 'Chicago', 'Miami', 'Tokyo'],
      },
      {
        key: 'cityB',
        label: 'City B',
        defaultValue: 'New York',
        suggestions: ['Boston', 'Seattle', 'Paris', 'Seoul'],
      },
      {
        key: 'subjectA',
        label: 'Subject A',
        defaultValue: 'Victor Wembanyama',
        suggestions: [
          'a fictional home-team guard',
          'a rising basketball star',
          'a streetball captain',
          'a masked tournament MVP',
        ],
      },
      {
        key: 'subjectB',
        label: 'Subject B',
        defaultValue: 'Jalen Brunson',
        suggestions: [
          'a fictional away-team scorer',
          'a veteran playmaker',
          'a downtown shooting guard',
          'a calm playoff closer',
        ],
      },
      {
        key: 'moodA',
        label: 'Color A',
        defaultValue: 'silver, black, and white light',
        suggestions: [
          'crimson and gold arena light',
          'deep purple and sunset orange light',
          'teal and white neon light',
          'forest green and cream light',
        ],
      },
      {
        key: 'moodB',
        label: 'Color B',
        defaultValue: 'deep royal blue and orange light',
        suggestions: [
          'midnight navy and copper light',
          'electric blue and white light',
          'black and red tunnel light',
          'violet and silver light',
        ],
      },
      {
        key: 'headline',
        label: 'Headline',
        defaultValue: 'GAME NIGHT',
        suggestions: ['CITY SHOWDOWN', 'RIVALRY NIGHT', 'FINAL RUN', 'THE REMATCH'],
      },
      {
        key: 'subtitle',
        label: 'Subtitle',
        defaultValue: 'SAN ANTONIO vs NEW YORK',
        suggestions: [
          'LOS ANGELES vs BOSTON',
          'CHICAGO vs MIAMI',
          'TOKYO vs SEOUL',
          'HOME CITY vs AWAY CITY',
        ],
      },
    ],
    keepTerms: [
      'cinematic double exposure',
      'high-end sports magazine cover look',
      'bright rim-light collision line',
      'clean lower area reserved for typography',
      'realistic editorial portrait lighting',
    ],
  },
  'vogueai-20260603-codex-macos-permission-dialog-ai-prompt': {
    promptId: 'vogueai-20260603-codex-macos-permission-dialog-ai-prompt',
    variables: [
      {
        key: 'agent',
        label: 'Agent',
        defaultValue: 'Codex',
        suggestions: ['VogueAI', 'Design Bot', 'Build Agent', 'Research Copilot'],
      },
      {
        key: 'app',
        label: 'Target app',
        defaultValue: 'OnlyFans',
        suggestions: ['Figma', 'Steam', 'Xcode', 'Photoshop'],
      },
      {
        key: 'action',
        label: 'Funny action',
        defaultValue: 'pretend it is researching creator subscription business models',
        suggestions: [
          'rename every layer before the designer notices',
          'verify whether the bug also happens at 144 FPS',
          'open one more tab for serious product research',
          'turn the meeting notes into a suspiciously polished deck',
        ],
      },
      {
        key: 'tone',
        label: 'Tone',
        defaultValue: 'deadpan tech humor',
        suggestions: [
          'dry startup humor',
          'quiet product-team sarcasm',
          'deadpan developer humor',
          'polite system warning humor',
        ],
      },
      {
        key: 'button',
        label: 'Button',
        defaultValue: 'Allow',
        suggestions: ['Allow', 'Open App', 'Continue', 'Not Now'],
      },
    ],
    keepTerms: [
      'realistic macOS screenshot',
      'dark cinematic UI',
      'clean typography',
      'centered macOS permission dialog',
      'English only',
    ],
  },
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAllLiteral = (source: string, target: string, replacement: string) => {
  if (!target || target === replacement) return source;
  return source.replace(new RegExp(escapeRegExp(target), 'g'), replacement);
};

const getResolvedVariableValue = (
  variable: PromptRemixVariable,
  values: PromptRemixValues
) => values[variable.key]?.trim() || variable.defaultValue;

export const getPromptRemixSchema = (promptId: string) =>
  promptRemixSchemas[promptId] ?? null;

export const getInitialPromptRemixValues = (
  schema: PromptRemixSchema | null
): PromptRemixValues =>
  Object.fromEntries(
    (schema?.variables ?? []).map((variable) => [
      variable.key,
      variable.defaultValue,
    ])
  );

export const applyPromptRemixValues = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
) => {
  if (!schema) return prompt;

  return schema.variables.reduce((nextPrompt, variable) => {
    const nextValue = getResolvedVariableValue(variable, values);
    return replaceAllLiteral(nextPrompt, variable.defaultValue, nextValue);
  }, prompt);
};

export const formatPromptForRemixDisplay = (prompt: string) =>
  prompt.replace(/\s+/g, ' ').trim();

export const buildPromptRemixSegments = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
): PromptRemixSegment[] => {
  if (!schema) return [{ type: 'text', text: prompt }];

  const candidates = [
    ...schema.variables.flatMap((variable) => {
      const value = getResolvedVariableValue(variable, values);
      if (!value) return [];

      return findLiteralMatches(prompt, value).map((match) => ({
        ...match,
        type: 'variable' as const,
        key: variable.key,
        label: variable.label,
        priority: 2,
      }));
    }),
    ...schema.keepTerms.flatMap((term) =>
      findLiteralMatches(prompt, term).map((match) => ({
        ...match,
        type: 'keep' as const,
        priority: 1,
      }))
    ),
  ].toSorted(
    (left, right) =>
      left.start - right.start ||
      right.priority - left.priority ||
      right.text.length - left.text.length
  );

  const segments: PromptRemixSegment[] = [];
  let cursor = 0;

  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;

    if (candidate.start > cursor) {
      segments.push({
        type: 'text',
        text: prompt.slice(cursor, candidate.start),
      });
    }

    if (candidate.type === 'variable') {
      segments.push({
        type: 'variable',
        text: candidate.text,
        key: candidate.key,
        label: candidate.label,
      });
    } else {
      segments.push({
        type: 'keep',
        text: candidate.text,
      });
    }

    cursor = candidate.end;
  }

  if (cursor < prompt.length) {
    segments.push({
      type: 'text',
      text: prompt.slice(cursor),
    });
  }

  return segments;
};

const findLiteralMatches = (source: string, value: string) => {
  const matches: Array<{ start: number; end: number; text: string }> = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = source.indexOf(value, searchFrom);
    if (start === -1) break;

    matches.push({
      start,
      end: start + value.length,
      text: value,
    });
    searchFrom = start + value.length;
  }

  return matches;
};

export const getPromptRemixVariableRanges = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues
): PromptRemixVariableRange[] => {
  if (!schema) return [];

  const candidates = schema.variables
    .flatMap((variable) => {
      const value = getResolvedVariableValue(variable, values);
      if (!value) return [];

      return findLiteralMatches(prompt, value).map((match) => ({
        key: variable.key,
        label: variable.label,
        defaultValue: variable.defaultValue,
        suggestions: variable.suggestions,
        start: match.start,
        end: match.end,
        text: match.text,
      }));
    })
    .toSorted(
      (left, right) =>
        left.start - right.start || right.text.length - left.text.length
    );

  const ranges: PromptRemixVariableRange[] = [];
  let cursor = 0;

  for (const candidate of candidates) {
    if (candidate.start < cursor) continue;
    ranges.push(candidate);
    cursor = candidate.end;
  }

  return ranges;
};

export const findPromptRemixVariableAtOffset = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues,
  offset: number
) =>
  getPromptRemixVariableRanges(prompt, schema, values).find(
    (range) => offset >= range.start && offset <= range.end
  ) ?? null;

export const replacePromptRemixVariableValue = (
  prompt: string,
  schema: PromptRemixSchema | null,
  values: PromptRemixValues,
  key: string,
  nextValue: string
) => {
  if (!schema) return { prompt, values };

  const variable = schema.variables.find((candidate) => candidate.key === key);
  if (!variable) return { prompt, values };

  const currentValue = getResolvedVariableValue(variable, values);
  const resolvedNextValue = nextValue.trim() || variable.defaultValue;
  let nextPrompt = replaceAllLiteral(prompt, currentValue, resolvedNextValue);

  if (nextPrompt === prompt && currentValue !== variable.defaultValue) {
    nextPrompt = replaceAllLiteral(
      prompt,
      variable.defaultValue,
      resolvedNextValue
    );
  }

  return {
    prompt: nextPrompt,
    values: {
      ...values,
      [key]: resolvedNextValue,
    },
  };
};
