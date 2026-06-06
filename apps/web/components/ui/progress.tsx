import { theme } from "@/lib/colors";

interface ProgressProps {
  steps: string[];
  currentStep: number;
}

export function Progress({ steps, currentStep }: ProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                backgroundColor:
                  index <= currentStep
                    ? theme.accents.primary
                    : theme.backgrounds.tertiary,
                color:
                  index <= currentStep
                    ? theme.text.inverse
                    : theme.text.muted,
                border:
                  index <= currentStep
                    ? "none"
                    : `1px solid ${theme.borders.medium}`,
              }}
            >
              {index + 1}
            </div>
            <div className="flex-1 mx-2 h-1">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    index < currentStep
                      ? theme.accents.primary
                      : theme.backgrounds.tertiary,
                  width: index < currentStep ? "100%" : "0%",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className="text-xs text-center"
            style={{
              color:
                index <= currentStep
                  ? theme.text.primary
                  : theme.text.muted,
              width: `${100 / steps.length}%`,
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
