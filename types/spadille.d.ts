export = spadille;

interface PRNGOptions {
  secret: string,
  payload: string,
  minimum: number,
  maximum: number,
  amount: number,
  distinct: boolean
}

interface PermutationOptions<T> {
  secret: string,
  payload: string,
  inputSequence: T[]
}

declare const spadille: {
  lottery: {
    brazillian: {
      federal: (secret : string, payload : string) => Promise<number[]>;
      megaSena: (secret: string, payload: string) => Promise<string>;
    };
  };
  prng: {
    generate: (options : PRNGOptions) => Promise<number[]>;
    permute:<T>(options : PermutationOptions<T>) => Promise<T[]>;
  };
  secret: {
    generate: (bytes : number) => Promise<string>;
  };
};
