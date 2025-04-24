Failed to compile.
app/reviews/page.tsx
Type error: Type '{ searchParams?: { [key: string]: string | string[] | undefined; } | undefined; }' does not satisfy the constraint 'PageProps'.
  Types of property 'searchParams' are incompatible.
    Type '{ [key: string]: string | string[] | undefined; } | undefined' is not assignable to type 'Promise<any> | undefined'.
      Type '{ [key: string]: string | string[] | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
Next.js build worker exited with code: 1 and signal: null
Error: Command "npm run build" exited with 1