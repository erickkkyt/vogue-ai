export type PromptI18nEntry = {
  id: string;
  parentId?: string;
  prompt: string;
};

export type PromptRemixSchemaForI18n = {
  variables?: Array<{
    defaultValue?: string;
  }>;
};

export type PromptRemixSchemaMapForI18n = Record<
  string,
  PromptRemixSchemaForI18n | undefined
>;

const protectedTokenPatterns = [
  /\[[A-Z][A-Z0-9 _/-]{1,80}\]/g,
  /--[a-zA-Z][a-zA-Z0-9-]*/g,
  /https?:\/\/[^\s"'<>]+/g,
  /#[0-9a-fA-F]{3,8}\b/g,
  /\b\d+\s*x\s*\d+\b/gi,
  /\b\d+:\d+\b/g,
];

export function collectRemixVariableProtectedTokens(
  entry: PromptI18nEntry,
  remixSchemas: PromptRemixSchemaMapForI18n
) {
  const schema =
    remixSchemas[entry.id] ??
    (entry.parentId ? remixSchemas[entry.parentId] : null);
  const tokens = new Set<string>();

  for (const variable of schema?.variables ?? []) {
    const defaultValue = variable.defaultValue?.trim();
    if (
      defaultValue &&
      defaultValue.length <= 240 &&
      entry.prompt.includes(defaultValue)
    ) {
      tokens.add(defaultValue);
    }
  }

  return [...tokens];
}

export function collectPromptProtectedTokens(
  value: string,
  extraTokens: string[] = []
) {
  const tokens = new Set<string>();

  for (const pattern of protectedTokenPatterns) {
    for (const match of value.matchAll(pattern)) {
      const token = match[0].trim();
      if (token) tokens.add(token);
    }
  }

  for (const token of extraTokens) {
    const trimmedToken = token.trim();
    if (
      trimmedToken &&
      trimmedToken.length <= 240 &&
      value.includes(trimmedToken)
    ) {
      tokens.add(trimmedToken);
    }
  }

  return [...tokens].filter((token) => token.length <= 240);
}

export function protectPromptForLocalization(
  value: string,
  extraTokens: string[] = []
) {
  const tokens = collectPromptProtectedTokens(value, extraTokens).sort(
    (left, right) => right.length - left.length
  );
  let protectedValue = value;
  const replacements: Array<[marker: string, token: string]> = [];

  tokens.forEach((token, index) => {
    const marker = `@@VOGUE_KEEP_${index}@@`;
    replacements.push([marker, token]);
    protectedValue = protectedValue.split(token).join(marker);
  });

  return {
    value: protectedValue,
    restore(nextValue: string) {
      return replacements.reduce(
        (current, [marker, token]) => current.split(marker).join(token),
        nextValue
      );
    },
  };
}
