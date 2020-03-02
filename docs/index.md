# spadille

Verifiable/deterministic fair tickets generation for lotteries, raffles and gambling games.

[![Azure DevOps builds](https://img.shields.io/azure-devops/build/marcoonroad/207dab13-7b85-4ce0-a62d-9af3ea14f98d/2?label=azure%20devops&logo=azure-devops)](https://dev.azure.com/marcoonroad/marcoonroad/_build?definitionId=2&_a=summary)
![Node.js CI](https://github.com/marcoonroad/spadille/workflows/Node.js%20CI/badge.svg)
[![Build Status](https://travis-ci.com/marcoonroad/spadille.svg?branch=master)](https://travis-ci.com/marcoonroad/spadille)
[![Coverage Status](https://coveralls.io/repos/github/marcoonroad/spadille/badge.svg?branch=master)](https://coveralls.io/github/marcoonroad/spadille?branch=master)

### About

This is a library to generate random luck numbers in a fair way. Rather than relying
on your process' PRNG blackbox (even if it's a cryptographic secure one), we can generate
noise/randomness that is verifiable through a deterministic/replayable algorithm. Such
kind of algorithms for casinos, raffles & promotions are called [Provably fair algorithms][1].

It becomes even more important when we run in a cluster of processes and we must ensure
that no matter which kind of process receives the request, it must deliver the same noise
output. We prove that property by using HMAC-like PRNG as shown [here][2]. We can keep
the random number generation secret by a moment by just keeping the "HMAC" key secret, and
then open/revealing that for clients during gambling/raffle output/outcome verification.

In a broader context, it can be used for Secure Multi-party Computations too (mostly through
Commitment Schemes). This library provides an API cross-compatible between servers (using Node.js
engine with support to `crypto` OpenSSL's bindings) and browsers (using modern browsers supporting
the `crypto.subtle` API). A good verification flow, thus, would be to generate such noise number
sequences on server-side and then verifying them on client-side.

### Installation

If available on NPM, just type either `npm i spadille` or `yarn add spadille`. Otherwise,
you can pin this project by `npm link .` or `yarn link`, and then linking externally with
either `npm link spadille` or `yarn link spadille`. The release/stable front-end CDN is
available on [UNPKG][3] once the library is available on NPM beforehand. Otherwise, you can just
grab the front-end minified code (at `dist/index.js`).

### Usage

To generate random sequences (paired on Brazillian lotteries if you want to run a raffle without
any kind of audit person):

```javascript
const Lottery = spadille.lottery.brazillian;
const megaSenaSequence = await Lottery.megaSena(secret, payload);
const federalNumbers = await Lottery.federal(secret, payload);
```

Here, `secret` is your "HMAC-signing"-key and `payload` is a user/session-derived content (possibly
a session ID, request ID, raffle counter, whatever...). The `megaSenaSequence` is a Mega-Sena lottery
sequence of unique and sorted numbers between 1 and 60, inclusively. Such sequence contains 6 numbers.
The `federalNumbers`, on the other hand, is a string of 5 digits, each one between 0 and 9, and this
sequence may contain repeated numbers (that is, a not unique sequence). Future plans include other famous Brazillian lotteries.

To generate arbitrary random sequences:

```javascript
const arbitrarySequence = await spadille.prng.generate({
  secret,
  payload,
  minimum: minimumInclusiveValue,
  maximum: maximumInclusiveValue,
  amount: outputSequenceLength,
  distinct: booleanFlag,
});
```

Such sequence can be made of many elements as you wish (but keep the eye on hardware limits, e.g,
the limits of 32-bits integer representation). The number of elements are configured by the `amount`
parameter. The `minimum` and `maximum` are point parameters for an inclusive interval (closed on
both sides). The `distinct` is a flag to compute the sequence of unique numbers (without repetitions).

If you want to generate a random number between 0 (closed interval) and 1 (open interval), there
is the wrapper function `spadille.prng.rand`, inspired on the classic Random API as found in
many programming languages in the wild. To use this function, just call:

```javascript
const randomFraction = await spadille.prng.rand(secret, payload);
```

Given that we can generate arbitrary sequences, the random permutation algorithm becomes
straightforward. This kind of permutation would just generate a random index sequence with
minimum as `0`, maximum as `inputSequence.length - 1` and amount as `inputSequence.length`,
where `inputSequence` is the list that we want to permute/shuffle. We then, in the end, use
such random index sequence to map `inputSequence` entries into an output sequence by indexing
with the random index sequence. This wrapper function is implemented as an API below:

```javascript
const inputSequence = [ ... ] // an arbitrary list
const outputSequence = await spadille.prng.permute({
  secret, payload, inputSequence
})
/*
 outputSequence is a random permutation of inputSequence
 keep in mind that there are a still unlikely probability
 of random collision where the inputSequence order could
 be preserved for outputSequence, even if this is negligible
*/
```

Likewise, it's possible to take only a randomly ordered sub-sequence from the
original sequence. This wrapper function is called `pick` and the contract/typing
follows:

```javascript
const classes = ['warrior', 'rogue', 'mage', 'priest', 'hunter', 'alchemist'];
const partyClasses = await spadille.prng.pick({
  secret,
  payload,
  sequence: classes,
  distinct: true, // optional, default is `false` for pick()
  amount: 3, // optional, default is `1` for pick()
});
```

Note that `{distinct: true}` only filters duplications on array-index-level, not
on array-value-level, it means that if your input sequence/array contains duplicated
values, they aren't deduplicated here. It also means if `{distinct: false}` and your
input sequence/array contain just unique values, it is possible to generate duplicated
values - it's all because picking is implemented on array-index-level generation.
The default behavior of `pick` is to retrieve just one random element from a given
sequence, but the output/result is still a list, thus, you will likely use the
following pattern in such cases:

```javascript
const [randomElement] = await spadille.prng.pick({secret, payload, sequence});
```

Note that `pick` will yield the same behavior of `permute` if you pass the same
`secret`, `payload`, sequence for both calls, and `{distinct: true}` with
`{amount: sequenceLength}` for `pick`. Therefore, `pick` is a generalisation/superset
of `permute`, and the latter can contain the underlying implementation calling the
former (actually this is not the case by now, but future refactor processes will end
on that code deduplication).

There's also a helper function provided to help you to generate fresh secrets.
By using cryptograpically secure PRNGs for both Node (through `crypto` OpenSSL
bindings) and browsers (through the `crypto` API), we ensure a good source of
entropy for that noise string. The output string is under binary mode, but you
can nevertheless convert to formats/encodings such as Base-64 and Hexadecimal.
Just pass the amount of bytes to generate and be happy with that! :)

```javascript
const amountOfBytes = 32;
const noiseSecret = await spadille.secret.generate(amountOfBytes);
```

Remember that once you generate such secret, you should store it somewhere
to retrieve later to "sign" the random sequences. And in the end, you should
also publish such secret in a commitment/opening style for public verification
by your users/clients.

Future plans include a `secret.generateBase64(amountOfBytes)` function to automatically
wrap the secret under Base64 format. By now, you will need to wrap using either
`btoa()` (browsers only) or `Buffer.from()` (Node.js only):

```javascript
// browsers only
const base64Secret = btoa(noiseSecret);
```

```javascript
// Node.js only
const base64Secret = Buffer.from(noiseSecret).toString('base64');
```

Future plans also include to automatically detect a Base64 string while generating and
verifying randomly generated values (to maintain backwards compatibility), nevertheless,
by now you'll also need to unwrap Base64 strings manually before passing them on this
library API:

```javascript
// browsers only
const secret = atob(base64Secret);
```

```javascript
// Node.js only
const secret = Buffer.from(base64Secret, 'base64').toString();
```

You can nevertheless create your own secrets by hand or through some other mechanism.
I don't recommend that if you want automated processes and stuff. This secret generation
uses the well-tested random bytes generation functions from browser vendors and Node.js.
If you stick on that manual approach by your own risk, ensure that:

- The secret contains high-quality entropy, using all available keyboard characters,
  even special ones such as `*&@#!:~><_(%$)[]{^}?`, everything as printable
  ASCII characters.
- The secret is a long enough string that make guessing impossible (I recommend above
  48 characters if you use all available printable ones, even the special characters).
- The secret don't parses itself as Base64, that is, use the special characters above
  to ensure that your secret is not a Base64 one, for instance, by appending them as
  suffix when you generate custom secrets as random long numbers. Note that suffix
  appending doesn't reduce the 48 characters security advise said above, you still
  need to generate such amount of entropy and ensure its quality.

If your custom generated secret fit such cases above, you can pass them on this library
API without no worries of broken backwards compatibility in the future.

### Remarks

Any doubts, enter in touch.
Pull requests and issues are welcome! Have fun playing with this library! Happy hacking!

[1]: https://en.wikipedia.org/wiki/Provably_fair
[2]: https://cryptogambling.org/whitepapers/provably-fair-algorithms.pdf
[3]: https://unpkg.com/spadille/dist/index.js
