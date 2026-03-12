declare module 'katex/dist/contrib/auto-render' {
  interface RenderMathInElementOptions {
    delimiters?: Array<{
      left: string;
      right: string;
      display: boolean;
    }>;
    ignoredTags?: string[];
    ignoredClasses?: string[];
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
    minRuleThickness?: number;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    strict?: boolean | 'ignore' | 'warn' | 'error' | ((errorCode: string, errorMsg: string, token: unknown) => boolean | 'ignore' | 'warn' | 'error');
    trust?: boolean | ((context: { command: string; url: string; protocol: string }) => boolean);
    globalGroup?: boolean;
  }

  function renderMathInElement(
    element: HTMLElement,
    options?: RenderMathInElementOptions
  ): void;

  export default renderMathInElement;
}
