export const shouldWatermarkGenerationOutput = ({
  hasPaidEntitlement,
}: {
  hasPaidEntitlement: boolean;
}) => {
  return !hasPaidEntitlement;
};

export const shouldWatermarkAnonymousOutput = () => true;
