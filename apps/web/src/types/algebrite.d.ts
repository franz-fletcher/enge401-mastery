declare module 'algebrite' {
  const Algebrite: {
    run(expr: string): string;
    eval(expr: string): string;
  };
  export = Algebrite;
}
