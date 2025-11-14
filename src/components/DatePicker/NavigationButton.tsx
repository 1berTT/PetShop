import { TooltipContent } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type NavigationButtonProps = {
  tooltipText: string;
  children: React.ReactNode;
  onClick: () => void;
};

export function NavigationButton({
  children,
  onClick,
  tooltipText,
}: NavigationButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            className="h-12 w-9 bg-transparent border-border-primary text-content-primary 
            hover:bg-background-tertiary hover:border-border-secondary 
            hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand
             focus:border-border-brand focus-visible:border-border-brand"
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-background-tertiary">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
