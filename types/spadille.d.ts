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

interface PickOptions<T> {
  secret: string;
  payload: string;
  sequence: T[];
  amount?: number;
  distinct?: boolean;
}

declare const spadille: {
  lottery: {
    brazillian: {
      federal: (secret: string, payload: string) => Promise<number[]>;
      megaSena: (secret: string, payload: string) => Promise<string>;
    };
  };
  prng: {
    generate: (options: PRNGOptions) => Promise<number[]>;
    rand: (secret: string, payload: string) => Promise<number>;
    pick:<T>(options: PickOptions<T>) => Promise<T[]>;
    permute:<T>(options: PermutationOptions<T>) => Promise<T[]>;
  };
  secret: {
    generate: (bytes: number) => Promise<string>;
  };
  base64: {
    encode: (binary: string) => string;
    decode: (data: string) => string;
  };
};
